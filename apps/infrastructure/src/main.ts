import { App } from 'aws-cdk-lib';
import { WordlyDynamoStack, WordlyDynamoFillerStack } from './stacks/wordly-dynamo-stack';
import { WordlyLambdasStack } from './stacks/wordly-lambdas-stack';
import { WordlyAmplifyStack } from './stacks/wordly-amplify-stack';

const app = new App();
const wordlyDynamoStack = new WordlyDynamoStack(app, 'wordly-dynamo-stack');
new WordlyDynamoFillerStack(app, 'wordly-dynamo-filler-stack', {
  dynamoDb: wordlyDynamoStack.dynamoDb,
});
const lambdaUrl = new WordlyLambdasStack(app, 'wordly-lambdas-stack', {
  dynamoDb: wordlyDynamoStack.dynamoDb,
}).lambdaUrl;
new WordlyAmplifyStack(app, 'wordly-codepipeline-stack', { lambdaUrl: lambdaUrl});
