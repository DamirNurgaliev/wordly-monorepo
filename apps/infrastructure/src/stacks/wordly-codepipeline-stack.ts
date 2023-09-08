import { Construct } from 'constructs';
import * as CodePipeline from 'aws-cdk-lib/aws-codepipeline';
import * as CodePipelineAction from 'aws-cdk-lib/aws-codepipeline-actions';
import { RemovalPolicy } from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as CodeBuild from 'aws-cdk-lib/aws-codebuild';
import { SecretValue } from 'aws-cdk-lib/core';

export class WordlyCodepipelineStack extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const spaBucket = new s3.Bucket(this, 'spaBucket', {
      bucketName: 'spa-wordly-bucket',
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
      autoDeleteObjects: true,
      removalPolicy: RemovalPolicy.DESTROY,
      publicReadAccess: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS,
      accessControl: s3.BucketAccessControl.BUCKET_OWNER_FULL_CONTROL,
    });

    const outputSources = new CodePipeline.Artifact();
    const outputWebsite = new CodePipeline.Artifact();

    const pipeline = new CodePipeline.Pipeline(this, 'Pipeline', {
      pipelineName: 'wordly-main',
      restartExecutionOnUpdate: true,
    });

    pipeline.addStage({
      stageName: 'Source',
      actions: [
        new CodePipelineAction.GitHubSourceAction({
          actionName: 'Prepare',
          owner: 'DamirNurgaliev',
          repo: 'wordly-monorepo',
          oauthToken: SecretValue.secretsManager('GitHubToken'),
          output: outputSources,
          trigger: CodePipelineAction.GitHubTrigger.WEBHOOK,
          branch: 'main',
        }),
      ],
    });

    pipeline.addStage({
      stageName: 'Build',
      actions: [
        new CodePipelineAction.CodeBuildAction({
          actionName: 'wordly-main',
          project: new CodeBuild.PipelineProject(this, 'build', {
            projectName: 'Wordly',
            buildSpec: CodeBuild.BuildSpec.fromSourceFilename(
              './apps/wordly-spa/buildspec.yml'
            ),
            environment: {
              buildImage: CodeBuild.LinuxBuildImage.STANDARD_7_0,
            },
          }),
          input: outputSources,
          outputs: [outputWebsite],
        }),
      ],
    });

    pipeline.addStage({
      stageName: 'Deploy',
      actions: [
        new CodePipelineAction.S3DeployAction({
          actionName: 'Deploy',
          input: outputWebsite,
          bucket: spaBucket,
        }),
      ],
    });
  }
}
