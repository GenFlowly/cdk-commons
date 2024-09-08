import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { createS3Bucket } from '../s3Commons';
import { ARTIFACTORY_BUCKET, STAGES } from '../commonConstants';

interface CommonS3StackProps extends StackProps{
  stage: STAGES,
}
export class CommonS3Stack extends Stack {
  constructor(scope: Construct, id: string, props: CommonS3StackProps) {
    super(scope, id, props);

    // Create an S3 bucket for artifactory
    const artifactoryBucket = createS3Bucket(
      this,
      { bucketName: ARTIFACTORY_BUCKET, stage: props.stage}
    )

  }
}