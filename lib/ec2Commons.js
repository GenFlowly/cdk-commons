'use strict';
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (
          !desc ||
          ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v });
      }
    : function (o, v) {
        o['default'] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.createDefaultAutoScalingGroup =
  exports.createEC2KeyPair =

  exports.attachSSMPolicyToEC2Instance =
  exports.createAndAssignDefaultElasticIp =
  exports.createDefaultEc2Instance =
  exports.createUserData =
  exports.addIngressRule =
  exports.createDefaultSecurityGroup =
  exports.createDefaultVpc =
    void 0;
const ec2 = __importStar(require('aws-cdk-lib/aws-ec2'));
const kms = __importStar(require('aws-cdk-lib/aws-kms'));
const secretsmanager = __importStar(require('aws-cdk-lib/aws-secretsmanager'));
const iamCommons_1 = require('./iamCommons');
const commonConstants_1 = require('./commonConstants');
const autoscaling = __importStar(require('aws-cdk-lib/aws-autoscaling'));
const createDefaultVpc = (
  vpcId,
  vpcName,
  maxAzs,
  construct,
  stage,
  isPublic = true
) => {
  return new ec2.Vpc(construct, `${vpcId}`, {
    vpcName: `${vpcName}-${stage}`,
    maxAzs: maxAzs,
    subnetConfiguration: [
      {
        name: `${vpcName}-${stage}-SubnetConfig`,
        subnetType: isPublic
          ? ec2.SubnetType.PUBLIC
          : ec2.SubnetType.PRIVATE_WITH_EGRESS,
        // This determines whether EC2 instance will have access to public internet or not
      },
    ],
  });
};
exports.createDefaultVpc = createDefaultVpc;
const createDefaultSecurityGroup = (
  securityGroupId,
  securityGroupName,
  vpc,
  securityGroupDescription,
  stage,
  construct
) => {
  return new ec2.SecurityGroup(construct, `${securityGroupId}`, {
    securityGroupName: `${securityGroupName}-${stage}`,
    vpc: vpc,
    description: securityGroupDescription,
    allowAllOutbound: true,
  });
};
exports.createDefaultSecurityGroup = createDefaultSecurityGroup;
const addIngressRule = (securityGroup, port, description) => {
  securityGroup.addIngressRule(ec2.Peer.anyIpv4(), port, description);
};
exports.addIngressRule = addIngressRule;
const createUserData = (commands) => {
  const userData = ec2.UserData.forLinux();
  userData.addCommands(...commands);
  return userData;
};
exports.createUserData = createUserData;
const createDefaultEc2Instance = (
  ec2InstanceId,
  ec2InstanceName,
  instanceType,
  machineImage,
  vpc,
  securityGroup,
  userDataContent,
  region,
  stage,
  construct
) => {
  const genericLinuxImage = new ec2.GenericLinuxImage({
    [region]: machineImage,
  });
  const userDataScript = ec2.UserData.custom(userDataContent);
  return new ec2.Instance(construct, `${ec2InstanceId}-${stage}`, {
    instanceType: new ec2.InstanceType(instanceType),
    instanceName: `${ec2InstanceName}-${stage}`,
    machineImage: genericLinuxImage,
    vpc: vpc,
    securityGroup: securityGroup,
    userData: userDataScript,
  });
};
exports.createDefaultEc2Instance = createDefaultEc2Instance;
const createAndAssignDefaultElasticIp = (
  eipName,
  ec2Instance,
  stage,
  construct
) => {
  const eip = new ec2.CfnEIP(construct, `${eipName}`);
  new ec2.CfnEIPAssociation(construct, `${eipName}-${stage}-EIPAssociation`, {
    eip: eip.ref,
    instanceId: ec2Instance.instanceId,
  });
};
exports.createAndAssignDefaultElasticIp = createAndAssignDefaultElasticIp;
/**
 * Method to allow ssh into EC2 instances by attaching Session Manager Policy
 * @param instance
 */
const attachSSMPolicyToEC2Instance = (instance) => {
  (0, iamCommons_1.attachManagedPolicyToRole)(
    instance.role,
    commonConstants_1.MANAGED_POLICIES.SSM_MANAGED_INSTANCE_CORE
  );
};
exports.attachSSMPolicyToEC2Instance = attachSSMPolicyToEC2Instance;
const createEC2KeyPair = (construct, keyPairName, stage) => {
  const key = new kms.Key(construct, `${keyPairName}Key-${stage}`, {
    enableKeyRotation: true,
  });
  const keyPair = new ec2.CfnKeyPair(construct, `${keyPairName}-${stage}`, {
    keyName: `${keyPairName}-${stage}`,
  });
  new secretsmanager.Secret(construct, `${keyPairName}Secret-${stage}`, {
    secretName: `ec2-ssh-key/${keyPairName}-${stage}`,
    description: 'SSH key for EC2 instances',
    encryptionKey: key,
    generateSecretString: {
      secretStringTemplate: JSON.stringify({ keyPairName: keyPair.keyName }),
      generateStringKey: 'privateKey',
      excludeCharacters: '/"',
    },
  });
  return keyPair.keyName;
};
exports.createEC2KeyPair = createEC2KeyPair;
const createDefaultAutoScalingGroup = (construct, props) => {
  var _a, _b, _c, _d;
  const keyName =
    (_a = props.keyName) !== null && _a !== void 0
      ? _a
      : (0, exports.createEC2KeyPair)(construct, props.asgName, props.stage);
  return new autoscaling.AutoScalingGroup(
    construct,
    `${props.asgName}-${props.stage}`,
    {
      autoScalingGroupName: `${props.asgName}-${props.stage}`,
      vpc: props.vpc,
      instanceType:
        props.instanceType || commonConstants_1.DEFAULT_ASG_INSTANCE_TYPE,
      machineImage:
        props.machineImage || commonConstants_1.DEFAULT_ASG_MACHINE_IMAGE,
      userData: props.userData,
      minCapacity:
        (_b = props.minCapacity) !== null && _b !== void 0
          ? _b
          : commonConstants_1.DEFAULT_ASG_MIN_CAPACITY,
      maxCapacity:
        (_c = props.maxCapacity) !== null && _c !== void 0
          ? _c
          : commonConstants_1.DEFAULT_ASG_MAX_CAPACITY,
      desiredCapacity:
        (_d = props.desiredCapacity) !== null && _d !== void 0
          ? _d
          : commonConstants_1.DEFAULT_ASG_DESIRED_CAPACITY,
      vpcSubnets: {
        subnetType:
          props.subnetType || commonConstants_1.DEFAULT_ASG_SUBNET_TYPE,
      },
      securityGroup: props.securityGroup,
      keyName: keyName,
      associatePublicIpAddress: props.subnetType === ec2.SubnetType.PUBLIC,
    }
  );
};
exports.createDefaultAutoScalingGroup = createDefaultAutoScalingGroup;

