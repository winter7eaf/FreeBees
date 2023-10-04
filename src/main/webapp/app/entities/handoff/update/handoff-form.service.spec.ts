import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../handoff.test-samples';

import { HandoffFormService } from './handoff-form.service';

describe('Handoff Form Service', () => {
  let service: HandoffFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HandoffFormService);
  });

  describe('Service methods', () => {
    describe('createHandoffFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createHandoffFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            state: expect.any(Object),
            startTime: expect.any(Object),
            endTime: expect.any(Object),
            rateToGiver: expect.any(Object),
            rateToReceiver: expect.any(Object),
            giver: expect.any(Object),
            receiver: expect.any(Object),
            item: expect.any(Object),
          })
        );
      });

      it('passing IHandoff should create a new form with FormGroup', () => {
        const formGroup = service.createHandoffFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            state: expect.any(Object),
            startTime: expect.any(Object),
            endTime: expect.any(Object),
            rateToGiver: expect.any(Object),
            rateToReceiver: expect.any(Object),
            giver: expect.any(Object),
            receiver: expect.any(Object),
            item: expect.any(Object),
          })
        );
      });
    });

    describe('getHandoff', () => {
      it('should return NewHandoff for default Handoff initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createHandoffFormGroup(sampleWithNewData);

        const handoff = service.getHandoff(formGroup) as any;

        expect(handoff).toMatchObject(sampleWithNewData);
      });

      it('should return NewHandoff for empty Handoff initial value', () => {
        const formGroup = service.createHandoffFormGroup();

        const handoff = service.getHandoff(formGroup) as any;

        expect(handoff).toMatchObject({});
      });

      it('should return IHandoff', () => {
        const formGroup = service.createHandoffFormGroup(sampleWithRequiredData);

        const handoff = service.getHandoff(formGroup) as any;

        expect(handoff).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IHandoff should not enable id FormControl', () => {
        const formGroup = service.createHandoffFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewHandoff should disable id FormControl', () => {
        const formGroup = service.createHandoffFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
