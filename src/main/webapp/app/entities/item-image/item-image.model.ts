import { IItem } from 'app/entities/item/item.model';

export interface IItemImage {
  id: number;
  image?: string | null;
  imageContentType?: string | null;
  item?: Pick<IItem, 'id'> | null;
}

export type NewItemImage = Omit<IItemImage, 'id'> & { id: null };
