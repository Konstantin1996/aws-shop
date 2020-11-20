import connectToDb from '../../../helpers/connectToDb';
import AWS from 'aws-sdk';
import { PRODUCT_QUERY } from '../queries'
import { createResponse } from '../../../helpers/createResponse';

/*
  Should create products that are recieved from SQS in importService -> importFileParser handler
  If the message is last it has flag lastMessage. 
  After sending lastMessage flag lamda should notify user by email that parsed was completed
*/ 
export const catalogBatchProcess = async (event) => {
  console.log('catalogBatchProcess event: ', event);

  const sns = new AWS.SNS();
  const client = await connectToDb();
  const { Records } = event;

  for (const record of Records) {
    const { body }  = record;
    const parsed = JSON.parse(body);
    
    console.log('record ', record);

    if (parsed.lastMessage) {
      console.log('Try to send notification');

      await new Promise((resolve, reject) => {
        sns.publish({ 
          Subject: "All products are parsed", 
          Message: JSON.stringify("Parse was completed"), 
          TopicArn: process.env.SNS_ARN }, (err, data) => {
            if(err) {
              console.log('Error accured while sending notification', err);
              reject(err);
            } else {
              console.log('Notification was sended', data);
              resolve(data);
            }
          });
      });

      return createResponse(200);
    }

    const { title, description , price, imagelink, count } = parsed;

    if (!title || !description || !price || !imagelink || !count) {
      return createResponse(500, { error: 'some fields are empty while parsing csv'});
    }

    console.log(`title ${title}; description ${description}; price ${price}; imagelink ${imagelink}; count ${count}`);

    try {
      console.log('BEGIN');
      
      await client.query('BEGIN');

      const insertIntoProductQuery = {
        text: PRODUCT_QUERY.INSERT_INTO_PRODUCTS,
        values: [title, description, price, imagelink]
      }

      const { rows } = await client.query(insertIntoProductQuery);
      const productId = rows[0].id;
      console.log(`product with id ${productId} was created`);

      const insertIntoStocksQuery = {
        text: PRODUCT_QUERY.INSERT_INTO_STOCKS,
        values: [productId, count]
      }
      await client.query(insertIntoStocksQuery);
      console.log(`stock for ${productId} was created`);

      await client.query('COMMIT');
      console.log('transaction success');

    } catch(error) {
      console.log('error in createProduct: ', error);
      await client.query('ROLLBACK');

      return createResponse(500, { error });
    } 
  }

  console.log('catalogBatchProcess success exit');

  return createResponse(200);
};