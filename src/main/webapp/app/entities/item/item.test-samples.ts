import dayjs from 'dayjs/esm';

import { ItemCondition } from 'app/entities/enumerations/item-condition.model';
import { ItemState } from 'app/entities/enumerations/item-state.model';

import { IItem, NewItem } from './item.model';

export const sampleWithRequiredData: IItem = {
  id: 89800,
  title: 'Bedfordshire input',
  description: '../fake-data/blob/hipster.txt',
  condition: ItemCondition['USED_LIKE_NEW'],
  image: '../fake-data/blob/hipster.png',
  imageContentType: 'unknown',
  postcode: 'GIR 0AA',
  uploadTime: dayjs('2023-03-10T00:24'),
  state: ItemState['GIVEN'],
};

export const sampleWithPartialData: IItem = {
  id: 98428,
  title: 'Account technologies Checking',
  description: '../fake-data/blob/hipster.txt',
  condition: ItemCondition['USED_LIKE_NEW'],
  image: '../fake-data/blob/hipster.png',
  imageContentType: 'unknown',
  postcode: 'W28BZ',
  uploadTime: dayjs('2023-03-10T03:31'),
  givenTime: dayjs('2023-03-09T23:12'),
  state: ItemState['AVAILABLE'],
};

export const sampleWithFullData: IItem = {
  id: 39656,
  title: 'Island exploit',
  description: '../fake-data/blob/hipster.txt',
  condition: ItemCondition['USED_ACCEPTABLE'],
  image: '../fake-data/blob/hipster.png',
  imageContentType: 'unknown',
  postcode: 'I57LR',
  uploadTime: dayjs('2023-03-09T16:45'),
  givenTime: dayjs('2023-03-09T23:00'),
  state: ItemState['LOCKED'],
};

export const sampleWithNewData: NewItem = {
  title: 'payment',
  description: '../fake-data/blob/hipster.txt',
  condition: ItemCondition['USED_ACCEPTABLE'],
  image: '../fake-data/blob/hipster.png',
  imageContentType: 'unknown',
  postcode: 'GIR 0AA',
  uploadTime: dayjs('2023-03-10T01:27'),
  state: ItemState['CANCELLED'],
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
