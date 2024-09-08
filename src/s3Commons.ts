import { Bucket, IBucket } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {
  STAGES,
  DEFAULT_S3_REMOVAL_POLICY,
  DEFAULT_S3_AUTO_DELETE_OBJECTS,
  DEFAULT_S3_DESTINATION_KEY_PREFIX, DEFAULT_DELIMITER,
} from './commonConstants';

export interface S3BucketProps {
  bucketName: string;
  stage: STAGES;
  removalPolicy?: RemovalPolicy;
  autoDeleteObjects?: boolean;
}

export interface S3DeploymentProps {
  deploymentName: string;
  stage: STAGES;
  sourcePath: string;
  destinationBucket: IBucket;
  destinationKeyPrefix?: string;
}

export const createS3Bucket = (
  construct: Construct,
  props: S3BucketProps
): Bucket => {
  return new Bucket(construct, `${props.bucketName}-${props.stage}`, {
    bucketName: `${props.bucketName}-${props.stage}`.toLowerCase(), // S3 buckets must be lowercase
    removalPolicy: props.removalPolicy ?? DEFAULT_S3_REMOVAL_POLICY,
    autoDeleteObjects:
      props.autoDeleteObjects ?? DEFAULT_S3_AUTO_DELETE_OBJECTS,
  });
};

export const deployToS3Bucket = (
  construct: Construct,
  props: S3DeploymentProps
): BucketDeployment => {
  return new BucketDeployment(
    construct,
    `${props.deploymentName}-${props.stage}`,
    {
      sources: [Source.asset(props.sourcePath)],
      destinationBucket: props.destinationBucket,
      destinationKeyPrefix:
        props.destinationKeyPrefix ?? DEFAULT_S3_DESTINATION_KEY_PREFIX,
    }
  );
};

export const getS3Bucket = (
  construct: Construct,
  bucket_name: String
) => {
  Bucket.fromBucketName(this, `${bucket_name}${DEFAULT_DELIMITER}id`, bucket_name);
}
