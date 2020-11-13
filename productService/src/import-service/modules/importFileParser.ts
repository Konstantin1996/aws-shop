import AWS from 'aws-sdk';
import csv from 'csv-parser';
import { createResponse } from '../../helpers/createResponse';
const BUCKET = 'importservice-bucket';

export const importFileParser = (event) => {
  const s3 = new AWS.S3({region: 'eu-west-1', signatureVersion: "v4"});
  console.log('importFileParser ', event);

  const { Records } = event;
  
  Records.forEach(record => {
    console.log(record.s3);

    const params = {
      Bucket: BUCKET,
      Key: record.s3.object.key,
    }

    const s3Stream = s3.getObject(params).createReadStream();

    s3Stream.pipe(csv())
      .on('data', (data) => {
        console.log(data);
      })
      .on('error', (error) => {
        console.log(error);
      })
      .on('end', async () => {
        console.log('Object parsed succesfully');

        const sourcePath = BUCKET + '/' + record.s3.object.key;
        const targetPath = record.s3.object.key.replace('uploaded', 'parsed');

        console.log('sourcePath ', sourcePath);
        console.log('tagetPath ', targetPath);

        const paramsToCopy = {
          Bucket: BUCKET,
          CopySource: sourcePath,
          Key: targetPath
        }

        const paramsToDelete = {
          Bucket: BUCKET,
          Key: record.s3.object.key,
        }

        await s3.copyObject(paramsToCopy).promise();
        console.log('Copied into ', BUCKET + '/' + targetPath);

        await s3.deleteObject(paramsToDelete).promise();
        console.log('Deleted from ', sourcePath);
      });
  })

  return createResponse(200);
};
