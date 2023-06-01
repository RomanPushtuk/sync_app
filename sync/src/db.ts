import { ResumeToken } from 'mongodb';
import DB, { DbOptions } from '../../db';
import { CUSTOMERS_ANONYMIZED, CUSTOMERS } from '../../constants';
import { CustomerWithId } from './types';

export class SyncDB extends DB {
  constructor({ uri, db }: DbOptions) {
    super({ uri, db });
  }

  insertTo(customers: CustomerWithId[]) {
    return super.insert(customers, CUSTOMERS_ANONYMIZED);
  }

  watchTo(options: { resumeAfter?: ResumeToken }) {
    const { resumeAfter } = options;
    return super.watch<CustomerWithId>({ ...(resumeAfter ? { resumeAfter } : {}) }, CUSTOMERS);
  }

  findTo(options: { createdAt?: string }) {
    const { createdAt } = options;
    const filter = {
      ...(createdAt ? { createdAt: { $gte: createdAt } } : {}),
    };
    return super.find<CustomerWithId>(filter, CUSTOMERS);
  }
}
