import {
  IVpc,
  InstanceType,
  IMachineImage,
  UserData,
  SubnetType,
  SecurityGroup,
  Vpc,
  Port,
  Peer,
  Instance,
  GenericLinuxImage,
  CfnEIP,
  CfnEIPAssociation,
  CfnKeyPair,
} from 'aws-cdk-lib/aws-ec2';
import { Key } from 'aws-cdk-lib/aws-kms'; // why is this here ?
import { Secret } from 'aws-cdk-lib/aws-secretsmanager'; // why is this here ?
import { Construct } from 'constructs';
import { attachManagedPolicyToRole } from './iamCommons';
import {
  MANAGED_POLICIES,
  STAGES,
  DEFAULT_ASG_INSTANCE_TYPE,
  DEFAULT_ASG_MACHINE_IMAGE,
  DEFAULT_ASG_MIN_CAPACITY,
  DEFAULT_ASG_MAX_CAPACITY,
  DEFAULT_ASG_DESIRED_CAPACITY,
  DEFAULT_ASG_SUBNET_TYPE,
} from './commonConstants';
import { IRole } from 'aws-cdk-lib/aws-iam';
import { AutoScalingGroup } from 'aws-cdk-lib/aws-autoscaling';

export interface AutoScalingGroupProps {
  asgName: string;
  vpc: IVpc;
  stage: STAGES;
  instanceType?: InstanceType;
  machineImage?: IMachineImage;
  userData?: UserData;
  minCapacity?: number;
  maxCapacity?: number;
  desiredCapacity?: number;
  subnetType?: SubnetType;
  securityGroup?: SecurityGroup;
  keyName?: string;
  role?: IRole;
}

export const createDefaultVpc = (
  vpcId: string,
  vpcName: string,
  maxAzs: number,
  construct: Construct,
  stage: STAGES,
  isPublic: boolean = true
): Vpc => {
  return new Vpc(construct, `${vpcId}`, {
    vpcName: `${vpcName}-${stage}`,
    maxAzs: maxAzs,
    subnetConfiguration: [
      {
        name: `${vpcName}-${stage}-SubnetConfig`,
        subnetType: isPublic
          ? SubnetType.PUBLIC
          : SubnetType.PRIVATE_WITH_EGRESS,
        // This determines whether EC2 instance will have access to public internet or not
      },
    ],
  });
};

export const createDefaultSecurityGroup = (
  securityGroupName: string,
  vpc: Vpc,
  securityGroupDescription: string,
  stage: STAGES,
  construct: Construct
): SecurityGroup => {
  return new SecurityGroup(construct, `${securityGroupName}-${stage}`, {
    securityGroupName: `${securityGroupName}-${stage}`,
    vpc: vpc,
    description: securityGroupDescription,
    allowAllOutbound: true,
  });
};
export const addIngressRule = (
  securityGroup: SecurityGroup,
  port: Port,
  description: string
) => {
  securityGroup.addIngressRule(Peer.anyIpv4(), port, description);
};

export const createUserData = (commands: string[]): UserData => {
  const userData = UserData.forLinux();
  userData.addCommands(...commands);
  return userData;
};
export const createDefaultEc2Instance = (
  ec2InstanceName: string,
  instanceType: string,
  machineImage: string,
  vpc: Vpc,
  securityGroup: SecurityGroup,
  userDataContent: string,
  region: string,
  stage: STAGES,
  construct: Construct
): Instance => {
  const genericLinuxImage = new GenericLinuxImage({
    [region]: machineImage,
  });
  const userDataScript = UserData.custom(userDataContent);
  return new Instance(construct, `${ec2InstanceName}-${stage}`, {
    instanceType: new InstanceType(instanceType),
    instanceName: `${ec2InstanceName}-${stage}`,
    machineImage: genericLinuxImage,
    vpc: vpc,
    securityGroup: securityGroup,
    userData: userDataScript,
  });
};

export const createAndAssignDefaultElasticIp = (
  eipName: string,
  ec2Instance: Instance,
  stage: STAGES,
  construct: Construct
) => {
  const eip = new CfnEIP(construct, `${eipName}`);
  new CfnEIPAssociation(construct, `${eipName}-${stage}-EIPAssociation`, {
    eip: eip.ref,
    instanceId: ec2Instance.instanceId,
  });
};

/**
 * Method to allow ssh into EC2 instances by attaching Session Manager Policy
 * @param instance
 */
export const attachSSMPolicyToEC2Instance = (instance: Instance) => {
  attachManagedPolicyToRole(
    instance.role,
    MANAGED_POLICIES.SSM_MANAGED_INSTANCE_CORE
  );
};
export const createEC2KeyPair = (
  construct: Construct,
  keyPairName: string,
  stage: STAGES
): string => {
  const key = new Key(construct, `${keyPairName}Key-${stage}`, {
    enableKeyRotation: true,
  });

  const keyPair = new CfnKeyPair(construct, `${keyPairName}-${stage}`, {
    keyName: `${keyPairName}-${stage}`,
  });

  new Secret(construct, `${keyPairName}Secret-${stage}`, { // why is this here ?
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
export const createDefaultAutoScalingGroup = (
  construct: Construct,
  props: AutoScalingGroupProps
): AutoScalingGroup => {
  const keyName =
    props.keyName ?? createEC2KeyPair(construct, props.asgName, props.stage);

  return new AutoScalingGroup(construct, `${props.asgName}-${props.stage}`, {
    autoScalingGroupName: `${props.asgName}-${props.stage}`,
    vpc: props.vpc,
    instanceType: props.instanceType || DEFAULT_ASG_INSTANCE_TYPE,
    machineImage: props.machineImage || DEFAULT_ASG_MACHINE_IMAGE,
    userData: props.userData,
    minCapacity: props.minCapacity ?? DEFAULT_ASG_MIN_CAPACITY,
    maxCapacity: props.maxCapacity ?? DEFAULT_ASG_MAX_CAPACITY,
    desiredCapacity: props.desiredCapacity ?? DEFAULT_ASG_DESIRED_CAPACITY,
    vpcSubnets: { subnetType: props.subnetType || DEFAULT_ASG_SUBNET_TYPE },
    securityGroup: props.securityGroup,
    keyName: keyName, // why is this here ? its deprecated
    associatePublicIpAddress: props.subnetType === SubnetType.PUBLIC,
    role: props.role,
  });
};
