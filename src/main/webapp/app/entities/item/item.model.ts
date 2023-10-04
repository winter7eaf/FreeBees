import dayjs from 'dayjs/esm';
import { ITag } from 'app/entities/tag/tag.model';
import { ItemCondition } from 'app/entities/enumerations/item-condition.model';
import { ItemState } from 'app/entities/enumerations/item-state.model';
import { Account } from '../../core/auth/account.model';

export interface IItem {
  id: number;
  title?: string | null;
  description?: string | null;
  condition?: ItemCondition | null;
  image?: string | null;
  imageContentType?: string | null;
  postcode?: string | null;
  uploadTime?: dayjs.Dayjs | null;
  givenTime?: dayjs.Dayjs | null;
  state?: ItemState | null;
  giver?: Account | null;
  receiver?: Account | null;
  tags?: Pick<ITag, 'id' | 'name'>[] | null;
}

export type NewItem = Omit<IItem, 'id'> & { id: null };
