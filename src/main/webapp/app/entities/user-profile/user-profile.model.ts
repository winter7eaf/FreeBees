import { IUser } from 'app/entities/user/user.model';
import { ITag } from 'app/entities/tag/tag.model';

export interface IUserProfile {
  id: number;
  description?: string | null;
  postcode?: string | null;
  user?: Pick<IUser, 'id' | 'login'> | null;
  lookingfors?: Pick<ITag, 'id' | 'name'>[] | null;
}

export type NewUserProfile = Omit<IUserProfile, 'id'> & { id: null };
