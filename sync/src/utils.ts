import { Customer } from '../../types';
import { CustomerWithId, StatCustomer } from './types';
import fs from 'fs';

const getRandomStr = (length = 8) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};

export const anonymize = (customers: StatCustomer[]): CustomerWithId[] => {
  return customers.map(({ document }) => {
    document.firstName = getRandomStr();
    document.lastName = getRandomStr();
    const [, domain] = document.email.split('@');
    document.email = getRandomStr() + domain;
    document.address.line1 = getRandomStr();
    document.address.line2 = getRandomStr();
    document.address.postcode = getRandomStr();
    return { ...document } as Customer;
  });
};

export const writeFileSync = (path: string, text: string) => {
  fs.writeFileSync(path, text, 'utf8');
};

export const readFileSync = (path: string) => {
  if (!fs.existsSync(path)) {
    writeFileSync(path, '');
  }
  return fs.readFileSync(path, 'utf8');
};
