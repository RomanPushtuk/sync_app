import * as assert from 'assert';
import { Pull } from '../src/pull';
import { describe, it, beforeEach, mock } from 'node:test';

describe('Tests for Pull class logic', { concurrency: 1 }, () => {
  let pull: any;
  let mockOverflowCb: any;

  beforeEach(() => {
    pull = new Pull();
    mockOverflowCb = mock.fn(() => {
      return;
    });
  });

  it('should not be overflowCb called until it is empty', () => {
    pull.overflow(mockOverflowCb);
    assert.strictEqual(mockOverflowCb.mock.calls.length, 0);
  });

  it('should not be overflowCb called until pull not fully filled', () => {
    pull.overflow(mockOverflowCb);
    const customers = new Array(999);
    pull.add(customers);
    assert.strictEqual(mockOverflowCb.mock.calls.length, 0);
  });

  it('should be overflowCb called when pull is fulled', () => {
    pull.overflow(mockOverflowCb);
    const customers = new Array(1000);
    pull.add(customers);
    assert.strictEqual(mockOverflowCb.mock.calls.length, 1);
  });

  it('should be overflowCb called when 1sec pass', async (t, done) => {
    pull.overflow(mockOverflowCb);
    pull.start();
    const customers = new Array(200);
    pull.add(customers);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    assert.strictEqual(mockOverflowCb.mock.calls.length, 1);
    done();
  });
});
