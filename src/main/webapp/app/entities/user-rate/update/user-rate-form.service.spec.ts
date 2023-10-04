import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../user-rate.test-samples';

import { UserRateFormService } from './user-rate-form.service';

describe('UserRate Form Service', () => {
  let service: UserRateFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserRateFormService);
  });

  describe('Service methods', () => {
    describe('createUserRateFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createUserRateFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            rateAsGiver: expect.any(Object),
            rateAsReceiver: expect.any(Object),
            user: expect.any(Object),
          })
        );
      });

      it('passing IUserRate should create a new form with FormGroup', () => {
        const formGroup = service.createUserRateFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            rateAsGiver: expect.any(Object),
            rateAsReceiver: expect.any(Object),
            user: expect.any(Object),
          })
        );
      });
    });

    describe('getUserRate', () => {
      it('should return NewUserRate for default UserRate initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createUserRateFormGroup(sampleWithNewData);

        const userRate = service.getUserRate(formGroup) as any;

        expect(userRate).toMatchObject(sampleWithNewData);
      });

      it('should return NewUserRate for empty UserRate initial value', () => {
        const formGroup = service.createUserRateFormGroup();

        const userRate = service.getUserRate(formGroup) as any;

        expect(userRate).toMatchObject({});
      });

      it('should return IUserRate', () => {
        const formGroup = service.createUserRateFormGroup(sampleWithRequiredData);

        const userRate = service.getUserRate(formGroup) as any;

        expect(userRate).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IUserRate should not enable id FormControl', () => {
        const formGroup = service.createUserRateFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewUserRate should disable id FormControl', () => {
        const formGroup = service.createUserRateFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
