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
exports.addTargets =
  exports.addListener =
  exports.createApplicationLoadBalancer =
    void 0;
const elbv2 = __importStar(require('aws-cdk-lib/aws-elasticloadbalancingv2'));
const cdk = __importStar(require('aws-cdk-lib'));
const createApplicationLoadBalancer = (
  lbId,
  vpc,
  internetFacing,
  stage,
  construct
) => {
  return new elbv2.ApplicationLoadBalancer(construct, `${lbId}-${stage}`, {
    vpc,
    internetFacing,
  });
};
exports.createApplicationLoadBalancer = createApplicationLoadBalancer;
const addListener = (lb, listenerId, port, stage) => {
  return lb.addListener(`${listenerId}-${stage}`, { port });
};
exports.addListener = addListener;
const addTargets = (
  listener,
  targetId,
  port,
  targets,
  healthCheckPath,
  stage
) => {
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
exports.addTargets = addTargets;
