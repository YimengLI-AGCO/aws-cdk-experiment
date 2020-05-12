import cdk = require('@aws-cdk/core');
import lambda = require('@aws-cdk/aws-lambda');
import event_sources = require('@aws-cdk/aws-lambda-event-sources');
import sqs = require('@aws-cdk/aws-sqs');
import dynamodb = require('@aws-cdk/aws-dynamodb');


export interface QueueRecorderProps {
  inputQueue: sqs.Queue,
  dynamoTable: dynamodb.Table
}

export class QueueRecorder extends cdk.Construct {
  constructor(parent: cdk.Construct, id: string, props: QueueRecorderProps) {
    super(parent, id);

    const fn = new lambda.Function(this, 'HelloFunction1', {
      runtime: lambda.Runtime.JAVA_8,
      code: lambda.Code.fromAsset("./java-lambda/li/target/myJar.jar"),
      handler: 'com.yimeng.li.Handler',
    });

    
    const fn2 = new lambda.Function(this, 'HelloFunction2', {
      functionName: 'pythonWriteFunction',
      runtime: lambda.Runtime.PYTHON_3_8,
      code: lambda.Code.asset('lambda'),
      handler: 'index.handler'
    });

    fn2.addEnvironment('TABLE_NAME', props.dynamoTable.tableName);
    fn2.addEventSource(new event_sources.SqsEventSource(props.inputQueue));
    props.dynamoTable.grantWriteData(fn2)
  }
}
