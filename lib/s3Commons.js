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
const cdk = __importStar(require('aws-cdk-lib'));
const createS3Bucket = (
  bucketId,
  stage,
  construct,
  removalPolicy = cdk.RemovalPolicy.RETAIN,
  autoDeleteObjects = false
) => {
  return new s3.Bucket(construct, `${bucketId}-${stage}`, {
    removalPolicy: removalPolicy,
    autoDeleteObjects: autoDeleteObjects,
  });
};
exports.createS3Bucket = createS3Bucket;
const deployToS3Bucket = (
  deploymentId,
  stage,
  construct,
  sourcePath,
  destinationBucket,
  destinationKeyPrefix = ''
) => {
  return new s3deploy.BucketDeployment(construct, `${deploymentId}-${stage}`, {
    sources: [s3deploy.Source.asset(sourcePath)],
    destinationBucket: destinationBucket,
    destinationKeyPrefix: destinationKeyPrefix,
  });
};
exports.deployToS3Bucket = deployToS3Bucket;
const grantS3ReadAccess = (bucket, grantee) => {
  bucket.grantRead(grantee);
};
exports.grantS3ReadAccess = grantS3ReadAccess;
