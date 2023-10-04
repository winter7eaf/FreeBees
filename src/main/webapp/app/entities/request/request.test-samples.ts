import dayjs from 'dayjs/esm';

import { RequestType } from 'app/entities/enumerations/request-type.model';
import { RequestState } from 'app/entities/enumerations/request-state.model';

import { IRequest, NewRequest } from './request.model';

export const sampleWithRequiredData: IRequest = {
  id: 88640,
  type: RequestType['REQUEST_TO_GIVE'],
  state: RequestState['ACCEPTED'],
  sentTime: dayjs('2023-04-25T13:22'),
  expiryTime: dayjs('2023-04-24T20:26'),
};

export const sampleWithPartialData: IRequest = {
  id: 37220,
  type: RequestType['REQUEST_TO_RECEIVE'],
  state: RequestState['EXPIRED'],
  sentTime: dayjs('2023-04-24T17:21'),
  expiryTime: dayjs('2023-04-24T18:58'),
};

export const sampleWithFullData: IRequest = {
  id: 81527,
  type: RequestType['REQUEST_TO_RECEIVE'],
  state: RequestState['EXPIRED'],
  sentTime: dayjs('2023-04-25T10:47'),
  expiryTime: dayjs('2023-04-25T06:30'),
  responseTime: dayjs('2023-04-25T12:48'),
};

export const sampleWithNewData: NewRequest = {
  type: RequestType['REQUEST_TO_GIVE'],
  state: RequestState['REJECTED'],
  sentTime: dayjs('2023-04-25T08:38'),
  expiryTime: dayjs('2023-04-24T15:43'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
