import { OptionalUnlessRequiredId, ResumeToken } from 'mongodb';
import { Customer } from '../../types';

export type CustomerWithId = OptionalUnlessRequiredId<Customer>;

export type StatCustomer = { resumeToken: ResumeToken | string; document: CustomerWithId };

export type StatState = { started: boolean; resumeToken: ResumeToken | string };
