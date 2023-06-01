import DB, { DbOptions } from '../../db';
import { CUSTOMERS } from '../../constants';
import { Customer } from '../../types';

export class AppDB extends DB {
  constructor({ uri, db }: DbOptions) {
    super({ uri, db });
  }

  async insert(customers: Customer[]) {
    return super.insert(customers, CUSTOMERS);
  }
}
