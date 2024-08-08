import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
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
import * as autoscaling from 'aws-cdk-lib/aws-autoscaling';

export interface AutoScalingGroupProps {
  asgName: string;
  vpc: ec2.IVpc;
  stage: STAGES;
  instanceType?: ec2.InstanceType;
  machineImage?: ec2.IMachineImage;
  userData?: ec2.UserData;
  minCapacity?: number;
  maxCapacity?: number;
  desiredCapacity?: number;
  subnetType?: ec2.SubnetType;
  securityGroup?: ec2.SecurityGroup;
  keyName?: string;
}

export const createDefaultVpc = (
  vpcId: string,
  vpcName: string,
  maxAzs: number,
  construct: Construct,
  stage: STAGES,
  isPublic: boolean = true
): ec2.Vpc => {
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

export const createDefaultSecurityGroup = (
  securityGroupId: string,
  securityGroupName: string,
  vpc: ec2.Vpc,
  securityGroupDescription: string,
  stage: STAGES,
  construct: Construct
): ec2.SecurityGroup => {
  return new ec2.SecurityGroup(construct, `${securityGroupId}`, {
    securityGroupName: `${securityGroupName}-${stage}`,
    vpc: vpc,
    description: securityGroupDescription,
    allowAllOutbound: true,
  });
};
export const addIngressRule = (
  securityGroup: ec2.SecurityGroup,
  port: ec2.Port,
  description: string
) => {
  securityGroup.addIngressRule(ec2.Peer.anyIpv4(), port, description);
};

export const createUserData = (commands: string[]): ec2.UserData => {
  const userData = ec2.UserData.forLinux();
  userData.addCommands(...commands);
  return userData;
};
export const createDefaultEc2Instance = (
  ec2InstanceId: string,
  ec2InstanceName: string,
  instanceType: string,
  machineImage: string,
  vpc: ec2.Vpc,
  securityGroup: ec2.SecurityGroup,
  userDataContent: string,
  region: string,
  stage: STAGES,
  construct: Construct
): ec2.Instance => {
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

export const createAndAssignDefaultElasticIp = (
  eipName: string,
  ec2Instance: ec2.Instance,
  stage: STAGES,
  construct: Construct
) => {
  const eip = new ec2.CfnEIP(construct, `${eipName}`);
  new ec2.CfnEIPAssociation(construct, `${eipName}-${stage}-EIPAssociation`, {
    eip: eip.ref,
    instanceId: ec2Instance.instanceId,
  });
};

/**
 * Method to allow ssh into EC2 instances by attaching Session Manager Policy
 * @param instance
 */
export const attachSSMPolicyToEC2Instance = (instance: ec2.Instance) => {
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
export const createDefaultAutoScalingGroup = (
  construct: Construct,
  props: AutoScalingGroupProps
): autoscaling.AutoScalingGroup => {
  const keyName =
    props.keyName ?? createEC2KeyPair(construct, props.asgName, props.stage);

  return new autoscaling.AutoScalingGroup(
    construct,
    `${props.asgName}-${props.stage}`,
    {
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
      keyName: keyName,
      associatePublicIpAddress: props.subnetType === ec2.SubnetType.PUBLIC,
    }
  );


};
