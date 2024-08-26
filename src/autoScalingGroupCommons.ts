import { AutoScalingGroup } from 'aws-cdk-lib/aws-autoscaling';
import {
  IVpc,
  InstanceType,
  IMachineImage,
  UserData,
  SubnetType,
  SecurityGroup,
  MachineImage,
} from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { attachManagedPolicyToRole } from './iamCommons';
import {
  MANAGED_POLICIES,
  STAGES,
  DEFAULT_ASG_INSTANCE_TYPE,
  ASG_CAPACITY,
  DEFAULT_ASG_SUBNET_TYPE,
  UBUNTU_AMI_NAME_PATTERN,
  UBUNTU_AMI_OWNER,
} from './commonConstants';
import { IRole } from 'aws-cdk-lib/aws-iam';

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

export const createDefaultAutoScalingGroup = (
  construct: Construct,
  props: AutoScalingGroupProps
): AutoScalingGroup => {
  const genericLinuxMachineImage = MachineImage.lookup({
    name: UBUNTU_AMI_NAME_PATTERN,
    owners: [UBUNTU_AMI_OWNER],
  });
  const asg = new AutoScalingGroup(
    construct,
    `${props.asgName}-${props.stage}`,
    {
      autoScalingGroupName: `${props.asgName}-${props.stage}`,
      vpc: props.vpc,
      instanceType: props.instanceType || DEFAULT_ASG_INSTANCE_TYPE,
      machineImage: props.machineImage || genericLinuxMachineImage,
      userData: props.userData,
      minCapacity: props.minCapacity ?? ASG_CAPACITY.MIN,
      maxCapacity: props.maxCapacity ?? ASG_CAPACITY.MAX,
      desiredCapacity: props.desiredCapacity ?? ASG_CAPACITY.MIN,
      vpcSubnets: { subnetType: props.subnetType || DEFAULT_ASG_SUBNET_TYPE },
      securityGroup: props.securityGroup,
      associatePublicIpAddress: props.subnetType === SubnetType.PUBLIC,
      role: props.role,
    }
  );

  // Attach the SSM Managed Instance Core policy to the ASG's role
  attachManagedPolicyToRole(
    asg.role,
    MANAGED_POLICIES.SSM_MANAGED_INSTANCE_CORE
  );

  return asg;
};
