import { APIGatewayProxyHandler, APIGatewayProxyEvent, Context } from 'aws-lambda';
import {PRODUCT_QUERY} from '../queries/index';
import { createResponse } from '../../helpers/createResponse';
import connectToDb from '../../helpers/connectToDb';

export const getProductsList: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent, context: Context) => {
  const client = await connectToDb();
  
  try {
    console.log('getProductsList ', event);
    const { rows } = await client.query(PRODUCT_QUERY.GET_PRODUCT_LIST);

    return createResponse(200, { products: rows });
  } catch (error) {
    console.log('error on getProductsList: ', error);

    return createResponse(500, { error });
  } finally {
    await client.end();
  }
};
