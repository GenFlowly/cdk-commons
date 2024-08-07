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
exports.grantS3ReadAccess =
  exports.deployToS3Bucket =
  exports.createS3Bucket =
    void 0;
const s3 = __importStar(require('aws-cdk-lib/aws-s3'));
const s3deploy = __importStar(require('aws-cdk-lib/aws-s3-deployment'));
const commonConstants_1 = require('./commonConstants');
const createS3Bucket = (construct, props) => {
  var _a, _b;
  return new s3.Bucket(construct, `${props.bucketName}-${props.stage}`, {
    bucketName: `${props.bucketName}-${props.stage}`.toLowerCase(), // S3 buckets must be lowercase
    removalPolicy:
      (_a = props.removalPolicy) !== null && _a !== void 0
        ? _a
        : commonConstants_1.DEFAULT_S3_REMOVAL_POLICY,
    autoDeleteObjects:
      (_b = props.autoDeleteObjects) !== null && _b !== void 0
        ? _b
        : commonConstants_1.DEFAULT_S3_AUTO_DELETE_OBJECTS,
  });
};
exports.createS3Bucket = createS3Bucket;
const deployToS3Bucket = (construct, props) => {
  var _a;
  return new s3deploy.BucketDeployment(
    construct,
    `${props.deploymentName}-${props.stage}`,
    {
      sources: [s3deploy.Source.asset(props.sourcePath)],
      destinationBucket: props.destinationBucket,
      destinationKeyPrefix:
        (_a = props.destinationKeyPrefix) !== null && _a !== void 0
          ? _a
          : commonConstants_1.DEFAULT_S3_DESTINATION_KEY_PREFIX,
    }
  );
};
exports.deployToS3Bucket = deployToS3Bucket;
const grantS3ReadAccess = (bucket, grantee) => {
  bucket.grantRead(grantee);
};
exports.grantS3ReadAccess = grantS3ReadAccess;
