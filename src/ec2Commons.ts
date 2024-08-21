import {
  InstanceType,
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
  IMachineImage,
} from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { attachManagedPolicyToRole } from './iamCommons';
import { MANAGED_POLICIES, STAGES } from './commonConstants';

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
export const createGenericLinuxMachineImage = (
  region: string,
  amiId: string
): IMachineImage => {
  return new GenericLinuxImage({
    [region]: amiId,
  });
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
  const genericLinuxMachineImage = createGenericLinuxMachineImage(
    region,
    machineImage
  );
  const userDataScript = UserData.custom(userDataContent);
  return new Instance(construct, `${ec2InstanceName}-${stage}`, {
    instanceType: new InstanceType(instanceType),
    instanceName: `${ec2InstanceName}-${stage}`,
    machineImage: genericLinuxMachineImage,
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
