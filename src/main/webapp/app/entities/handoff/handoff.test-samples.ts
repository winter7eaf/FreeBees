import dayjs from 'dayjs/esm';

import { HandoffState } from 'app/entities/enumerations/handoff-state.model';

import { IHandoff, NewHandoff } from './handoff.model';

export const sampleWithRequiredData: IHandoff = {
  id: 67813,
  state: HandoffState['LOCKED'],
  startTime: dayjs('2023-04-25T10:28'),
};

export const sampleWithPartialData: IHandoff = {
  id: 85093,
  state: HandoffState['CANCELLED'],
  startTime: dayjs('2023-04-25T03:23'),
  endTime: dayjs('2023-04-25T01:40'),
};

export const sampleWithFullData: IHandoff = {
  id: 21109,
  state: HandoffState['COMPLETED'],
  startTime: dayjs('2023-04-25T03:08'),
  endTime: dayjs('2023-04-24T20:05'),
};

export const sampleWithNewData: NewHandoff = {
  state: HandoffState['CANCELLED'],
  startTime: dayjs('2023-04-24T16:14'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
