import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IRequest, NewRequest } from '../request.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IRequest for edit and NewRequestFormGroupInput for create.
 */
type RequestFormGroupInput = IRequest | PartialWithRequiredKeyOf<NewRequest>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IRequest | NewRequest> = Omit<T, 'sentTime' | 'expiryTime' | 'responseTime'> & {
  sentTime?: string | null;
  expiryTime?: string | null;
  responseTime?: string | null;
};

type RequestFormRawValue = FormValueOf<IRequest>;

type NewRequestFormRawValue = FormValueOf<NewRequest>;

type RequestFormDefaults = Pick<NewRequest, 'id' | 'sentTime' | 'expiryTime' | 'responseTime'>;

type RequestFormGroupContent = {
  id: FormControl<RequestFormRawValue['id'] | NewRequest['id']>;
  type: FormControl<RequestFormRawValue['type']>;
  state: FormControl<RequestFormRawValue['state']>;
  sentTime: FormControl<RequestFormRawValue['sentTime']>;
  expiryTime: FormControl<RequestFormRawValue['expiryTime']>;
  responseTime: FormControl<RequestFormRawValue['responseTime']>;
  requester: FormControl<RequestFormRawValue['requester']>;
  requestee: FormControl<RequestFormRawValue['requestee']>;
  item: FormControl<RequestFormRawValue['item']>;
};

export type RequestFormGroup = FormGroup<RequestFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class RequestFormService {
  createRequestFormGroup(request: RequestFormGroupInput = { id: null }): RequestFormGroup {
    const requestRawValue = this.convertRequestToRequestRawValue({
      ...this.getFormDefaults(),
      ...request,
    });
    return new FormGroup<RequestFormGroupContent>({
      id: new FormControl(
        { value: requestRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      type: new FormControl(requestRawValue.type, {
        validators: [Validators.required],
      }),
      state: new FormControl(requestRawValue.state, {
        validators: [Validators.required],
      }),
      sentTime: new FormControl(requestRawValue.sentTime, {
        validators: [Validators.required],
      }),
      expiryTime: new FormControl(requestRawValue.expiryTime, {
        validators: [Validators.required],
      }),
      responseTime: new FormControl(requestRawValue.responseTime),
      requester: new FormControl(requestRawValue.requester, {
        validators: [Validators.required],
      }),
      requestee: new FormControl(requestRawValue.requestee, {
        validators: [Validators.required],
      }),
      item: new FormControl(requestRawValue.item, {
        validators: [Validators.required],
      }),
    });
  }

  getRequest(form: RequestFormGroup): IRequest | NewRequest {
    return this.convertRequestRawValueToRequest(form.getRawValue() as RequestFormRawValue | NewRequestFormRawValue);
  }

  resetForm(form: RequestFormGroup, request: RequestFormGroupInput): void {
    const requestRawValue = this.convertRequestToRequestRawValue({ ...this.getFormDefaults(), ...request });
    form.reset(
      {
        ...requestRawValue,
        id: { value: requestRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): RequestFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      sentTime: currentTime,
      expiryTime: currentTime,
      responseTime: currentTime,
    };
  }

  private convertRequestRawValueToRequest(rawRequest: RequestFormRawValue | NewRequestFormRawValue): IRequest | NewRequest {
    return {
      ...rawRequest,
      sentTime: dayjs(rawRequest.sentTime, DATE_TIME_FORMAT),
      expiryTime: dayjs(rawRequest.expiryTime, DATE_TIME_FORMAT),
      responseTime: dayjs(rawRequest.responseTime, DATE_TIME_FORMAT),
    };
  }

  private convertRequestToRequestRawValue(
    request: IRequest | (Partial<NewRequest> & RequestFormDefaults)
  ): RequestFormRawValue | PartialWithRequiredKeyOf<NewRequestFormRawValue> {
    return {
      ...request,
      sentTime: request.sentTime ? request.sentTime.format(DATE_TIME_FORMAT) : undefined,
      expiryTime: request.expiryTime ? request.expiryTime.format(DATE_TIME_FORMAT) : undefined,
      responseTime: request.responseTime ? request.responseTime.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
