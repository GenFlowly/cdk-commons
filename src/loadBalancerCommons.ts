import {
  ApplicationLoadBalancer,
  ApplicationListener,
  ApplicationTargetGroup,
  ListenerAction,
  ApplicationProtocol,
} from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { IVpc } from 'aws-cdk-lib/aws-ec2';
import { AutoScalingGroup } from 'aws-cdk-lib/aws-autoscaling';
import { Construct } from 'constructs';
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import {
  STAGES,
  DEFAULT_LB_SCHEME,
  DEFAULT_HEALTH_CHECK_PATH,
  DEFAULT_UNHEALTHY_THRESHOLD_COUNT_FOR_LOAD_BALANCER,
  DEFAULT_HEALTHY_THRESHOLD_COUNT_FOR_LOAD_BALANCER,
  DEFAULT_LOAD_BALANCER_HEALTH_CHECK_INTERVAL,
  DEFAULT_LOAD_BALANCER_HEALTH_CHECK_TIMEOUT,
  ALLOWED_HTTP_PORT,
  ALLOWED_HTTPS_PORT,
} from './commonConstants';
import { Duration } from 'aws-cdk-lib';
import { createCertificate } from './certificateCommons';

export interface TargetGroupProps {
  name: string;
  port: number;
  targets: AutoScalingGroup[];
  healthCheckPath?: string;
  protocol: ApplicationProtocol;
}

export interface LoadBalancerProps {
  lbName: string;
  vpc: IVpc;
  stage: STAGES;
  isInternetFacing?: boolean;
  listenerPort?: number;
  targetGroups: TargetGroupProps[];
  certificate?: Certificate;
  domainName?: string;
}

export const createLoadBalancerWithTargets = (
  construct: Construct,
  props: LoadBalancerProps
): {
  loadBalancer: ApplicationLoadBalancer;
  listener: ApplicationListener;
  targetGroups: ApplicationTargetGroup[];
  certificate?: Certificate;
} => {
  let certificate = props.certificate;

  // If no certificate is provided but a domain name is provided, create a certificate
  if (!certificate && props.domainName) {
    certificate = createCertificate(
      construct,
      props.domainName,
      `${props.lbName}Certificate`
    );
  }

  const lb = new ApplicationLoadBalancer(
    construct,
    `${props.lbName}-${props.stage}`,
    {
      vpc: props.vpc,
      internetFacing: props.isInternetFacing ?? DEFAULT_LB_SCHEME,
      loadBalancerName: `${props.lbName}-${props.stage}`.toLowerCase(),
    }
  );

  // Add HTTPS Listener if certificate is available, otherwise HTTP
  let listener: ApplicationListener;
  if (certificate) {
    listener = lb.addListener(`${props.lbName}HttpsListener-${props.stage}`, {
      port: ALLOWED_HTTPS_PORT,
      certificates: [certificate],
      protocol: ApplicationProtocol.HTTPS,
    });

    // Add HTTP to HTTPS redirect
    const httpListener = lb.addListener(
      `${props.lbName}HttpListener-${props.stage}`,
      {
        port: ALLOWED_HTTP_PORT,
      }
    );

    httpListener.addAction('HttpToHttpsRedirect', {
      action: ListenerAction.redirect({
        port: `${ALLOWED_HTTPS_PORT}`,
        protocol: ApplicationProtocol.HTTPS,
        permanent: true,
      }),
    });
  } else {
    // Fallback to HTTP if no certificate
    listener = lb.addListener(`${props.lbName}HttpListener-${props.stage}`, {
      port: props.listenerPort ?? ALLOWED_HTTP_PORT,
    });
  }

  const targetGroups = props.targetGroups.map((tg) => {
    return listener.addTargets(`${tg.name}-${props.stage}`, {
      port: tg.port,
      targets: tg.targets,
      targetGroupName: `${tg.name}-${props.stage}`.toLowerCase(),
      protocol: tg.protocol,
      healthCheck: {
        path: tg.healthCheckPath ?? DEFAULT_HEALTH_CHECK_PATH,
        unhealthyThresholdCount:
          DEFAULT_UNHEALTHY_THRESHOLD_COUNT_FOR_LOAD_BALANCER,
        healthyThresholdCount:
          DEFAULT_HEALTHY_THRESHOLD_COUNT_FOR_LOAD_BALANCER,
        interval: Duration.seconds(DEFAULT_LOAD_BALANCER_HEALTH_CHECK_INTERVAL),
        timeout: Duration.seconds(DEFAULT_LOAD_BALANCER_HEALTH_CHECK_TIMEOUT),
      },
    });
  });

  // Set the first target group as the default action for the listener
  if (targetGroups.length > 0) {
    listener.addAction('DefaultAction', {
      action: ListenerAction.forward([targetGroups[0]]),
    });
  }

  return { loadBalancer: lb, listener, targetGroups, certificate };
};
