import { StatCustomer } from './types';

export class Pull {
  private isStarted: boolean = false;
  private pull: StatCustomer[] = [];
  private intervalId: NodeJS.Timer | null = null;
  private overflowCb: ((customers: StatCustomer[]) => void) | null = null;

  async add(customer: StatCustomer) {
    this.pull.push(customer);
    if (this.pull.length >= 150) {
      const thousandCustomers = this.pull.splice(0, 150);
      await this.emitOverflow(thousandCustomers);
    }
  }

  start() {
    this.isStarted = true;
    this.intervalId = setInterval(async () => {
      if (!this.isStarted) return;
      const customers = this.pull.splice(0, this.pull.length - 1);
      await this.emitOverflow(customers);
    }, 1000);
  }

  stop() {
    this.isStarted = false;
    if (this.intervalId) clearInterval(this.intervalId);
    this.overflowCb = null;
  }

  emitOverflow(customers: StatCustomer[]) {
    if (this.overflowCb) return this.overflowCb(customers);
  }

  overflow(overflowCb: (customers: StatCustomer[]) => void) {
    this.overflowCb = overflowCb;
  }
}
