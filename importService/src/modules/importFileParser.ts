import AWS from 'aws-sdk';
import csv from 'csv-parser';
import { createResponse } from '../../../helpers/createResponse';
const BUCKET = 'importservice-bucket';

export const importFileParser = async (event) => {
  const s3 = new AWS.S3({region: 'eu-west-1', signatureVersion: "v4"});
  const sqs = new AWS.SQS();

  console.log('importFileParser ', event);

  const { Records } = event;
  let allFiles = [];
  
  await new Promise((resolve, reject) => {
    Records.forEach(record => {
      console.log('record.s3', record.s3);

      const params = {
        Bucket: BUCKET,
        Key: record.s3.object.key,
      }

    const s3Stream = s3.getObject(params).createReadStream();

      s3Stream.pipe(csv())
        .on('data', async (data) => {
          console.log('on data', data);
          allFiles.push(data);

          await new Promise((resolve, reject) => {
            sqs.sendMessage({ QueueUrl: process.env.SQS_URL, MessageBody: JSON.stringify(data) }, (err, data) => {
                if(err) {
                  console.log('Error occured while sending message ', err);
                  reject(err);
                } else {
                  console.log('Message is sended to ', data);
                  resolve(data);
                }
            });
          });
        })
        .on('error', (error) => {
          console.log(error);
          reject(error);
        })
        .on('end', async () => {
          console.log('Object parsed succesfully');
          console.log('allFiles ', allFiles);

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

          resolve(true);
        });
    })
  });
  
  await new Promise((resolve, reject) => {
    sqs.sendMessage({ QueueUrl: process.env.SQS_URL, MessageBody: JSON.stringify({ lastMessage: true }) }, 
    (err, data) => {
        if(err) {
          console.log('Error occured while sending message ', err);
          reject(err);
        } else {
          console.log('Last message is sended ', data);
          resolve(data);
        }
    });
  });

  console.log('Success exit from importFileParser');

  return createResponse(200);
};
