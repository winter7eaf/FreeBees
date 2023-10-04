import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IHandoff, NewHandoff } from '../handoff.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IHandoff for edit and NewHandoffFormGroupInput for create.
 */
type HandoffFormGroupInput = IHandoff | PartialWithRequiredKeyOf<NewHandoff>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IHandoff | NewHandoff> = Omit<T, 'startTime' | 'endTime'> & {
  startTime?: string | null;
  endTime?: string | null;
};

type HandoffFormRawValue = FormValueOf<IHandoff>;

type NewHandoffFormRawValue = FormValueOf<NewHandoff>;

type HandoffFormDefaults = Pick<NewHandoff, 'id' | 'startTime' | 'endTime'>;

type HandoffFormGroupContent = {
  id: FormControl<HandoffFormRawValue['id'] | NewHandoff['id']>;
  state: FormControl<HandoffFormRawValue['state']>;
  startTime: FormControl<HandoffFormRawValue['startTime']>;
  endTime: FormControl<HandoffFormRawValue['endTime']>;
  rateToGiver: FormControl<HandoffFormRawValue['rateToGiver']>;
  rateToReceiver: FormControl<HandoffFormRawValue['rateToReceiver']>;
  giver: FormControl<HandoffFormRawValue['giver']>;
  receiver: FormControl<HandoffFormRawValue['receiver']>;
  item: FormControl<HandoffFormRawValue['item']>;
};

export type HandoffFormGroup = FormGroup<HandoffFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class HandoffFormService {
  createHandoffFormGroup(handoff: HandoffFormGroupInput = { id: null }): HandoffFormGroup {
    const handoffRawValue = this.convertHandoffToHandoffRawValue({
      ...this.getFormDefaults(),
      ...handoff,
    });
    return new FormGroup<HandoffFormGroupContent>({
      id: new FormControl(
        { value: handoffRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      state: new FormControl(handoffRawValue.state, {
        validators: [Validators.required],
      }),
      startTime: new FormControl(handoffRawValue.startTime, {
        validators: [Validators.required],
      }),
      endTime: new FormControl(handoffRawValue.endTime),
      rateToGiver: new FormControl(handoffRawValue.rateToGiver, {
        validators: [Validators.required],
      }),
      rateToReceiver: new FormControl(handoffRawValue.rateToReceiver, {
        validators: [Validators.required],
      }),
      giver: new FormControl(handoffRawValue.giver, {
        validators: [Validators.required],
      }),
      receiver: new FormControl(handoffRawValue.receiver, {
        validators: [Validators.required],
      }),
      item: new FormControl(handoffRawValue.item, {
        validators: [Validators.required],
      }),
    });
  }

  getHandoff(form: HandoffFormGroup): IHandoff | NewHandoff {
    return this.convertHandoffRawValueToHandoff(form.getRawValue() as HandoffFormRawValue | NewHandoffFormRawValue);
  }

  resetForm(form: HandoffFormGroup, handoff: HandoffFormGroupInput): void {
    const handoffRawValue = this.convertHandoffToHandoffRawValue({ ...this.getFormDefaults(), ...handoff });
    form.reset(
      {
        ...handoffRawValue,
        id: { value: handoffRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): HandoffFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      startTime: currentTime,
      endTime: currentTime,
    };
  }

  private convertHandoffRawValueToHandoff(rawHandoff: HandoffFormRawValue | NewHandoffFormRawValue): IHandoff | NewHandoff {
    return {
      ...rawHandoff,
      startTime: dayjs(rawHandoff.startTime, DATE_TIME_FORMAT),
      endTime: dayjs(rawHandoff.endTime, DATE_TIME_FORMAT),
    };
  }

  private convertHandoffToHandoffRawValue(
    handoff: IHandoff | (Partial<NewHandoff> & HandoffFormDefaults)
  ): HandoffFormRawValue | PartialWithRequiredKeyOf<NewHandoffFormRawValue> {
    return {
      ...handoff,
      startTime: handoff.startTime ? handoff.startTime.format(DATE_TIME_FORMAT) : undefined,
      endTime: handoff.endTime ? handoff.endTime.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
