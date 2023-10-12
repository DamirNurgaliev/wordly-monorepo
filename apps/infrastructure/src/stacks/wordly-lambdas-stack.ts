import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda-nodejs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { Duration, StackProps, Stack } from 'aws-cdk-lib';
import * as apigwv from 'aws-cdk-lib/aws-apigateway';
import * as path from 'path';

interface LambdaStackProps extends StackProps {
  dynamoDb: dynamodb.Table;
}

export class WordlyLambdasStack extends Stack {
  public readonly lambdaUrl: string;

  constructor(scope: Construct, id: string, props: LambdaStackProps) {
    super(scope, id);

    const verifyAnswer = new lambda.NodejsFunction(this, 'verifyAnswer', {
      entry: path.join(__dirname, '../lambdas', 'verifyAnswer.ts'),
      runtime: Runtime.NODEJS_16_X,
      timeout: Duration.seconds(10),
      memorySize: 128,
      functionName: 'verifyAnswer',
      environment: {
        DYNAMODB_TABLE: props.dynamoDb.tableName,
      },
    });

    this.lambdaUrl = new apigwv.LambdaRestApi(this, 'verifyAnswerApi', {
      handler: verifyAnswer,
    }).url;

    props.dynamoDb.grantFullAccess(verifyAnswer);
  }
}
