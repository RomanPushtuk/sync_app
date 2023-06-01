import 'dotenv/config';
import cluster from 'node:cluster';
import process from 'node:process';

import { SyncDB } from './src/db';
import { Pull } from './src/pull';
import { Sync } from './src/sync';
import { Stat } from './src/stat';
import { DB_NAME, DB_URI } from '../constants';

if (cluster.isPrimary) {
  console.log(`Primary process ${process.pid} is started`);
  let worker = cluster.fork();

  worker.on('message', (message) => {
    if (message === 'shutdownMaster') process.exit(0);
  });

  process.stdin.on('data', (data) => {
    const key = data.toString().trim();
    if (key === 'r') {
      // you need press r for reload
      worker.kill('SIGINT');
      worker = cluster.fork();
    }
  });
}

if (cluster.isWorker) {
  const db = new SyncDB({ uri: DB_URI, db: DB_NAME });
  const pull = new Pull();
  const stat = new Stat();
  const app = new Sync({ db, pull, stat });

  console.log(`Worker process ${process.pid} created`);

  const shutdown = async () => {
    await app.stop();
    process.exit(0);
  };

  const bootstrap = async () => {
    await app.start();
    process.send?.('shutdownMaster');
    await shutdown();
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  bootstrap();
}
