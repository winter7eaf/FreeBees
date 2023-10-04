import { IItem } from 'app/entities/item/item.model';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';

export interface ITag {
  id: number;
  name?: string | null;
  items?: Pick<IItem, 'id'>[] | null;
  users?: Pick<IUserProfile, 'id'>[] | null;
}

export type NewTag = Omit<ITag, 'id'> & { id: null };
