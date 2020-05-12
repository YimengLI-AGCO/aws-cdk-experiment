import cdk = require('@aws-cdk/core');
import lambda = require('@aws-cdk/aws-lambda');
import event_sources = require('@aws-cdk/aws-lambda-event-sources');
import sqs = require('@aws-cdk/aws-sqs');
import dynamodb = require('@aws-cdk/aws-dynamodb');
import apigateway = require('@aws-cdk/aws-apigateway');
import { Duration } from '@aws-cdk/core';


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

    const table = new dynamodb.Table(this, 'Status', {
      partitionKey: {name: 'id', type: dynamodb.AttributeType.STRING},
      tableName: 'Status'
    });

    fn.addEnvironment('TABLE_NAME', table.tableName);
    fn2.addEnvironment('TABLE_NAME', table.tableName);

    // defines an API Gateway REST API resource backed by our "hello" function.
    
    const getAllData = new lambda.Function(this, '[DYNAMO]getAllData', {
      functionName: 'DYNAMO-getAllData',
      runtime: lambda.Runtime.JAVA_8,
      memorySize: 512,
      timeout: Duration.seconds(20),
      code: lambda.Code.fromAsset("./java-lambda/li/target/myJar.jar"),
      handler: 'com.yimeng.li.HttpHandler::handleGetAllRequest',
    });

    const createData = new lambda.Function(this, '[DYNAMO]createData', {
      functionName: 'DYNAMO-createData',
      runtime: lambda.Runtime.JAVA_8,
      memorySize: 512,
      timeout: Duration.seconds(20),
      code: lambda.Code.fromAsset("./java-lambda/li/target/myJar.jar"),
      handler: 'com.yimeng.li.HttpHandler::handleCreateRequest',
    });

    const api = new apigateway.RestApi(parent, 'test-api', {
      restApiName: 'DynamoDB CRUD service'
    });

    const items = api.root.addResource('status');
    const getAllIntegration = new apigateway.LambdaIntegration(getAllData);
    items.addMethod('GET', getAllIntegration);  // GET /items

    const createIntegration = new apigateway.LambdaIntegration(createData);
    items.addMethod('POST', createIntegration);

    table.grantReadData(getAllData);
    table.grantWriteData(createData);
    table.grantWriteData(fn);
  }
}
