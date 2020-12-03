import { APIGatewayProxyHandler } from 'aws-lambda';
import { createResponse } from '../../../helpers/createResponse';
import { generatePolicy } from '../../helpers/generatePolicy';
import 'source-map-support/register';

export const basicAuthorizer: APIGatewayProxyHandler = async (event, _context) => {

  console.log('event: ', event);
  
  if(event?.type !== 'TOKEN'){
    return createResponse(401, { message: 'No authorization header' });
  }

  try {
      const encodedCreds = event?.authorizationToken.split(' ')[1];

      console.log('encodedCreds: ', encodedCreds);

      const decoded = Buffer.from(encodedCreds, 'base64').toString('utf-8').split('"');

      console.log('decoded: ', decoded);

      const userName = decoded[3];
      const userPassword = decoded[decoded.length - 2];

      console.log(`username: ${userName}; password: ${userPassword}`);

      const storedPassword = process.env[userName];

      const effect = !storedPassword || storedPassword !== userPassword ? "Deny" : "Allow";

      console.log('effect: ', effect);

      const policy = generatePolicy(encodedCreds, event?.methodArn, effect);

      return policy;

    } catch (error) {
      console.log(error);
      return createResponse(403, { message: 'Unauthorized', error: error.toString() });
  }
};

