import * as cdk from '@aws-cdk/core';
import sqs = require('@aws-cdk/aws-sqs');
import { QueueRecorder } from './queue-recorder';


export class HelloCdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const queue = new sqs.Queue(this, 'HelloQueue');

    new QueueRecorder(this, 'QueueRecorder', {inputQueue: queue});
  }
}
