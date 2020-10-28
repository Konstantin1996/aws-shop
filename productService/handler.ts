import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import products from './mocks/products.json';

export const getProductsList: APIGatewayProxyHandler = async (event, _context) => {

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
  const { productId } = event.pathParameters;
  const searchedProduct = products.find(product => product.id === productId);

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
};