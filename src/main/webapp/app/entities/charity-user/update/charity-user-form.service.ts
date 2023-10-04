import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ICharityUser, NewCharityUser } from '../charity-user.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICharityUser for edit and NewCharityUserFormGroupInput for create.
 */
type CharityUserFormGroupInput = ICharityUser | PartialWithRequiredKeyOf<NewCharityUser>;

type CharityUserFormDefaults = Pick<NewCharityUser, 'id'>;

type CharityUserFormGroupContent = {
  id: FormControl<ICharityUser['id'] | NewCharityUser['id']>;
  charityName: FormControl<ICharityUser['charityName']>;
  description: FormControl<ICharityUser['description']>;
  logoURL: FormControl<ICharityUser['logoURL']>;
  website: FormControl<ICharityUser['website']>;
  user: FormControl<ICharityUser['user']>;
};

export type CharityUserFormGroup = FormGroup<CharityUserFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CharityUserFormService {
  createCharityUserFormGroup(charityUser: CharityUserFormGroupInput = { id: null }): CharityUserFormGroup {
    const charityUserRawValue = {
      ...this.getFormDefaults(),
      ...charityUser,
    };
    return new FormGroup<CharityUserFormGroupContent>({
      id: new FormControl(
        { value: charityUserRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      charityName: new FormControl(charityUserRawValue.charityName),
      description: new FormControl(charityUserRawValue.description),
      logoURL: new FormControl(charityUserRawValue.logoURL),
      website: new FormControl(charityUserRawValue.website),
      user: new FormControl(charityUserRawValue.user),
    });
  }

  getCharityUser(form: CharityUserFormGroup): ICharityUser | NewCharityUser {
    return form.getRawValue() as ICharityUser | NewCharityUser;
  }

  resetForm(form: CharityUserFormGroup, charityUser: CharityUserFormGroupInput): void {
    const charityUserRawValue = { ...this.getFormDefaults(), ...charityUser };
    form.reset(
      {
        ...charityUserRawValue,
        id: { value: charityUserRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): CharityUserFormDefaults {
    return {
      id: null,
    };
  }
}
