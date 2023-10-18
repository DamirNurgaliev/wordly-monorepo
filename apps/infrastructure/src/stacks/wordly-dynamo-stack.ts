import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Duration, RemovalPolicy, StackProps, Stack } from 'aws-cdk-lib';
import { Asset } from 'aws-cdk-lib/aws-s3-assets';
import * as lambda from 'aws-cdk-lib/aws-lambda-nodejs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import * as cr from 'aws-cdk-lib/custom-resources';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as path from 'path';

interface DynamoFillerStackProps extends StackProps {
  dynamoDb: dynamodb.Table;
}

export class WordlyDynamoStack extends Stack {
  public readonly dynamoDb: dynamodb.Table;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.dynamoDb = new dynamodb.Table(this, 'entitiesTable', {
      partitionKey: { name: 'entity', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'uuid', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
    });
  }
}

export class WordlyDynamoFillerStack extends Stack {
  constructor(scope: Construct, id: string, props: DynamoFillerStackProps) {
    super(scope, id);

    const fileAsset = new Asset(this, 'ruFiveWordsAsset', {
      path: path.join(__dirname, '../../wordly-words', 'ru5WithComplexity.txt'),
    });

    const fillDbWithWords = new lambda.NodejsFunction(this, 'fillDbWithWords', {
      entry: path.join(__dirname, '../lambdas', 'fillDbWithWords.ts'),
      runtime: Runtime.NODEJS_16_X,
      timeout: Duration.minutes(1),
      memorySize: 256,
      functionName: 'fillDbWithWords',
      environment: {
        S3_BUCKET_NAME: fileAsset.s3BucketName,
        S3_OBJECT_KEY: fileAsset.s3ObjectKey,
        DYNAMODB_TABLE: props.dynamoDb.tableName,
      },
    });

    // Fill dynamo with words on initial deploy
    new cr.AwsCustomResource(this, 'fillDbWithWordsLambdaTrigger', {
      policy: cr.AwsCustomResourcePolicy.fromStatements([
        new iam.PolicyStatement({
          actions: ['lambda:InvokeFunction'],
          effect: iam.Effect.ALLOW,
          resources: [fillDbWithWords.functionArn],
        }),
      ]),
      timeout: Duration.minutes(15),
      onCreate: {
        service: 'Lambda',
        action: 'invoke',
        parameters: {
          FunctionName: fillDbWithWords.functionName,
          InvocationType: 'Event',
        },
        physicalResourceId: cr.PhysicalResourceId.of(
          'fillDbWithWordsPhysicalId'
        ),
      },
    });

    fileAsset.grantRead(fillDbWithWords);
    props.dynamoDb.grantFullAccess(fillDbWithWords);
  }
}
