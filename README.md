# Welcome to your CDK TypeScript project!

This is a blank project for TypeScript development with CDK.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template

***

### How to run the project

主要用来测试`CDK`调用`AWS Lambda`(`Java`), `DynamoDB`, `API Gateway` 以及 

```bash
$ cd /java-lambda/li
$ mvn package
$ cd ../..
```

```bash
$ cdk deploy HelloCdkStack --profile ${your_profile}
```

There're 2 Stack: `HelloCdkStack` & `BucketStack`.
`HelloCdkStack` is depends on `BucketStack`, so when you `deploy`/`synth` `HelloCdkStack`, `BucketStack` will be `deploy`/`synth` automatically
