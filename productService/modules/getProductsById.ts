import { APIGatewayProxyHandler } from 'aws-lambda';
import connectToDb from '../helpers/connectToDb';

export const getProductsById: APIGatewayProxyHandler = async (event, _context) => {
  try {
    const client = await connectToDb();
    const { productId } = event.pathParameters;

    const query = {
      text: 'select * from products where products.id=$1',
      values: [productId]
    }

    const { rows: searchedProduct} = await client.query(query);
    console.log('searchedProduct: ', searchedProduct);

    console.log(`method getProductsById was called with next pathParameters: productId ${productId}`);

    if(!searchedProduct) {
      throw new Error('No such product');
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(
        {
          products: searchedProduct,
        }
      ),
    };
  } catch(error) {
    console.log('error in getProductsById: ', error);
    return {
      statusCode: 404,
      body: JSON.stringify({
        status: 404, description: String(error)
      })
    }
  }
};