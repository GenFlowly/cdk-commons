import {
  InstanceType,
  InstanceClass,
  InstanceSize,
  SubnetType,
} from 'aws-cdk-lib/aws-ec2';
import { ApplicationLoadBalancerProps } from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { RemovalPolicy } from 'aws-cdk-lib';

export const ALLOWED_HTTP_PORT: number = 80;
export const ALLOWED_HTTPS_PORT: number = 443;
export const ALLOWED_LDAP_PORT: number = 389;

export const GITHUB_ACTIONS_IAM_USER: string = 'GitHubActions';
export const GITHUB_ACTIONS_ACTION_KEY: string = 'GitHubActionsActionKey';
export const T2_NANO: string = 't2.nano';
// Reference: https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ec2.LookupMachineImage.html
//Reference:  https://documentation.ubuntu.com/aws/en/latest/aws-how-to/instances/find-ubuntu-images/
export const UBUNTU_AMI_NAME_PATTERN: string =
  'ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*';
export const UBUNTU_AMI_OWNER: string = '099720109477';

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
  AmazonDynamoDBFullAccess = 'AmazonDynamoDBFullAccess',
  SecretsManagerReadWrite = 'SecretsManagerReadWrite',
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
);
export const DEFAULT_REGION = 'us-east-1';
export enum ASG_CAPACITY {
  MIN = 1,
  MAX = 2,
}
export enum ResourceAccessLevel {
  READ = 'READ',
  WRITE = 'WRITE',
  READ_WRITE = 'READ_WRITE',
}
export const DEFAULT_ASG_SUBNET_TYPE = SubnetType.PRIVATE_WITH_EGRESS;

export const DEFAULT_LB_SCHEME: ApplicationLoadBalancerProps['internetFacing'] =
  true;
export const DEFAULT_HEALTH_CHECK_PATH = '/';
export const DEFAULT_UNHEALTHY_THRESHOLD_COUNT_FOR_LOAD_BALANCER = 2;
export const DEFAULT_HEALTHY_THRESHOLD_COUNT_FOR_LOAD_BALANCER = 5;
// The time interval between health checks performed by the load balancer
export const DEFAULT_LOAD_BALANCER_HEALTH_CHECK_INTERVAL = 30;

// The amount of time the load balancer waits for a response to a health check
export const DEFAULT_LOAD_BALANCER_HEALTH_CHECK_TIMEOUT = 5;

export const DEFAULT_S3_REMOVAL_POLICY = RemovalPolicy.RETAIN;
export const DEFAULT_S3_AUTO_DELETE_OBJECTS = false;
export const DEFAULT_S3_DESTINATION_KEY_PREFIX = '';
