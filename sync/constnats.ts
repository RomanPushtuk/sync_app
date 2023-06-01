import process from 'node:process';

export const MODE = process.argv[2];
export const FULL_REINDEX = '--full-reindex';
export const REAL_SYNC_STAT_FILE = './realSyncStatFile.txt';
export const FULL_SYNC_STAT_FILE = './fullSyncStatFile.txt';
