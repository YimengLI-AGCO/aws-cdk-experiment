import * as cdk from '@aws-cdk/core';
import sqs = require('@aws-cdk/aws-sqs');
import { QueueRecorder } from './queue-recorder';
import { StatusService } from './status-service';
import dynamodb = require('@aws-cdk/aws-dynamodb');
import s3 = require('@aws-cdk/aws-s3');


interface HelloCdkStackProps extends cdk.StackProps {
  bucket: s3.IBucket;
}

export class HelloCdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: HelloCdkStackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    // const queue = new sqs.Queue(this, 'HelloQueue');
    const table = new dynamodb.Table(this, 'Status', {
      partitionKey: {name: 'id', type: dynamodb.AttributeType.STRING},
      tableName: 'Status'
    });

    // new QueueRecorder(this, 'QueueRecorder', { inputQueue: queue, dynamoTable: table });
    new StatusService(this, 'StatusService', { dynamoTable: table, bucket: props.bucket });
  }
}
