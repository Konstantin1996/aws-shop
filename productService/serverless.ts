import type { Serverless } from 'serverless/aws';

const serverlessConfiguration: Serverless = {
  service: {
    name: 'productservicenew',
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
      },
      {
        Effect: "Allow",
        Action: "sns:*",
        Resource: "arn:aws:sns:eu-west-1:950839913722:createProductTopicsns"
      }
    ],
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      PG_HOST: process.env.PG_HOST,
      PG_PORT: process.env.PG_PORT,
      PG_DATABASE: process.env.PG_DATABASE,
      PG_USERNAME: process.env.PG_USERNAME,
      PG_PASSWORD: process.env.PG_PASSWORD,
      SQS_URL: process.env.SQS_URL,
    },
  },
  resources: {
    Resources: {
      "SNSTopic": {
        Type: "AWS::SNS::Topic",
        Properties: {
          "TopicName": "createProductTopicsns"
        }
      },
      "SNSSubscription": {
        Type: "AWS::SNS::Subscription",
        Properties: {
          Endpoint: "wha@extraale.com",
          Protocol: "email",
          TopicArn: {
            Ref: "SNSTopic"
          }
        }
      }
    },
  },
  functions: {
    getProductsList: {
      handler: 'handler.getProductsList',
      events: [
        {
          http: {
            method: 'get',
            path: 'products',
            cors: true
          },
        }
      ]
    },
    getProductsById: {
      handler: 'handler.getProductsById',
      events: [
        {
          http: {
            method: 'get',
            path: 'products/{productId}',
            cors: true
          }
        }
      ]
    },
    createProduct: {
      handler: 'handler.createProduct',
      events: [
        {
          http: {
            method: 'post',
            path: 'products/',
            cors: true
          }
        }
      ]
    },
    catalogBatchProcess: {
      handler: 'handler.catalogBatchProcess',
      events: [
        { 
          sqs: {
            arn: "arn:aws:sqs:eu-west-1:950839913722:catalogItemsQueueSQS", 
            batchSize: 5
          }
        }
      ],
    },
  }
}

module.exports = serverlessConfiguration;
