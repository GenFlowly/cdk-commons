import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as autoscaling from 'aws-cdk-lib/aws-autoscaling';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { STAGES } from './commonConstants';

export const createApplicationLoadBalancer = (
  lbId: string,
  vpc: ec2.IVpc,
  internetFacing: boolean,
  stage: STAGES,
  construct: Construct
): elbv2.ApplicationLoadBalancer => {
  return new elbv2.ApplicationLoadBalancer(construct, `${lbId}-${stage}`, {
    vpc,
    internetFacing,
  });
};

export const addListener = (
  lb: elbv2.ApplicationLoadBalancer,
  listenerId: string,
  port: number,
  stage: STAGES
): elbv2.ApplicationListener => {
  return lb.addListener(`${listenerId}-${stage}`, { port });
};

export const addTargets = (
  listener: elbv2.ApplicationListener,
  targetId: string,
  port: number,
  targets: autoscaling.AutoScalingGroup[],
  healthCheckPath: string,
  stage: STAGES
): elbv2.ApplicationTargetGroup => {
  return listener.addTargets(`${targetId}-${stage}`, {
    port,
    targets,
    healthCheck: {
      path: healthCheckPath,
      unhealthyThresholdCount: 2,
      healthyThresholdCount: 2,
      interval: cdk.Duration.seconds(15),
      timeout: cdk.Duration.seconds(10),
    },
  });
};
