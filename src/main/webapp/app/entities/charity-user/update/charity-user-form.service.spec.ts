import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../charity-user.test-samples';

import { CharityUserFormService } from './charity-user-form.service';

describe('CharityUser Form Service', () => {
  let service: CharityUserFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CharityUserFormService);
  });

  describe('Service methods', () => {
    describe('createCharityUserFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCharityUserFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            charityName: expect.any(Object),
            description: expect.any(Object),
            logoURL: expect.any(Object),
            website: expect.any(Object),
            user: expect.any(Object),
          })
        );
      });

      it('passing ICharityUser should create a new form with FormGroup', () => {
        const formGroup = service.createCharityUserFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            charityName: expect.any(Object),
            description: expect.any(Object),
            logoURL: expect.any(Object),
            website: expect.any(Object),
            user: expect.any(Object),
          })
        );
      });
    });

    describe('getCharityUser', () => {
      it('should return NewCharityUser for default CharityUser initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createCharityUserFormGroup(sampleWithNewData);

        const charityUser = service.getCharityUser(formGroup) as any;

        expect(charityUser).toMatchObject(sampleWithNewData);
      });

      it('should return NewCharityUser for empty CharityUser initial value', () => {
        const formGroup = service.createCharityUserFormGroup();

        const charityUser = service.getCharityUser(formGroup) as any;

        expect(charityUser).toMatchObject({});
      });

      it('should return ICharityUser', () => {
        const formGroup = service.createCharityUserFormGroup(sampleWithRequiredData);

        const charityUser = service.getCharityUser(formGroup) as any;

        expect(charityUser).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICharityUser should not enable id FormControl', () => {
        const formGroup = service.createCharityUserFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCharityUser should disable id FormControl', () => {
        const formGroup = service.createCharityUserFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
