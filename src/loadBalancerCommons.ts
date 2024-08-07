import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as autoscaling from 'aws-cdk-lib/aws-autoscaling';
import { Construct } from 'constructs';
import {
  STAGES,
  DEFAULT_LB_SCHEME,
  DEFAULT_LB_LISTENER_PORT,
  DEFAULT_TARGET_PORT,
  DEFAULT_HEALTH_CHECK_PATH,
  DEFAULT_UNHEALTHY_THRESHOLD_COUNT,
  DEFAULT_HEALTHY_THRESHOLD_COUNT,
  DEFAULT_HEALTH_CHECK_INTERVAL,
  DEFAULT_HEALTH_CHECK_TIMEOUT,
} from './commonConstants';

export interface LoadBalancerProps {
  lbName: string;
  vpc: ec2.IVpc;
  stage: STAGES;
  internetFacing?: boolean;
  listenerPort?: number;
  targetPort?: number;
  healthCheckPath?: string;
  targets: autoscaling.AutoScalingGroup[];
}

export const createDefaultLoadBalancerWithTargets = (
  construct: Construct,
  props: LoadBalancerProps
): {
  loadBalancer: elbv2.ApplicationLoadBalancer;
  listener: elbv2.ApplicationListener;
  targetGroup: elbv2.ApplicationTargetGroup;
} => {
  const lb = new elbv2.ApplicationLoadBalancer(
    construct,
    `${props.lbName}-${props.stage}`,
    {
      vpc: props.vpc,
      internetFacing: props.internetFacing ?? DEFAULT_LB_SCHEME,
      loadBalancerName: `${props.lbName}-${props.stage}`,
    }
  );

  const listener = lb.addListener(`${props.lbName}Listener-${props.stage}`, {
    port: props.listenerPort ?? DEFAULT_LB_LISTENER_PORT,
  });

  const targetGroup = listener.addTargets(
    `${props.lbName}TargetGroup-${props.stage}`,
    {
      port: props.targetPort ?? DEFAULT_TARGET_PORT,
      targets: props.targets,
      healthCheck: {
        path: props.healthCheckPath ?? DEFAULT_HEALTH_CHECK_PATH,
        unhealthyThresholdCount: DEFAULT_UNHEALTHY_THRESHOLD_COUNT,
        healthyThresholdCount: DEFAULT_HEALTHY_THRESHOLD_COUNT,
        interval: DEFAULT_HEALTH_CHECK_INTERVAL,
        timeout: DEFAULT_HEALTH_CHECK_TIMEOUT,
      },
    }
  );

  return { loadBalancer: lb, listener, targetGroup };
};
