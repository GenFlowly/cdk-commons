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
exports.DEFAULT_S3_DESTINATION_KEY_PREFIX =
  exports.DEFAULT_S3_AUTO_DELETE_OBJECTS =
  exports.DEFAULT_S3_REMOVAL_POLICY =
  exports.DEFAULT_HEALTH_CHECK_TIMEOUT =
  exports.DEFAULT_HEALTH_CHECK_INTERVAL =
  exports.DEFAULT_HEALTHY_THRESHOLD_COUNT =
  exports.DEFAULT_UNHEALTHY_THRESHOLD_COUNT =
  exports.DEFAULT_HEALTH_CHECK_PATH =
  exports.DEFAULT_TARGET_PORT =
  exports.DEFAULT_LB_LISTENER_PORT =
  exports.DEFAULT_LB_SCHEME =
  exports.DEFAULT_ASG_SUBNET_TYPE =
  exports.DEFAULT_ASG_DESIRED_CAPACITY =
  exports.DEFAULT_ASG_MAX_CAPACITY =
  exports.DEFAULT_ASG_MIN_CAPACITY =
  exports.DEFAULT_ASG_MACHINE_IMAGE =
  exports.DEFAULT_ASG_INSTANCE_TYPE =
  exports.LAMBDA_MEMORY =
  exports.LAMBDA_TIMEOUT =
  exports.STAGES =
  exports.MANAGED_POLICIES =
  exports.HTTP_STATUS_CODES =
  exports.HTTP_METHODS =
  exports.UBUNTU_64_X86_AMI =
  exports.T2_NANO =
  exports.GITHUB_ACTIONS_ACTION_KEY =
  exports.GITHUB_ACTIONS_IAM_USER =
  exports.ALLOWED_LDAP_PORT =
  exports.ALLOWED_HTTPS_PORT =
  exports.ALLOWED_HTTP_PORT =
    void 0;
