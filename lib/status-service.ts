import cdk = require('@aws-cdk/core');
import lambda = require('@aws-cdk/aws-lambda');
import dynamodb = require('@aws-cdk/aws-dynamodb');
import apigateway = require('@aws-cdk/aws-apigateway');
import { Duration } from '@aws-cdk/core';

export interface StatusServiceProps {
  dynamoTable: dynamodb.Table
}

export class StatusService extends cdk.Construct {
  constructor(parent: cdk.Construct, id: string, props: StatusServiceProps) {
    super(parent, id);

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

    props.dynamoTable.grantReadData(getAllData);
    props.dynamoTable.grantWriteData(createData);
  }
}