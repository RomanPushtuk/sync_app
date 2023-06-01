import { AppDB } from './db';
import { Faker } from './faker';

export class App {
  private intervalId: NodeJS.Timer | null = null;
  private db: AppDB;
  private faker: Faker;

  constructor({ db, faker }: { db: AppDB; faker: Faker }) {
    this.db = db;
    this.faker = faker;
  }

  async start() {
    await this.db.connect();

    this.intervalId = setInterval(async () => {
      const customers = this.faker.createRandomCustomers();
      await this.db.insert(customers);
    }, 200);
  }

  async stop() {
    if (this.intervalId) clearInterval(this.intervalId);
    await this.db.close();
  }
}
