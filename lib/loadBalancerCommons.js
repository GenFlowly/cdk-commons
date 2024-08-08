'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.createLoadBalancerWithTargets = void 0;
const aws_elasticloadbalancingv2_1 = require('aws-cdk-lib/aws-elasticloadbalancingv2');
const commonConstants_1 = require('./commonConstants');
const createLoadBalancerWithTargets = (construct, props) => {
  var _a, _b;
  // Create Load Balancer
  const lb = new aws_elasticloadbalancingv2_1.ApplicationLoadBalancer(
    construct,
    `${props.lbName}-${props.stage}`,
    {
      vpc: props.vpc,
      internetFacing:
        (_a = props.internetFacing) !== null && _a !== void 0
          ? _a
          : commonConstants_1.DEFAULT_LB_SCHEME,
      loadBalancerName: `${props.lbName}-${props.stage}`.toLowerCase(),
    }
  );
  // Add Listener
  const listener = lb.addListener(`${props.lbName}Listener-${props.stage}`, {
    port:
      (_b = props.listenerPort) !== null && _b !== void 0
        ? _b
        : commonConstants_1.DEFAULT_LB_LISTENER_PORT,
  });
  // Create Target Groups
  const targetGroups = props.targetGroups.map((tg) => {
    var _a;
    return listener.addTargets(`${tg.name}-${props.stage}`, {
      port: tg.port,
      targets: tg.targets,
      targetGroupName: `${tg.name}-${props.stage}`.toLowerCase(),
      healthCheck: {
        path:
          (_a = tg.healthCheckPath) !== null && _a !== void 0
            ? _a
            : commonConstants_1.DEFAULT_HEALTH_CHECK_PATH,
        unhealthyThresholdCount:
          commonConstants_1.DEFAULT_UNHEALTHY_THRESHOLD_COUNT,
        healthyThresholdCount:
          commonConstants_1.DEFAULT_HEALTHY_THRESHOLD_COUNT,
        interval: commonConstants_1.DEFAULT_HEALTH_CHECK_INTERVAL,
        timeout: commonConstants_1.DEFAULT_HEALTH_CHECK_TIMEOUT,
      },
    });
  });
  // Set the first target group as the default action for the listener
  if (targetGroups.length > 0) {
    listener.addAction('DefaultAction', {
      action: aws_elasticloadbalancingv2_1.ListenerAction.forward([
        targetGroups[0],
      ]),
    });
  }
  return { loadBalancer: lb, listener, targetGroups };
};
exports.createLoadBalancerWithTargets = createLoadBalancerWithTargets;
