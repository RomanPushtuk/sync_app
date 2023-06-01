import { describe, it } from 'node:test';
import { DB } from '../src/db';
import { DB_NAME, DB_URI } from '../../constants';

describe('Tests DB', { concurrency: 1 }, (t) => {
  const db = new DB({ uri: DB_URI, db: DB_NAME });
  it('should be connected and disconnected', async () => {
    await db.connect();
    await db.close();
  });
});
