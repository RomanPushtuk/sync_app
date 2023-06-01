import { Db, Filter, Document, MongoClient, ChangeStreamOptions, ChangeStreamInsertDocument } from 'mongodb';
import { DbOptions } from './types';

export class DB {
  private client: MongoClient;
  protected db: Db;

  constructor({ uri, db }: DbOptions) {
    if (!uri || !db) throw new Error('uri or db not passed');
    this.client = new MongoClient(uri);
    this.db = this.client.db(db);
  }

  async connect() {
    await this.client.connect();
  }

  async close() {
    await this.client.close();
  }

  async insert(data: Document[], collectionName: string) {
    try {
      await this.db.collection(collectionName).insertMany(data, { ordered: false, writeConcern: { w: 'majority' } });
    } catch (e: any) {
      if (e.code === 11000) return; // ignore duplicate id key error
      throw e;
    }
  }

  watch<T extends Document>(options: ChangeStreamOptions, collectionName: string) {
    return this.db
      .collection(collectionName)
      .watch<T, ChangeStreamInsertDocument<T>>([], { fullDocument: 'updateLookup', ...options });
  }

  find<T extends Document>(filter: Filter<Document>, collectionName: string) {
    return this.db.collection(collectionName).find<T>(filter);
  }
}
