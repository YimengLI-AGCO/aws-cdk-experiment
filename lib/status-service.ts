import cdk = require('@aws-cdk/core');
import lambda = require('@aws-cdk/aws-lambda');
import dynamodb = require('@aws-cdk/aws-dynamodb');
import apigateway = require('@aws-cdk/aws-apigateway');
import { Duration } from '@aws-cdk/core';
import bucket = require('@aws-cdk/aws-s3');
import deploy = require('@aws-cdk/aws-s3-deployment');


export interface StatusServiceProps {
  dynamoTable: dynamodb.Table
}

export class StatusService extends cdk.Construct {
  constructor(parent: cdk.Construct, id: string, props: StatusServiceProps) {
    super(parent, id);


    const s3bucket = new bucket.Bucket(this, 'Hello S3', {
      bucketName: 'yimengs3testtest'
    });
    new deploy.BucketDeployment(this, 'Deploy', {
      destinationBucket: s3bucket,
      sources: [deploy.Source.asset('./java-lambda/target/jarfile/')]
    });

    const getAllData = new lambda.Function(this, '[DYNAMO]getAllData', {
      functionName: 'DYNAMO-getAllData',
      runtime: lambda.Runtime.JAVA_8,
      memorySize: 512,
      timeout: Duration.seconds(20),
      code: lambda.S3Code.fromBucket(s3bucket, 'myJar.jar'),
      handler: 'com.yimeng.li.HttpHandler::handleGetAllRequest',
    });

    const createData = new lambda.Function(this, '[DYNAMO]createData', {
      functionName: 'DYNAMO-createData',
      runtime: lambda.Runtime.JAVA_8,
      memorySize: 512,
      timeout: Duration.seconds(20),
      code: lambda.S3Code.fromBucket(s3bucket, 'myJar.jar'),
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
