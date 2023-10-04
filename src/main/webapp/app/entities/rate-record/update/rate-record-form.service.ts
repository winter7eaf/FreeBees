import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IRateRecord, NewRateRecord } from '../rate-record.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IRateRecord for edit and NewRateRecordFormGroupInput for create.
 */
type RateRecordFormGroupInput = IRateRecord | PartialWithRequiredKeyOf<NewRateRecord>;

type RateRecordFormDefaults = Pick<NewRateRecord, 'id'>;

type RateRecordFormGroupContent = {
  id: FormControl<IRateRecord['id'] | NewRateRecord['id']>;
  rateValue: FormControl<IRateRecord['rateValue']>;
  rater: FormControl<IRateRecord['rater']>;
  ratee: FormControl<IRateRecord['ratee']>;
  handoffRef: FormControl<IRateRecord['handoffRef']>;
};

export type RateRecordFormGroup = FormGroup<RateRecordFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class RateRecordFormService {
  createRateRecordFormGroup(rateRecord: RateRecordFormGroupInput = { id: null }): RateRecordFormGroup {
    const rateRecordRawValue = {
      ...this.getFormDefaults(),
      ...rateRecord,
    };
    return new FormGroup<RateRecordFormGroupContent>({
      id: new FormControl(
        { value: rateRecordRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      rateValue: new FormControl(rateRecordRawValue.rateValue, {
        validators: [Validators.required, Validators.min(0), Validators.max(11)],
      }),
      rater: new FormControl(rateRecordRawValue.rater, {
        validators: [Validators.required],
      }),
      ratee: new FormControl(rateRecordRawValue.ratee, {
        validators: [Validators.required],
      }),
      handoffRef: new FormControl(rateRecordRawValue.handoffRef, {
        validators: [Validators.required],
      }),
    });
  }

  getRateRecord(form: RateRecordFormGroup): IRateRecord | NewRateRecord {
    return form.getRawValue() as IRateRecord | NewRateRecord;
  }

  resetForm(form: RateRecordFormGroup, rateRecord: RateRecordFormGroupInput): void {
    const rateRecordRawValue = { ...this.getFormDefaults(), ...rateRecord };
    form.reset(
      {
        ...rateRecordRawValue,
        id: { value: rateRecordRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): RateRecordFormDefaults {
    return {
      id: null,
    };
  }
}
