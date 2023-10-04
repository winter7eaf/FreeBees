import { IRateRecord, NewRateRecord } from './rate-record.model';

export const sampleWithRequiredData: IRateRecord = {
  id: 13711,
  rateValue: 1,
};

export const sampleWithPartialData: IRateRecord = {
  id: 30901,
  rateValue: 1,
};

export const sampleWithFullData: IRateRecord = {
  id: 85766,
  rateValue: 2,
};

export const sampleWithNewData: NewRateRecord = {
  rateValue: 1,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
