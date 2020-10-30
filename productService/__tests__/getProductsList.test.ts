import { getProductsList, getProductsById } from '../handler';
import { APIGatewayProxyEvent } from 'aws-lambda';

const successResponseWithArray = {
  "body": "{\"products\":[{\"count\":4,\"description\":\"Case for Iphone\",\"id\":\"7567ec4b-b10c-48c5-9345-fc73c48a80aa\",\"price\":2.4,\"title\":\"Blue case\"}]}",
  "headers": {"Access-Control-Allow-Credentials": true, "Access-Control-Allow-Origin": "*"},
  "statusCode": 200,
}

const successResponse = {
  "body": "{\"products\":{\"count\":4,\"description\":\"Case for Iphone\",\"id\":\"7567ec4b-b10c-48c5-9345-fc73c48a80aa\",\"price\":2.4,\"title\":\"Blue case\"}}",
  "headers": {"Access-Control-Allow-Credentials": true, "Access-Control-Allow-Origin": "*"},
  "statusCode": 200
}

const errorResponse = {
  "body": "{\"status\":404,\"description\":\"Error: No such product\"}",
  "statusCode": 404
}

jest.mock('../mocks/products.json', () => ([
  {
    "count": 4,
    "description": "Case for Iphone",
    "id": "7567ec4b-b10c-48c5-9345-fc73c48a80aa",
    "price": 2.4,
    "title": "Blue case"
  }
]));

describe('productService', () => {
  const mockedEvent = (productId) => {
    return {
      pathParameters: {
        productId
      },
    };
  }

  describe('getProductsList', () => {
    it('should return array with products and status code 200 ', async () => {
      const result = await getProductsList(null, null, null);

      expect(result).toEqual(successResponseWithArray);
    });
  });

  describe('getProductsById', () => {
    it('should return one product with status code 200', async () => {
      const result = await getProductsById(mockedEvent("7567ec4b-b10c-48c5-9345-fc73c48a80aa") as unknown as APIGatewayProxyEvent, null, null);

      expect(result).toEqual(successResponse);
    });

    it('should return status code 404 with error for product id that does not exist', async () => {
      const result = await getProductsById(mockedEvent("id-does-not-exist") as unknown as APIGatewayProxyEvent, null, null);

      expect(result).toEqual(errorResponse);
    });
  });
})