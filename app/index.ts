import 'dotenv/config';
import { AppDB } from './src/db';
import { App } from './src/app';
import { Faker } from './src/faker';
import { DB_NAME, DB_URI } from '../constants';

const db = new AppDB({ uri: DB_URI, db: DB_NAME });
const faker = new Faker();
const app = new App({ db, faker });

const bootstrap = async () => {
  console.log(`Process id: ${process.pid}`);
  await app.start();
};

const shutdown = async () => {
  await app.stop();
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

bootstrap();
