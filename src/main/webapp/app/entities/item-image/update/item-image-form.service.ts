import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IItemImage, NewItemImage } from '../item-image.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IItemImage for edit and NewItemImageFormGroupInput for create.
 */
type ItemImageFormGroupInput = IItemImage | PartialWithRequiredKeyOf<NewItemImage>;

type ItemImageFormDefaults = Pick<NewItemImage, 'id'>;

type ItemImageFormGroupContent = {
  id: FormControl<IItemImage['id'] | NewItemImage['id']>;
  image: FormControl<IItemImage['image']>;
  imageContentType: FormControl<IItemImage['imageContentType']>;
  item: FormControl<IItemImage['item']>;
};

export type ItemImageFormGroup = FormGroup<ItemImageFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ItemImageFormService {
  createItemImageFormGroup(itemImage: ItemImageFormGroupInput = { id: null }): ItemImageFormGroup {
    const itemImageRawValue = {
      ...this.getFormDefaults(),
      ...itemImage,
    };
    return new FormGroup<ItemImageFormGroupContent>({
      id: new FormControl(
        { value: itemImageRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      image: new FormControl(itemImageRawValue.image, {
        validators: [Validators.required],
      }),
      imageContentType: new FormControl(itemImageRawValue.imageContentType),
      item: new FormControl(itemImageRawValue.item, {
        validators: [Validators.required],
      }),
    });
  }

  getItemImage(form: ItemImageFormGroup): IItemImage | NewItemImage {
    return form.getRawValue() as IItemImage | NewItemImage;
  }

  resetForm(form: ItemImageFormGroup, itemImage: ItemImageFormGroupInput): void {
    const itemImageRawValue = { ...this.getFormDefaults(), ...itemImage };
    form.reset(
      {
        ...itemImageRawValue,
        id: { value: itemImageRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ItemImageFormDefaults {
    return {
      id: null,
    };
  }
}
