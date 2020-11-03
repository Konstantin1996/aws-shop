import { APIGatewayProxyHandler, APIGatewayProxyEvent, Context } from 'aws-lambda';
import 'source-map-support/register';
import products from './mocks/products.json';

export const getProductsList: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent, context: Context) => {
  /* GET CAT PICTURE WITH AWAIT

    import axios from 'axios'
    const axios = require('axios');
    const { data: { file } } = await axios.get('https://aws.random.cat/meow?ref=apilist.fun');

    return {
      statusCode: 200,
      body: JSON.stringify({ file })
    }
  */
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