import { LAMBDA_MEMORY, LAMBDA_TIMEOUT, STAGES } from './commonConstants';
import { Construct } from 'constructs';
import { Duration, aws_lambda as lambda } from 'aws-cdk-lib';
import { Role } from 'aws-cdk-lib/aws-iam';

export const createLambda = (
  id: string,
  name: string,
  runtime: lambda.Runtime,
  codeAssetFullPathWithFileName: string,
  handler: string,
  timeout: LAMBDA_TIMEOUT,
  memory: LAMBDA_MEMORY,
  role: Role,
  environmentVariables: { [key: string]: string },
  stage: STAGES,
  construct: Construct
): lambda.Function => {
  return new lambda.Function(construct, `${id}-${stage}`, {
    functionName: `${name}-${stage}`,
    runtime: runtime,
    code: lambda.Code.fromAsset(codeAssetFullPathWithFileName),
    handler: handler,
    timeout: Duration.minutes(timeout),
    memorySize: memory,
    role: role,
    environment: environmentVariables,
  });
};
