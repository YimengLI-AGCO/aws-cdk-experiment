import cdk = require('@aws-cdk/core');
import lambda = require('@aws-cdk/aws-lambda');
import event_sources = require('@aws-cdk/aws-lambda-event-sources');
import sqs = require('@aws-cdk/aws-sqs');
import dynamodb = require('@aws-cdk/aws-dynamodb')
import * as apigw from '@aws-cdk/aws-apigateway';


export interface QueueRecorderProps {
  inputQueue: sqs.Queue
}

export class QueueRecorder extends cdk.Construct {
  constructor(parent: cdk.Construct, id: string, props: QueueRecorderProps) {
    super(parent, id);

    const fn2 = new lambda.Function(this, 'HelloFunction', {
      runtime: lambda.Runtime.PYTHON_3_8,
      code: lambda.Code.asset('lambda'),
      handler: 'index.handler'
    });

    const fn = new lambda.Function(this, 'HelloFunction1', {
      runtime: lambda.Runtime.JAVA_8,
      code: lambda.Code.fromAsset("./java-lambda/li/target/myJar.jar"),
      handler: 'com.yimeng.li.Handler',
    });


    fn.addEventSource(new event_sources.SqsEventSource(props.inputQueue));

    const table = new dynamodb.Table(this, 'QueueRecorderTable', {
      partitionKey: {name: 'id', type: dynamodb.AttributeType.STRING}
    });

    fn.addEnvironment('TABLE_NAME', table.tableName);
    fn2.addEnvironment('TABLE_NAME', table.tableName);

    // defines an API Gateway REST API resource backed by our "hello" function.
    
    const fn3 = new lambda.Function(this, 'HelloFunction2', {
      runtime: lambda.Runtime.JAVA_8,
      code: lambda.Code.fromAsset("./java-lambda/li/target/myJar.jar"),
      handler: 'com.yimeng.li.HttpHandler::handleGetAllRequest',
    });
    
    const api = new apigw.LambdaRestApi(parent, 'test-api', {
      handler: fn3,
      proxy: false
    });


    const items = api.root.addResource('items');
    items.addMethod('GET');  // GET /items

    table.grantWriteData(fn);
  }
}