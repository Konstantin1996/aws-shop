import AWS from 'aws-sdk';
import { createResponse } from '../../../helpers/createResponse';
const BUCKET = 'importservice-bucket';

export const importProductsFile = async (event) => {
  console.log('ITS ME');
  console.log('importProductFile', event);

  const { queryStringParameters } = event;
  const fileName = queryStringParameters?.name;
  console.log('fileName ', fileName);

  if(!fileName) {
    return createResponse(404, { error: 'Invalid query params (expected parameter name)'});
  }

  const catalogPath = `uploaded/${fileName}`;
  const s3 = new AWS.S3({region: 'eu-west-1', signatureVersion: "v4"});

  const params = {
    Bucket: BUCKET,
    Key: catalogPath,
    Expires: 60,
  }
  
  try {
    const linkToUpload = await s3.getSignedUrl('putObject', params);
    console.log('success ', linkToUpload);

    return createResponse(200, linkToUpload);
  } catch (error) {
    console.log('error ', error);

    return createResponse(500, { error });
  }

}