import { IUserRate, NewUserRate } from './user-rate.model';

export const sampleWithRequiredData: IUserRate = {
  id: 88721,
  rateAsGiver: 10,
  rateAsReceiver: 3,
};

export const sampleWithPartialData: IUserRate = {
  id: 53682,
  rateAsGiver: 10,
  rateAsReceiver: 1,
};

export const sampleWithFullData: IUserRate = {
  id: 97002,
  rateAsGiver: 10,
  rateAsReceiver: 6,
};

export const sampleWithNewData: NewUserRate = {
  rateAsGiver: 0,
  rateAsReceiver: 0,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
