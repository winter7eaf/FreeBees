import { ICharityUser, NewCharityUser } from './charity-user.model';

export const sampleWithRequiredData: ICharityUser = {
  id: 71218,
};

export const sampleWithPartialData: ICharityUser = {
  id: 14289,
  description: '../fake-data/blob/hipster.txt',
};

export const sampleWithFullData: ICharityUser = {
  id: 77963,
  charityName: 'orchid',
  description: '../fake-data/blob/hipster.txt',
  logoURL: 'schemas',
  website: 'Falls',
};

export const sampleWithNewData: NewCharityUser = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