const ec2 = __importStar(require('aws-cdk-lib/aws-ec2'));
const cdk = __importStar(require('aws-cdk-lib'));
exports.ALLOWED_HTTP_PORT = 80;
exports.ALLOWED_HTTPS_PORT = 443;
exports.ALLOWED_LDAP_PORT = 389;
exports.GITHUB_ACTIONS_IAM_USER = 'GitHubActions';
exports.GITHUB_ACTIONS_ACTION_KEY = 'GitHubActionsActionKey';
exports.T2_NANO = 't2.nano';
exports.UBUNTU_64_X86_AMI = 'ami-007855ac798b5175e';
var HTTP_METHODS;
(function (HTTP_METHODS) {
  HTTP_METHODS['GET'] = 'GET';
  HTTP_METHODS['POST'] = 'POST';
  HTTP_METHODS['PUT'] = 'PUT';
  HTTP_METHODS['DELETE'] = 'DELETE';
  HTTP_METHODS['PATCH'] = 'PATCH';
  HTTP_METHODS['HEAD'] = 'HEAD';
  HTTP_METHODS['OPTIONS'] = 'OPTIONS';
})(HTTP_METHODS || (exports.HTTP_METHODS = HTTP_METHODS = {}));
var HTTP_STATUS_CODES;
(function (HTTP_STATUS_CODES) {
  HTTP_STATUS_CODES['OK'] = '200';
  HTTP_STATUS_CODES['Created'] = '201';
  HTTP_STATUS_CODES['Accepted'] = '202';
  HTTP_STATUS_CODES['NoContent'] = '204';
  HTTP_STATUS_CODES['BadRequest'] = '400';
  HTTP_STATUS_CODES['Unauthorized'] = '401';
  HTTP_STATUS_CODES['Forbidden'] = '403';
  HTTP_STATUS_CODES['NotFound'] = '404';
  HTTP_STATUS_CODES['InternalServerError'] = '500';
  HTTP_STATUS_CODES['NotImplemented'] = '501';
})(HTTP_STATUS_CODES || (exports.HTTP_STATUS_CODES = HTTP_STATUS_CODES = {}));
var MANAGED_POLICIES;
(function (MANAGED_POLICIES) {
  MANAGED_POLICIES['STEP_FUNCTIONS_READ_ONLY'] =
    'AWSStepFunctionsReadOnlyAccess';
  MANAGED_POLICIES['SSM_MANAGED_INSTANCE_CORE'] =
    'AmazonSSMManagedInstanceCore';
})(MANAGED_POLICIES || (exports.MANAGED_POLICIES = MANAGED_POLICIES = {}));
var STAGES;
(function (STAGES) {
  STAGES['PROD'] = 'production';
  STAGES['BETA'] = 'development';
  STAGES['GAMMA'] = 'pre-prod';
})(STAGES || (exports.STAGES = STAGES = {}));
var LAMBDA_TIMEOUT;
(function (LAMBDA_TIMEOUT) {
  LAMBDA_TIMEOUT[(LAMBDA_TIMEOUT['LAMBDA_TIMEOUT_MAX'] = 15)] =
    'LAMBDA_TIMEOUT_MAX';
  LAMBDA_TIMEOUT[(LAMBDA_TIMEOUT['LAMBDA_TIMEOUT_MEDIUM'] = 6)] =
    'LAMBDA_TIMEOUT_MEDIUM';
  LAMBDA_TIMEOUT[(LAMBDA_TIMEOUT['LAMBDA_TIMEOUT_MIN'] = 2)] =
    'LAMBDA_TIMEOUT_MIN';
  LAMBDA_TIMEOUT[(LAMBDA_TIMEOUT['ONE'] = 1)] = 'ONE';
})(LAMBDA_TIMEOUT || (exports.LAMBDA_TIMEOUT = LAMBDA_TIMEOUT = {}));
var LAMBDA_MEMORY;
(function (LAMBDA_MEMORY) {
  LAMBDA_MEMORY[(LAMBDA_MEMORY['LAMBDA_MEMORY_MIN'] = 128)] =
    'LAMBDA_MEMORY_MIN';
  LAMBDA_MEMORY[(LAMBDA_MEMORY['LAMBDA_MEMORY_MAX'] = 256)] =
    'LAMBDA_MEMORY_MAX';
})(LAMBDA_MEMORY || (exports.LAMBDA_MEMORY = LAMBDA_MEMORY = {}));
exports.DEFAULT_ASG_INSTANCE_TYPE = ec2.InstanceType.of(
  ec2.InstanceClass.T3,
  ec2.InstanceSize.MICRO
);
exports.DEFAULT_ASG_MACHINE_IMAGE = ec2.MachineImage.latestAmazonLinux2();
exports.DEFAULT_ASG_MIN_CAPACITY = 1;
exports.DEFAULT_ASG_MAX_CAPACITY = 3;
exports.DEFAULT_ASG_DESIRED_CAPACITY = 1;
exports.DEFAULT_ASG_SUBNET_TYPE = ec2.SubnetType.PRIVATE_WITH_NAT;
exports.DEFAULT_LB_SCHEME = true;
exports.DEFAULT_LB_LISTENER_PORT = 80;
exports.DEFAULT_TARGET_PORT = 80;
exports.DEFAULT_HEALTH_CHECK_PATH = '/';
exports.DEFAULT_UNHEALTHY_THRESHOLD_COUNT = 2;
exports.DEFAULT_HEALTHY_THRESHOLD_COUNT = 5;
exports.DEFAULT_HEALTH_CHECK_INTERVAL = cdk.Duration.seconds(30);
exports.DEFAULT_HEALTH_CHECK_TIMEOUT = cdk.Duration.seconds(5);
exports.DEFAULT_S3_REMOVAL_POLICY = cdk.RemovalPolicy.RETAIN;
exports.DEFAULT_S3_AUTO_DELETE_OBJECTS = false;
exports.DEFAULT_S3_DESTINATION_KEY_PREFIX = '';
