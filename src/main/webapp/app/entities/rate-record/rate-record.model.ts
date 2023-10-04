import { IUser } from 'app/entities/user/user.model';
import { IHandoff } from 'app/entities/handoff/handoff.model';

export interface IRateRecord {
  id: number;
  rateValue?: number | null;
  rater?: Pick<IUser, 'id' | 'login'> | null;
  ratee?: Pick<IUser, 'id' | 'login'> | null;
  handoffRef?: Pick<IHandoff, 'id'> | null;
}

export type NewRateRecord = Omit<IRateRecord, 'id'> & { id: null };
