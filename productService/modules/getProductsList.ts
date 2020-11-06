import { APIGatewayProxyHandler, APIGatewayProxyEvent, Context } from 'aws-lambda';
import connectToDb from '../helpers/connectToDb';

export const getProductsList: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent, context: Context) => {
  try {
    console.log('method getProductsList was called without params');
    const client = await connectToDb();
    const { rows } = await client.query('select * from products inner join stocks on stocks.product_id = products.id');

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(
      {
          products: rows,
      }
      ),
    };
  } catch (error) {
      console.log('error on getProductsList: ', error);
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify(
        {
            error,
        }
        ),
      };
  }
};
