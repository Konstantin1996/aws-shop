import { Client } from 'pg';
import { createResponse } from './createResponse';

const { PG_HOST, PG_PORT_UPDATED, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env;
const dbOptions = {
  host: PG_HOST,
  port: PG_PORT_UPDATED,
  database: PG_DATABASE,
  user: PG_USERNAME,
  password: PG_PASSWORD,
  connectionTimeoutMillis: 5000
}

export default async () => {
  try {
    const client = new Client(dbOptions);
    await client.connect();

    return client;
  } catch(error) {
    console.log('something was wrong with connection: ', error);
    return createResponse(500, { error });
  }
}