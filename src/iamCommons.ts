import {
  ManagedPolicy,
  User,
  Policy,
  CfnAccessKey,
  ServicePrincipal,
  PolicyStatement,
  Role,
  IRole,
  IGrantable,
} from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import { Effect } from 'aws-cdk-lib/aws-iam';
import {
  MANAGED_POLICIES,
  ResourceAccessLevel,
  STAGES,
} from './commonConstants';

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
export const attachCustomPolicyStatementsToPrincipalPolicy = (
  role: IRole,
  policyStatements: PolicyStatement[]
) => {
  policyStatements.forEach((policyStatement) => {
    role.addToPrincipalPolicy(policyStatement);
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
  policyResources: string[],
  effect?: Effect
): PolicyStatement => {
  return new PolicyStatement({
    effect: effect,
    actions: policyActions,
    resources: policyResources,
  });
};
export const grantResourceAccess = (
  resource: {
    grantRead: (grantee: IGrantable) => void;
    grantWrite: (grantee: IGrantable) => void;
    grantReadWrite: (grantee: IGrantable) => void;
  },
  grantee: IGrantable,
  accessLevel: ResourceAccessLevel
): void => {
  switch (accessLevel) {
    case ResourceAccessLevel.READ:
      resource.grantRead(grantee);
      break;
    case ResourceAccessLevel.WRITE:
      resource.grantWrite(grantee);
      break;
    case ResourceAccessLevel.READ_WRITE:
      resource.grantReadWrite(grantee);
      break;
    default:
      throw new Error(`Unsupported access level: ${accessLevel}`);
  }
};
