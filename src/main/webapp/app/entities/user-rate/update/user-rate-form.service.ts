import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IUserRate, NewUserRate } from '../user-rate.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IUserRate for edit and NewUserRateFormGroupInput for create.
 */
type UserRateFormGroupInput = IUserRate | PartialWithRequiredKeyOf<NewUserRate>;

type UserRateFormDefaults = Pick<NewUserRate, 'id'>;

type UserRateFormGroupContent = {
  id: FormControl<IUserRate['id'] | NewUserRate['id']>;
  rateAsGiver: FormControl<IUserRate['rateAsGiver']>;
  rateAsReceiver: FormControl<IUserRate['rateAsReceiver']>;
  user: FormControl<IUserRate['user']>;
};

export type UserRateFormGroup = FormGroup<UserRateFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class UserRateFormService {
  createUserRateFormGroup(userRate: UserRateFormGroupInput = { id: null }): UserRateFormGroup {
    const userRateRawValue = {
      ...this.getFormDefaults(),
      ...userRate,
    };
    return new FormGroup<UserRateFormGroupContent>({
      id: new FormControl(
        { value: userRateRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      rateAsGiver: new FormControl(userRateRawValue.rateAsGiver, {
        validators: [Validators.required, Validators.min(0), Validators.max(10)],
      }),
      rateAsReceiver: new FormControl(userRateRawValue.rateAsReceiver, {
        validators: [Validators.required, Validators.min(0), Validators.max(10)],
      }),
      user: new FormControl(userRateRawValue.user, {
        validators: [Validators.required],
      }),
    });
  }

  getUserRate(form: UserRateFormGroup): IUserRate | NewUserRate {
    return form.getRawValue() as IUserRate | NewUserRate;
  }

  resetForm(form: UserRateFormGroup, userRate: UserRateFormGroupInput): void {
    const userRateRawValue = { ...this.getFormDefaults(), ...userRate };
    form.reset(
      {
        ...userRateRawValue,
        id: { value: userRateRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): UserRateFormDefaults {
    return {
      id: null,
    };
  }
}
