'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.grantS3ReadAccess =
  exports.deployToS3Bucket =
  exports.createS3Bucket =
    void 0;
const aws_s3_1 = require('aws-cdk-lib/aws-s3');
const aws_s3_deployment_1 = require('aws-cdk-lib/aws-s3-deployment');
const commonConstants_1 = require('./commonConstants');
const createS3Bucket = (construct, props) => {
  var _a, _b;
  return new aws_s3_1.Bucket(construct, `${props.bucketName}-${props.stage}`, {
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
  return new aws_s3_deployment_1.BucketDeployment(
    construct,
    `${props.deploymentName}-${props.stage}`,
    {
      sources: [aws_s3_deployment_1.Source.asset(props.sourcePath)],
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
