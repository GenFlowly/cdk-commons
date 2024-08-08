import {
  ApplicationLoadBalancer,
  ApplicationListener,
  ApplicationTargetGroup,
  ListenerAction,
} from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { IVpc } from 'aws-cdk-lib/aws-ec2';
import { AutoScalingGroup } from 'aws-cdk-lib/aws-autoscaling';
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
  targets: AutoScalingGroup[];
  healthCheckPath?: string;
}

export interface LoadBalancerProps {
  lbName: string;
  vpc: IVpc;
  stage: STAGES;
  internetFacing?: boolean;
  listenerPort?: number;
  targetGroups: TargetGroupProps[];
}

export const createLoadBalancerWithTargets = (
  construct: Construct,
  props: LoadBalancerProps
): {
  loadBalancer: ApplicationLoadBalancer;
  listener: ApplicationListener;
  targetGroups: ApplicationTargetGroup[];
} => {
  // Create Load Balancer
  const lb = new ApplicationLoadBalancer(
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
      action: ListenerAction.forward([targetGroups[0]]),
    });
  }

  return { loadBalancer: lb, listener, targetGroups };
};
