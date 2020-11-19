import type { Serverless } from 'serverless/aws';

const serverlessConfiguration: Serverless = {
  service: {
    name: 'import-service',
    // app and org for use with dashboard.serverless.com
    // app: your-app-name,
    // org: your-org-name,
  },
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true
    }
  },
  // Add the serverless-webpack plugin
  plugins: ['serverless-webpack', 'serverless-dotenv-plugin'],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    region: 'eu-west-1',
    stage: 'dev',
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: 's3:ListBucket',
        // this rule give access to list our bucket structure
        Resource: 'arn:aws:s3:::importservice-bucket',
      },
      {
        Effect: 'Allow',
        Action: 's3:*',
        /* 
          To have an access to all objects read/write we should provide this rule 
          (change bucket policy and block public access should be turned off)
        */
        Resource: 'arn:aws:s3:::importservice-bucket/*'
      }
    ],
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
  },
  functions: {
    importProductsFile: {
      handler: 'handler.importProductsFile',
      events: [
        {
          http: {
            method: 'get',
            path: '/import',
            cors: true,
          }
        }
      ]
    },
    importFileParser: {
      handler: 'handler.importFileParser',
      events: [
        {
          s3: {
            bucket: 'importservice-bucket',
            event: 's3:ObjectCreated:*',
            // here we can define specific folders to analize them only
            rules: [{ prefix: 'uploaded/', suffix: '.csv'}],
            // This flag confirm that bucket already exist in s3 
            existing: true
          }
        }
      ]
    }
  }
}

module.exports = serverlessConfiguration;
