import { APIGatewayProxyHandler } from 'aws-lambda';
import { createResponse } from '../helpers/createResponse';
import { Product } from '../models/Product';
import { PRODUCT_QUERY } from '../queries/index';
import connectToDb from '../helpers/connectToDb';

export const createProduct: APIGatewayProxyHandler = async (event) => {
  const client = await connectToDb();

  try {
    console.log('create product: ', event);

    await client.query('BEGIN');

    const body = JSON.parse(event.body) as Product;
    const { title, description, price, imagelink } = body;
    console.log(`method createProduct was called with: title ${title}; description ${description}; price ${price}; imagelink ${imagelink}`);

    const insertIntoProductQuery = {
      text: PRODUCT_QUERY.INSERT_INTO_PRODUCTS,
      values: [title, description, price, imagelink]
    }

    const { rows } = await client.query(insertIntoProductQuery);
    const productId = rows[0].id;

    const insertIntoStocksQuery = {
      text: PRODUCT_QUERY.INSERT_INTO_STOCKS,
      values: [productId, 1]
    }

    console.log(`product with id ${productId} was created`);

    await client.query(insertIntoStocksQuery);

    console.log(`stock for ${productId} was created`);

    const getProductByIdQuery = {
      text: PRODUCT_QUERY.GET_PRODUCT_BY_ID,
      values: [productId]
    }

    const { rows: createdProduct } = await client.query(getProductByIdQuery);

    await client.query('COMMIT');
    console.log('transaction success');

    return createResponse(201, { createdProduct })
  } catch (error) {
    console.log('error in createProduct: ', error);
    await client.query('ROLLBACK');

    return createResponse(500, { error });
  } finally {
    await client.end();
  }
}