import * as cdk from '@aws-cdk/core';
import s3 = require('@aws-cdk/aws-s3');
import deploy = require('@aws-cdk/aws-s3-deployment');


export class BucketStack extends cdk.Stack {
  public readonly bucket: s3.IBucket;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    this.bucket = new s3.Bucket(this, 'Hello S3');
    new deploy.BucketDeployment(this, 'Deploy', {
      destinationBucket: this.bucket,
      sources: [deploy.Source.asset('./java-lambda/target/jarfile/')]
    });
  }
}
