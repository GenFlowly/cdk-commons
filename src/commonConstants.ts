import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as cdk from 'aws-cdk-lib';

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

export const DEFAULT_ASG_INSTANCE_TYPE = ec2.InstanceType.of(
  ec2.InstanceClass.T3,
  ec2.InstanceSize.MICRO
);
export const DEFAULT_ASG_MACHINE_IMAGE = ec2.MachineImage.latestAmazonLinux2();
export const DEFAULT_ASG_MIN_CAPACITY = 1;
export const DEFAULT_ASG_MAX_CAPACITY = 3;
export const DEFAULT_ASG_DESIRED_CAPACITY = 1;
export const DEFAULT_ASG_SUBNET_TYPE = ec2.SubnetType.PRIVATE_WITH_NAT;

export const DEFAULT_LB_SCHEME: elbv2.ApplicationLoadBalancerProps['internetFacing'] =
  true;
export const DEFAULT_LB_LISTENER_PORT = 80;
export const DEFAULT_TARGET_PORT = 80;
export const DEFAULT_HEALTH_CHECK_PATH = '/';
export const DEFAULT_UNHEALTHY_THRESHOLD_COUNT = 2;
export const DEFAULT_HEALTHY_THRESHOLD_COUNT = 5;
export const DEFAULT_HEALTH_CHECK_INTERVAL = cdk.Duration.seconds(30);
export const DEFAULT_HEALTH_CHECK_TIMEOUT = cdk.Duration.seconds(5);

export const DEFAULT_S3_REMOVAL_POLICY = cdk.RemovalPolicy.RETAIN;
export const DEFAULT_S3_AUTO_DELETE_OBJECTS = false;
export const DEFAULT_S3_DESTINATION_KEY_PREFIX = '';
