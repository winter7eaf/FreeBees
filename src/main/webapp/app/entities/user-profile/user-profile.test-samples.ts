import { IUserProfile, NewUserProfile } from './user-profile.model';

export const sampleWithRequiredData: IUserProfile = {
  id: 10373,
};

export const sampleWithPartialData: IUserProfile = {
  id: 71069,
  description: '../fake-data/blob/hipster.txt',
  postcode: 'G0A 8YD',
};

export const sampleWithFullData: IUserProfile = {
  id: 42954,
  description: '../fake-data/blob/hipster.txt',
  postcode: 'GIR 0AA',
};

export const sampleWithNewData: NewUserProfile = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
