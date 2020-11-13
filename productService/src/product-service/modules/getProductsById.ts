import { APIGatewayProxyHandler } from 'aws-lambda';
import { PRODUCT_QUERY } from '../queries/index';
import { createResponse } from '../../helpers/createResponse';
import connectToDb from '../../helpers/connectToDb';

export const getProductsById: APIGatewayProxyHandler = async (event, _context) => {
  const client = await connectToDb();

  try {
    console.log('getProductsById ', event);
    const { productId } = event.pathParameters;

    const getProductByIdQuery = {
      text: PRODUCT_QUERY.GET_PRODUCT_BY_ID,
      values: [productId]
    }

    const { rows: searchedProduct } = await client.query(getProductByIdQuery);
    console.log('searchedProduct: ', searchedProduct);

    console.log(`method getProductsById was called with next pathParameters: productId ${productId}`);

    if(!searchedProduct.length) {
      console.log('product was not found');

      return createResponse(404, { error: 'Product not found' });
    }

    return createResponse(200, { products: searchedProduct })
  } catch(error) {
    console.log('error in getProductsById: ', error);

    return createResponse(500, { error });
  } finally {
    await client.end();
  }
};