import {
  ManagedPolicy,
  User,
  Policy,
  CfnAccessKey,
  ServicePrincipal,
  PolicyStatement,
  Role,
  IRole,
} from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import { Effect } from 'aws-cdk-lib/aws-iam';
import { MANAGED_POLICIES, STAGES } from './commonConstants';

export const createIAMUser = (
  userName: string,
  id: string,
  construct: Construct
): User => {
  return new User(construct, id, { userName });
};

export const attachManagedPolicyNameToUser = (
  user: User,
  managedPolicyName: string
) => {
  user.addManagedPolicy(
    ManagedPolicy.fromAwsManagedPolicyName(managedPolicyName)
  );
};

export const attachCustomPolicyToUser = (user: User, policy: Policy) => {
  user.attachInlinePolicy(policy);
};

export const createAccessKeyForUser = (
  user: User,
  accessKeyId: string,
  construct: Construct
): CfnAccessKey => {
  return new CfnAccessKey(construct, accessKeyId, {
    userName: user.userName,
  });
};

export const createIAMPolicy = (
  policyName: string,
  policyId: string,
  policyActions: string[],
  policyResources: string[],
  policyEffect: Effect,
  stage: STAGES,
  construct: Construct
): Policy => {
  return new Policy(construct, `${policyId}-${stage}`, {
    policyName: `${policyName}-${stage}`,
    statements: [
      new PolicyStatement({
        effect: policyEffect,
        actions: policyActions,
        resources: policyResources,
      }),
    ],
  });
};

export const createIAMRole = (
  roleName: string,
  servicePrincipal: ServicePrincipal,
  stage: STAGES,
  construct: Construct
): Role => {
  return new Role(construct, `${roleName}-${stage}`, {
    roleName: `${roleName}-${stage}`,
    assumedBy: servicePrincipal,
  });
};

export const attachCustomPolicyStatementsToRole = (
  role: Role,
  policyStatements: PolicyStatement[]
) => {
  policyStatements.forEach((policyStatement) => {
    role.addToPolicy(policyStatement);
  });
};

export const attachManagedPolicyToRole = (
  role: IRole,
  managedPolicyName: MANAGED_POLICIES
) => {
  role.addManagedPolicy(
    ManagedPolicy.fromAwsManagedPolicyName(managedPolicyName)
  );
};

export const createPolicyStatement = (
  policyActions: string[],
  policyResources: string[]
): PolicyStatement => {
  return new PolicyStatement({
    actions: policyActions,
    resources: policyResources,
  });
};
