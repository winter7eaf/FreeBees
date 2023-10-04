import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../item-image.test-samples';

import { ItemImageFormService } from './item-image-form.service';

describe('ItemImage Form Service', () => {
  let service: ItemImageFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemImageFormService);
  });

  describe('Service methods', () => {
    describe('createItemImageFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createItemImageFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            image: expect.any(Object),
            item: expect.any(Object),
          })
        );
      });

      it('passing IItemImage should create a new form with FormGroup', () => {
        const formGroup = service.createItemImageFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            image: expect.any(Object),
            item: expect.any(Object),
          })
        );
      });
    });

    describe('getItemImage', () => {
      it('should return NewItemImage for default ItemImage initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createItemImageFormGroup(sampleWithNewData);

        const itemImage = service.getItemImage(formGroup) as any;

        expect(itemImage).toMatchObject(sampleWithNewData);
      });

      it('should return NewItemImage for empty ItemImage initial value', () => {
        const formGroup = service.createItemImageFormGroup();

        const itemImage = service.getItemImage(formGroup) as any;

        expect(itemImage).toMatchObject({});
      });

      it('should return IItemImage', () => {
        const formGroup = service.createItemImageFormGroup(sampleWithRequiredData);

        const itemImage = service.getItemImage(formGroup) as any;

        expect(itemImage).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IItemImage should not enable id FormControl', () => {
        const formGroup = service.createItemImageFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewItemImage should disable id FormControl', () => {
        const formGroup = service.createItemImageFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
