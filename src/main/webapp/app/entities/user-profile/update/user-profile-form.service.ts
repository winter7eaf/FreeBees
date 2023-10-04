import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IUserProfile, NewUserProfile } from '../user-profile.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IUserProfile for edit and NewUserProfileFormGroupInput for create.
 */
type UserProfileFormGroupInput = IUserProfile | PartialWithRequiredKeyOf<NewUserProfile>;

type UserProfileFormDefaults = Pick<NewUserProfile, 'id' | 'lookingfors'>;

type UserProfileFormGroupContent = {
  id: FormControl<IUserProfile['id'] | NewUserProfile['id']>;
  description: FormControl<IUserProfile['description']>;
  postcode: FormControl<IUserProfile['postcode']>;
  user: FormControl<IUserProfile['user']>;
  lookingfors: FormControl<IUserProfile['lookingfors']>;
};

export type UserProfileFormGroup = FormGroup<UserProfileFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class UserProfileFormService {
  createUserProfileFormGroup(userProfile: UserProfileFormGroupInput = { id: null }): UserProfileFormGroup {
    const userProfileRawValue = {
      ...this.getFormDefaults(),
      ...userProfile,
    };
    return new FormGroup<UserProfileFormGroupContent>({
      id: new FormControl(
        { value: userProfileRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      description: new FormControl(userProfileRawValue.description),
      postcode: new FormControl(userProfileRawValue.postcode, {
        validators: [
          Validators.minLength(3),
          Validators.maxLength(12),
          Validators.pattern('^(GIR 0AA|[A-PR-UWYZ][A-HK-Y]?[0-9][ABEHMNPRVWXY0-9]? {0,1}[0-9][ABD-HJLNP-UW-Z]{2})$'),
        ],
      }),
      user: new FormControl(userProfileRawValue.user, {
        validators: [Validators.required],
      }),
      lookingfors: new FormControl(userProfileRawValue.lookingfors ?? []),
    });
  }

  getUserProfile(form: UserProfileFormGroup): IUserProfile | NewUserProfile {
    return form.getRawValue() as IUserProfile | NewUserProfile;
  }

  resetForm(form: UserProfileFormGroup, userProfile: UserProfileFormGroupInput): void {
    const userProfileRawValue = { ...this.getFormDefaults(), ...userProfile };
    form.reset(
      {
        ...userProfileRawValue,
        id: { value: userProfileRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): UserProfileFormDefaults {
    return {
      id: null,
      lookingfors: [],
    };
  }
}
