import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { STAGES } from './commonConstants';

export const createS3Bucket = (
  bucketId: string,
  stage: STAGES,
  construct: Construct,
  removalPolicy: cdk.RemovalPolicy = cdk.RemovalPolicy.RETAIN,
  autoDeleteObjects: boolean = false
): s3.Bucket => {
  return new s3.Bucket(construct, `${bucketId}-${stage}`, {
    removalPolicy: removalPolicy,
    autoDeleteObjects: autoDeleteObjects,
  });
};

export const deployToS3Bucket = (
  deploymentId: string,
  stage: STAGES,
  construct: Construct,
  sourcePath: string,
  destinationBucket: s3.IBucket,
  destinationKeyPrefix: string = ''
): s3deploy.BucketDeployment => {
  return new s3deploy.BucketDeployment(construct, `${deploymentId}-${stage}`, {
    sources: [s3deploy.Source.asset(sourcePath)],
    destinationBucket: destinationBucket,
    destinationKeyPrefix: destinationKeyPrefix,
  });
};

export const grantS3ReadAccess = (
  bucket: s3.IBucket,
  grantee: iam.IGrantable
): void => {
  bucket.grantRead(grantee);
};
