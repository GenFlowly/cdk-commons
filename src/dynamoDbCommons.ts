import { aws_dynamodb as dynamodb, RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export interface CreateTableProps {
  tableName: string;
  partitionKey: { name: string; type: dynamodb.AttributeType };
  sortKey?: { name: string; type: dynamodb.AttributeType };
}

export const createDefaultDynamoDbTable = (
  construct: Construct,
  props: CreateTableProps
): dynamodb.Table => {
  return new dynamodb.Table(construct, props.tableName, {
    tableName: props.tableName,
    partitionKey: props.partitionKey,
    sortKey: props.sortKey,
    billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    removalPolicy: RemovalPolicy.RETAIN,
    pointInTimeRecovery: true,
    encryption: dynamodb.TableEncryption.AWS_MANAGED,
  });
};

export const getExistingDynamoDbTable = (
  construct: Construct,
  tableName: string
): dynamodb.ITable => {
  return dynamodb.Table.fromTableName(
    construct,
    `Existing${tableName}Table`,
    tableName
  );
};
