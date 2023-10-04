import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IItem, NewItem } from '../item.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IItem for edit and NewItemFormGroupInput for create.
 */
type ItemFormGroupInput = IItem | PartialWithRequiredKeyOf<NewItem>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IItem | NewItem> = Omit<T, 'uploadTime' | 'givenTime'> & {
  uploadTime?: string | null;
  givenTime?: string | null;
};

type ItemFormRawValue = FormValueOf<IItem>;

type NewItemFormRawValue = FormValueOf<NewItem>;

type ItemFormDefaults = Pick<NewItem, 'id' | 'uploadTime' | 'givenTime' | 'tags'>;

type ItemFormGroupContent = {
  id: FormControl<ItemFormRawValue['id'] | NewItem['id']>;
  title: FormControl<ItemFormRawValue['title']>;
  description: FormControl<ItemFormRawValue['description']>;
  condition: FormControl<ItemFormRawValue['condition']>;
  image: FormControl<ItemFormRawValue['image']>;
  imageContentType: FormControl<ItemFormRawValue['imageContentType']>;
  postcode: FormControl<ItemFormRawValue['postcode']>;
  uploadTime: FormControl<ItemFormRawValue['uploadTime']>;
  givenTime: FormControl<ItemFormRawValue['givenTime']>;
  state: FormControl<ItemFormRawValue['state']>;
  giver: FormControl<ItemFormRawValue['giver']>;
  receiver: FormControl<ItemFormRawValue['receiver']>;
  tags: FormControl<ItemFormRawValue['tags']>;
};

export type ItemFormGroup = FormGroup<ItemFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ItemFormService {
  createItemFormGroup(item: ItemFormGroupInput = { id: null }): ItemFormGroup {
    const itemRawValue = this.convertItemToItemRawValue({
      ...this.getFormDefaults(),
      ...item,
    });
    return new FormGroup<ItemFormGroupContent>({
      id: new FormControl(
        { value: itemRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      title: new FormControl(itemRawValue.title, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      description: new FormControl(itemRawValue.description, {
        validators: [Validators.required],
      }),
      condition: new FormControl(itemRawValue.condition, {
        validators: [Validators.required],
      }),
      image: new FormControl(itemRawValue.image, {
        validators: [Validators.required],
      }),
      imageContentType: new FormControl(itemRawValue.imageContentType),
      postcode: new FormControl(itemRawValue.postcode, {
        validators: [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(12),
          Validators.pattern('^(GIR 0AA|[A-PR-UWYZ][A-HK-Y]?[0-9][ABEHMNPRVWXY0-9]? {0,1}[0-9][ABD-HJLNP-UW-Z]{2})$'),
        ],
      }),
      uploadTime: new FormControl(itemRawValue.uploadTime, {
        validators: [Validators.required],
      }),
      givenTime: new FormControl(itemRawValue.givenTime),
      state: new FormControl(itemRawValue.state, {
        validators: [Validators.required],
      }),
      giver: new FormControl(itemRawValue.giver, {
        validators: [Validators.required],
      }),
      receiver: new FormControl(itemRawValue.receiver),
      tags: new FormControl(itemRawValue.tags ?? []),
    });
  }

  getItem(form: ItemFormGroup): IItem | NewItem {
    return this.convertItemRawValueToItem(form.getRawValue() as ItemFormRawValue | NewItemFormRawValue);
  }

  resetForm(form: ItemFormGroup, item: ItemFormGroupInput): void {
    const itemRawValue = this.convertItemToItemRawValue({ ...this.getFormDefaults(), ...item });
    form.reset(
      {
        ...itemRawValue,
        id: { value: itemRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ItemFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      uploadTime: currentTime,
      givenTime: currentTime,
      tags: [],
    };
  }

  private convertItemRawValueToItem(rawItem: ItemFormRawValue | NewItemFormRawValue): IItem | NewItem {
    return {
      ...rawItem,
      uploadTime: dayjs(rawItem.uploadTime, DATE_TIME_FORMAT),
      givenTime: dayjs(rawItem.givenTime, DATE_TIME_FORMAT),
    };
  }

  private convertItemToItemRawValue(
    item: IItem | (Partial<NewItem> & ItemFormDefaults)
  ): ItemFormRawValue | PartialWithRequiredKeyOf<NewItemFormRawValue> {
    return {
      ...item,
      uploadTime: item.uploadTime ? item.uploadTime.format(DATE_TIME_FORMAT) : undefined,
      givenTime: item.givenTime ? item.givenTime.format(DATE_TIME_FORMAT) : undefined,
      tags: item.tags ?? [],
    };
  }
}
