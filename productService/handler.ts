import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import products from './mocks/products.json';

export const getProductsList: APIGatewayProxyHandler = async () => {

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(
    {
        products,
    }
    ),
  };
};

export const getProductsById: APIGatewayProxyHandler = async (event, _context) => {
  try {
    const { productId } = event.pathParameters;
    const searchedProduct = products.find(product => product.id === productId);

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
  } catch(err) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        status: 404, description: String(err)
      })
    }
  }
};