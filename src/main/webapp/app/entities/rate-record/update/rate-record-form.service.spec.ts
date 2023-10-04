import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../rate-record.test-samples';

import { RateRecordFormService } from './rate-record-form.service';

describe('RateRecord Form Service', () => {
  let service: RateRecordFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RateRecordFormService);
  });

  describe('Service methods', () => {
    describe('createRateRecordFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createRateRecordFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            rateValue: expect.any(Object),
            rater: expect.any(Object),
            ratee: expect.any(Object),
            handoffRef: expect.any(Object),
          })
        );
      });

      it('passing IRateRecord should create a new form with FormGroup', () => {
        const formGroup = service.createRateRecordFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            rateValue: expect.any(Object),
            rater: expect.any(Object),
            ratee: expect.any(Object),
            handoffRef: expect.any(Object),
          })
        );
      });
    });

    describe('getRateRecord', () => {
      it('should return NewRateRecord for default RateRecord initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createRateRecordFormGroup(sampleWithNewData);

        const rateRecord = service.getRateRecord(formGroup) as any;

        expect(rateRecord).toMatchObject(sampleWithNewData);
      });

      it('should return NewRateRecord for empty RateRecord initial value', () => {
        const formGroup = service.createRateRecordFormGroup();

        const rateRecord = service.getRateRecord(formGroup) as any;

        expect(rateRecord).toMatchObject({});
      });

      it('should return IRateRecord', () => {
        const formGroup = service.createRateRecordFormGroup(sampleWithRequiredData);

        const rateRecord = service.getRateRecord(formGroup) as any;

        expect(rateRecord).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IRateRecord should not enable id FormControl', () => {
        const formGroup = service.createRateRecordFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewRateRecord should disable id FormControl', () => {
        const formGroup = service.createRateRecordFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
