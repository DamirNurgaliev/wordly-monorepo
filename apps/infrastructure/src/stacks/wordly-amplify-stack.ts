import { Construct } from 'constructs';
import {Stack, StackProps} from 'aws-cdk-lib';
import { SecretValue } from 'aws-cdk-lib/core';
import * as amplify from '@aws-cdk/aws-amplify-alpha';
import * as CodeBuild from "aws-cdk-lib/aws-codebuild";

interface AmplifyStackProps extends StackProps {
  lambdaUrl: string;
}

export class WordlyAmplifyStack extends Stack {
  constructor(scope: Construct, id: string, props: AmplifyStackProps) {
    super(scope, id);

    const amplifyApp = new amplify.App(this, 'WordlySpa', {
      sourceCodeProvider: new amplify.GitHubSourceCodeProvider({
        owner: 'DamirNurgaliev',
        repository: 'wordly-monorepo',
        oauthToken: SecretValue.secretsManager('GitHubToken'),
      }),
      buildSpec: CodeBuild.BuildSpec.fromSourceFilename(
        './apps/wordly-spa/amplify.yml'
      ),
      environmentVariables: { "NX_LAMBDA_API_URL": props.lambdaUrl }
    });

    amplifyApp.addBranch('main');
  }
}
