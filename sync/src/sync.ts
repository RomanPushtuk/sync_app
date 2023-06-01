import { SyncDB } from './db';
import { Pull } from './pull';
import { anonymize } from './utils';
import { Stat } from './stat';
import { MODE, FULL_REINDEX } from '../constnats';
import { StatCustomer } from './types';

export class Sync {
  private db: SyncDB;
  private pull: Pull;
  private stat: Stat;

  constructor({ db, pull, stat }: { db: SyncDB; pull: Pull; stat: Stat }) {
    this.db = db;
    this.pull = pull;
    this.stat = stat;

    this.anonymizeAndInsert = this.anonymizeAndInsert.bind(this);
    this.pull.overflow(this.anonymizeAndInsert);
  }

  async startRealtimeSync(resumeToken: unknown) {
    this.pull.start();
    const stream = await this.db.watchTo({ resumeAfter: resumeToken });

    for await (const customer of stream) {
      const { _id, fullDocument: document } = customer;
      await this.pull.add({ resumeToken: _id, document });
    }

    await this.stop();
  }

  async startFullSync(resumeToken: string) {
    const stream = this.db.findTo({ createdAt: resumeToken });

    for await (const customer of stream) {
      const { createdAt } = customer;
      await this.pull.add({ resumeToken: createdAt, document: customer });
    }

    await this.stop();
  }

  async anonymizeAndInsert(customers: StatCustomer[]) {
    if (!customers.length) return;

    const anonymized = anonymize(customers);
    await this.db.insertTo(anonymized);

    await this.stat.safeStat(customers);
  }

  async start() {
    this.stat.start();
    await this.db.connect();

    const { resumeToken } = this.stat.recover();
    console.log('resumeToken ', resumeToken);
    if (MODE === FULL_REINDEX) {
      await this.startFullSync(resumeToken as string);
    } else {
      await this.startRealtimeSync(resumeToken as unknown);
    }
  }

  async stop() {
    this.pull.stop();
    await this.db.close();
    this.stat.stop();
  }
}
