import {
  InstanceType,
  InstanceClass,
  InstanceSize,
  MachineImage,
  SubnetType,
} from 'aws-cdk-lib/aws-ec2';
import { ApplicationLoadBalancerProps } from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { Duration, RemovalPolicy } from 'aws-cdk-lib';

export const ALLOWED_HTTP_PORT: number = 80;
export const ALLOWED_HTTPS_PORT: number = 443;
export const ALLOWED_LDAP_PORT: number = 389;

export const GITHUB_ACTIONS_IAM_USER: string = 'GitHubActions';
export const GITHUB_ACTIONS_ACTION_KEY: string = 'GitHubActionsActionKey';

export const T2_NANO: string = 't2.nano';
export const UBUNTU_64_X86_AMI: string = 'ami-007855ac798b5175e';

export enum HTTP_METHODS {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
  HEAD = 'HEAD',
  OPTIONS = 'OPTIONS',
}

export enum HTTP_STATUS_CODES {
  OK = '200',
  Created = '201',
  Accepted = '202',
  NoContent = '204',
  BadRequest = '400',
  Unauthorized = '401',
  Forbidden = '403',
  NotFound = '404',
  InternalServerError = '500',
  NotImplemented = '501',
}

export enum MANAGED_POLICIES {
  STEP_FUNCTIONS_READ_ONLY = 'AWSStepFunctionsReadOnlyAccess',
  SSM_MANAGED_INSTANCE_CORE = 'AmazonSSMManagedInstanceCore',
}

export enum STAGES {
  PROD = 'production',
  BETA = 'development',
  GAMMA = 'pre-prod',
}

export enum LAMBDA_TIMEOUT {
  LAMBDA_TIMEOUT_MAX = 15,
  LAMBDA_TIMEOUT_MEDIUM = 6,
  LAMBDA_TIMEOUT_MIN = 2,
  ONE = 1,
}

export enum LAMBDA_MEMORY {
  LAMBDA_MEMORY_MIN = 128,
  LAMBDA_MEMORY_MAX = 256,
}

export const DEFAULT_ASG_INSTANCE_TYPE = InstanceType.of(
  InstanceClass.T3,
  InstanceSize.MICRO
); // why is this here ? check line
// 18 and 19

//We are using the Canonical's AWS account ID for official Ubuntu AMI's
export const DEFAULT_ASG_MACHINE_IMAGE = MachineImage.lookup({ // why is this here ? check line
// 18 and 19
  name: 'ubuntu/images/hvm-ssd/ubuntu-focal-20.04-amd64-server-*',
  owners: ['099720109477'],
});
export const DEFAULT_ASG_MIN_CAPACITY = 1;
export const DEFAULT_ASG_MAX_CAPACITY = 2;
export const DEFAULT_ASG_DESIRED_CAPACITY = 1; // why is this here ? can you make enum ?
export const DEFAULT_ASG_SUBNET_TYPE = SubnetType.PRIVATE_WITH_NAT; // why is this here ? its
// deprecated

export const DEFAULT_LB_SCHEME: ApplicationLoadBalancerProps['internetFacing'] =
  true;
export const DEFAULT_LB_LISTENER_PORT = 80; // why is this here ? check line 11
export const DEFAULT_TARGET_PORT = 80; // why is this here ? check line 11
export const DEFAULT_HEALTH_CHECK_PATH = '/';
export const DEFAULT_UNHEALTHY_THRESHOLD_COUNT = 2; // why is this here ? what is unhealthy ?
// give more descriptive name
export const DEFAULT_HEALTHY_THRESHOLD_COUNT = 5; // why is this here ? what is healthy ?
export const DEFAULT_HEALTH_CHECK_INTERVAL = Duration.seconds(30);
export const DEFAULT_HEALTH_CHECK_TIMEOUT = Duration.seconds(5);

export const DEFAULT_S3_REMOVAL_POLICY = RemovalPolicy.RETAIN;
export const DEFAULT_S3_AUTO_DELETE_OBJECTS = false;
export const DEFAULT_S3_DESTINATION_KEY_PREFIX = '';
