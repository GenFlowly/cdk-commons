import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as autoscaling from 'aws-cdk-lib/aws-autoscaling';
import { Construct } from 'constructs';
import {
  STAGES,
  DEFAULT_LB_SCHEME,
  DEFAULT_LB_LISTENER_PORT,
  DEFAULT_HEALTH_CHECK_PATH,
  DEFAULT_UNHEALTHY_THRESHOLD_COUNT,
  DEFAULT_HEALTHY_THRESHOLD_COUNT,
  DEFAULT_HEALTH_CHECK_INTERVAL,
  DEFAULT_HEALTH_CHECK_TIMEOUT,
} from './commonConstants';

export interface TargetGroupProps {
  name: string;
  port: number;
  targets: autoscaling.AutoScalingGroup[];
  healthCheckPath?: string;
}

export interface LoadBalancerProps {
  lbName: string;
  vpc: ec2.IVpc;
  stage: STAGES;
  internetFacing?: boolean;
  listenerPort?: number;
  targetGroups: TargetGroupProps[];
}

export const createLoadBalancerWithTargets = (
  construct: Construct,
  props: LoadBalancerProps
): {
  loadBalancer: elbv2.ApplicationLoadBalancer;
  listener: elbv2.ApplicationListener;
  targetGroups: elbv2.ApplicationTargetGroup[];
} => {
  // Create Load Balancer
  const lb = new elbv2.ApplicationLoadBalancer(
    construct,
    `${props.lbName}-${props.stage}`,
    {
      vpc: props.vpc,
      internetFacing: props.internetFacing ?? DEFAULT_LB_SCHEME,
      loadBalancerName: `${props.lbName}-${props.stage}`.toLowerCase(),
    }
  );

  // Add Listener
  const listener = lb.addListener(`${props.lbName}Listener-${props.stage}`, {
    port: props.listenerPort ?? DEFAULT_LB_LISTENER_PORT,
  });

  // Create Target Groups
  const targetGroups = props.targetGroups.map((tg) => {
    return listener.addTargets(`${tg.name}-${props.stage}`, {
      port: tg.port,
      targets: tg.targets,
      targetGroupName: `${tg.name}-${props.stage}`.toLowerCase(),
      healthCheck: {
        path: tg.healthCheckPath ?? DEFAULT_HEALTH_CHECK_PATH,
        unhealthyThresholdCount: DEFAULT_UNHEALTHY_THRESHOLD_COUNT,
        healthyThresholdCount: DEFAULT_HEALTHY_THRESHOLD_COUNT,
        interval: DEFAULT_HEALTH_CHECK_INTERVAL,
        timeout: DEFAULT_HEALTH_CHECK_TIMEOUT,
      },
    });
  });

  // Set the first target group as the default action for the listener
  if (targetGroups.length > 0) {
    listener.addAction('DefaultAction', {
      action: elbv2.ListenerAction.forward([targetGroups[0]]),
    });
  }

  return { loadBalancer: lb, listener, targetGroups };
};
