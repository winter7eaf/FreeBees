import { IUser } from 'app/entities/user/user.model';

export interface ICharityUser {
  id: number;
  charityName?: string | null;
  description?: string | null;
  logoURL?: string | null;
  website?: string | null;
  user?: Pick<IUser, 'id'> | null;
}

export type NewCharityUser = Omit<ICharityUser, 'id'> & { id: null };
