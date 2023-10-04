import dayjs from 'dayjs/esm';
import { IRateRecord } from 'app/entities/rate-record/rate-record.model';
import { IUser } from 'app/entities/user/user.model';
import { IItem } from 'app/entities/item/item.model';
import { HandoffState } from 'app/entities/enumerations/handoff-state.model';

export interface IHandoff {
  id: number;
  state?: HandoffState | null;
  startTime?: dayjs.Dayjs | null;
  endTime?: dayjs.Dayjs | null;
  rateToGiver?: Pick<IRateRecord, 'id'> | null;
  rateToReceiver?: Pick<IRateRecord, 'id'> | null;
  giver?: Pick<IUser, 'id' | 'login'> | null;
  receiver?: Pick<IUser, 'id' | 'login'> | null;
  item?: Pick<IItem, 'id'> | null;
}

export type NewHandoff = Omit<IHandoff, 'id'> & { id: null };
