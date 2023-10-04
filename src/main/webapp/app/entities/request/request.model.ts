import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';
import { IItem } from 'app/entities/item/item.model';
import { RequestType } from 'app/entities/enumerations/request-type.model';
import { RequestState } from 'app/entities/enumerations/request-state.model';

export interface IRequest {
  id: number;
  type?: RequestType | null;
  state?: RequestState | null;
  sentTime?: dayjs.Dayjs | null;
  expiryTime?: dayjs.Dayjs | null;
  responseTime?: dayjs.Dayjs | null;
  requester?: Pick<IUser, 'id' | 'login'> | null;
  requestee?: Pick<IUser, 'id' | 'login'> | null;
  item?: Pick<IItem, 'id'> | null;
}

export type NewRequest = Omit<IRequest, 'id'> & { id: null };
