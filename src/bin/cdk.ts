#!/usr/bin/env node
import {App} from 'aws-cdk-lib';
import { STAGES } from '../commonConstants';
import { CommonS3Stack } from '../lib/CommonS3Stack';

const deploymentStage = process.env.APP_ENV; // Read env from pipeline

let stage: STAGES = STAGES.BETA; // default to BETA

switch (deploymentStage) {
  case STAGES.BETA:
    stage = STAGES.BETA
  case STAGES.PROD:
    stage = STAGES.PROD
}

// Use default AWS credentials and region configured in your environment
const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

new CommonS3Stack(app, `CommonS3Stack`, { stage: stage, env});


