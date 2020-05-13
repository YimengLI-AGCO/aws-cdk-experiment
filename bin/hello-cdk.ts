#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { HelloCdkStack } from '../lib/hello-cdk-stack';
import { BucketStack } from '../lib/bucket-stack';


const app = new cdk.App();

const stack1 = new BucketStack(app, 'BucketStack');
const stack2 = new HelloCdkStack(app, 'HelloCdkStack', { bucket: stack1.bucket });
stack2.addDependency(stack1);
