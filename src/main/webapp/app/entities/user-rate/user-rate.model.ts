import { IUser } from 'app/entities/user/user.model';

export interface IUserRate {
  id: number;
  rateAsGiver?: number | null;
  rateAsReceiver?: number | null;
  user?: Pick<IUser, 'id' | 'login'> | null;
}

export type NewUserRate = Omit<IUserRate, 'id'> & { id: null };
