import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {
  STAGES,
  DEFAULT_S3_REMOVAL_POLICY,
  DEFAULT_S3_AUTO_DELETE_OBJECTS,
  DEFAULT_S3_DESTINATION_KEY_PREFIX,
} from './commonConstants';

export interface S3BucketProps {
  bucketName: string;
  stage: STAGES;
  removalPolicy?: cdk.RemovalPolicy;
  autoDeleteObjects?: boolean;
}

export interface S3DeploymentProps {
  deploymentName: string;
  stage: STAGES;
  sourcePath: string;
  destinationBucket: s3.IBucket;
  destinationKeyPrefix?: string;
}

export const createS3Bucket = (
  construct: Construct,
  props: S3BucketProps
): s3.Bucket => {
  return new s3.Bucket(construct, `${props.bucketName}-${props.stage}`, {
    bucketName: `${props.bucketName}-${props.stage}`.toLowerCase(), // S3 buckets must be lowercase
    removalPolicy: props.removalPolicy ?? DEFAULT_S3_REMOVAL_POLICY,
    autoDeleteObjects:
      props.autoDeleteObjects ?? DEFAULT_S3_AUTO_DELETE_OBJECTS,

  });
};

export const deployToS3Bucket = (
  construct: Construct,
  props: S3DeploymentProps
): s3deploy.BucketDeployment => {
  return new s3deploy.BucketDeployment(
    construct,
    `${props.deploymentName}-${props.stage}`,
    {
      sources: [s3deploy.Source.asset(props.sourcePath)],
      destinationBucket: props.destinationBucket,
      destinationKeyPrefix:
        props.destinationKeyPrefix ?? DEFAULT_S3_DESTINATION_KEY_PREFIX,
    }
  );
  
};

export const grantS3ReadAccess = (
  bucket: s3.IBucket,
  grantee: iam.IGrantable
): void => {
  bucket.grantRead(grantee);
};
