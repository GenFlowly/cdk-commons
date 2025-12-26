import { aws_dynamodb as dynamodb, RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export interface GlobalSecondaryIndexProps {
  indexName: string;
  partitionKey: { name: string; type: dynamodb.AttributeType };
  sortKey?: { name: string; type: dynamodb.AttributeType };
  projectionType?: dynamodb.ProjectionType;
  nonKeyAttributes?: string[];
}

export interface CreateTableProps {
  tableName: string;
  partitionKey: { name: string; type: dynamodb.AttributeType };
  sortKey?: { name: string; type: dynamodb.AttributeType };
  globalSecondaryIndexes?: GlobalSecondaryIndexProps[];
}

export const createDefaultDynamoDbTable = (
  construct: Construct,
  props: CreateTableProps
): dynamodb.Table => {
  const table = new dynamodb.Table(construct, props.tableName, {
    tableName: props.tableName,
    partitionKey: props.partitionKey,
    sortKey: props.sortKey,
    billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    removalPolicy: RemovalPolicy.RETAIN,
    pointInTimeRecovery: true,
    encryption: dynamodb.TableEncryption.AWS_MANAGED,
  });

  // Add global secondary indexes if provided
  if (props.globalSecondaryIndexes) {
    props.globalSecondaryIndexes.forEach((gsi) => {
      table.addGlobalSecondaryIndex({
        indexName: gsi.indexName,
        partitionKey: gsi.partitionKey,
        sortKey: gsi.sortKey,
        projectionType: gsi.projectionType || dynamodb.ProjectionType.ALL,
        nonKeyAttributes: gsi.nonKeyAttributes,
      });
    });
  }

  return table;
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
