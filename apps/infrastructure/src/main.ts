import { App } from 'aws-cdk-lib';
import { WordlyDynamoStack, WordlyDynamoFillerStack } from './stacks/wordly-dynamo-stack';
import { WordlyLambdasStack } from './stacks/wordly-lambdas-stack';
import { WordlyCodepipelineStack } from './stacks/wordly-codepipeline-stack';

const app = new App();
const wordlyDynamoStack = new WordlyDynamoStack(app, 'wordly-dynamo-stack');
new WordlyDynamoFillerStack(app, 'wordly-dynamo-filler-stack', {
  dynamoDb: wordlyDynamoStack.dynamoDb,
});
new WordlyLambdasStack(app, 'wordly-lambdas-stack', {
  dynamoDb: wordlyDynamoStack.dynamoDb,
});
new WordlyCodepipelineStack(app, 'wordly-codepipeline-stack');
