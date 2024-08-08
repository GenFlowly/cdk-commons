'use strict';
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (
          !desc ||
          ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v });
      }
    : function (o, v) {
        o['default'] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.createLoadBalancerWithTargets = void 0;
const elbv2 = __importStar(require('aws-cdk-lib/aws-elasticloadbalancingv2'));
const commonConstants_1 = require('./commonConstants');
const createLoadBalancerWithTargets = (construct, props) => {
  var _a, _b;
  // Create Load Balancer
  const lb = new elbv2.ApplicationLoadBalancer(
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
      action: elbv2.ListenerAction.forward([targetGroups[0]]),
    });
  }
  return { loadBalancer: lb, listener, targetGroups };
};
exports.createLoadBalancerWithTargets = createLoadBalancerWithTargets;
