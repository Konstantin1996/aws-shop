import { APIGatewayProxyHandler } from 'aws-lambda';
import connectToDb from '../helpers/connectToDb';

export const createProduct: APIGatewayProxyHandler = async (event) => {
  try {
    const client = await connectToDb();
    const { title, description, price, imagelink } = event.body;
    console.log(`method createProduct was called with: title ${title}; description ${description}; price ${price}; imagelink ${imagelink}`);

    const query = {
      text: 'insert into products (title, description, price, imagelink) values ($1, $2, $3, $4);',
      values: [title, description, price, imagelink]
    }

    const { rowCount } = await client.query(query);

    console.log('product was created');

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(
        {
          newProduct: rowCount,
        }
      ),
    }
  } catch (error) {
    console.log('error in createProduct: ', error);
    return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify(
          {
            error,
          }
        ),
    }
  }
}