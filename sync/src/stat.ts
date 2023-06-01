import { StatCustomer, StatState } from './types';
import { writeFileSync, readFileSync } from './utils';
import { MODE, FULL_REINDEX, REAL_SYNC_STAT_FILE, FULL_SYNC_STAT_FILE } from '../constnats';

export class Stat {
  private readonly path: string;
  private state: StatState = {
    started: false,
    resumeToken: '',
  };

  constructor() {
    if (MODE === FULL_REINDEX) {
      this.path = FULL_SYNC_STAT_FILE;
    } else {
      this.path = REAL_SYNC_STAT_FILE;
    }
  }

  recover() {
    this.readState();
    return { ...this.state };
  }

  readState() {
    const result = readFileSync(this.path);
    if (result) this.state = JSON.parse(result);
  }

  writeState() {
    const sfState = JSON.stringify(this.state);
    writeFileSync(this.path, sfState);
  }

  start() {
    if (this.state.started) return;
    this.readState();
    this.state.started = true;
  }

  safeStat(customers: StatCustomer[]) {
    const stat = customers.at(-1);
    if (!stat) return;
    const { resumeToken } = stat;
    this.state.resumeToken = resumeToken;
    this.writeState();
  }

  stop() {
    this.state.started = false;
    this.writeState();
  }
}
