import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { RateRecordFormService } from './rate-record-form.service';
import { RateRecordService } from '../service/rate-record.service';
import { IRateRecord } from '../rate-record.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IHandoff } from 'app/entities/handoff/handoff.model';
import { HandoffService } from 'app/entities/handoff/service/handoff.service';

import { RateRecordUpdateComponent } from './rate-record-update.component';

describe('RateRecord Management Update Component', () => {
  let comp: RateRecordUpdateComponent;
  let fixture: ComponentFixture<RateRecordUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let rateRecordFormService: RateRecordFormService;
  let rateRecordService: RateRecordService;
  let userService: UserService;
  let handoffService: HandoffService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [RateRecordUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(RateRecordUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(RateRecordUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    rateRecordFormService = TestBed.inject(RateRecordFormService);
    rateRecordService = TestBed.inject(RateRecordService);
    userService = TestBed.inject(UserService);
    handoffService = TestBed.inject(HandoffService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const rateRecord: IRateRecord = { id: 456 };
      const rater: IUser = { id: 1690 };
      rateRecord.rater = rater;
      const ratee: IUser = { id: 76651 };
      rateRecord.ratee = ratee;

      const userCollection: IUser[] = [{ id: 65453 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [rater, ratee];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ rateRecord });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Handoff query and add missing value', () => {
      const rateRecord: IRateRecord = { id: 456 };
      const handoffRef: IHandoff = { id: 80501 };
      rateRecord.handoffRef = handoffRef;

      const handoffCollection: IHandoff[] = [{ id: 61938 }];
      jest.spyOn(handoffService, 'query').mockReturnValue(of(new HttpResponse({ body: handoffCollection })));
      const additionalHandoffs = [handoffRef];
      const expectedCollection: IHandoff[] = [...additionalHandoffs, ...handoffCollection];
      jest.spyOn(handoffService, 'addHandoffToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ rateRecord });
      comp.ngOnInit();

      expect(handoffService.query).toHaveBeenCalled();
      expect(handoffService.addHandoffToCollectionIfMissing).toHaveBeenCalledWith(
        handoffCollection,
        ...additionalHandoffs.map(expect.objectContaining)
      );
      expect(comp.handoffsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const rateRecord: IRateRecord = { id: 456 };
      const rater: IUser = { id: 27865 };
      rateRecord.rater = rater;
      const ratee: IUser = { id: 34993 };
      rateRecord.ratee = ratee;
      const handoffRef: IHandoff = { id: 38334 };
      rateRecord.handoffRef = handoffRef;

      activatedRoute.data = of({ rateRecord });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(rater);
      expect(comp.usersSharedCollection).toContain(ratee);
      expect(comp.handoffsSharedCollection).toContain(handoffRef);
      expect(comp.rateRecord).toEqual(rateRecord);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRateRecord>>();
      const rateRecord = { id: 123 };
      jest.spyOn(rateRecordFormService, 'getRateRecord').mockReturnValue(rateRecord);
      jest.spyOn(rateRecordService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ rateRecord });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: rateRecord }));
      saveSubject.complete();

      // THEN
      expect(rateRecordFormService.getRateRecord).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(rateRecordService.update).toHaveBeenCalledWith(expect.objectContaining(rateRecord));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRateRecord>>();
      const rateRecord = { id: 123 };
      jest.spyOn(rateRecordFormService, 'getRateRecord').mockReturnValue({ id: null });
      jest.spyOn(rateRecordService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ rateRecord: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: rateRecord }));
      saveSubject.complete();

      // THEN
      expect(rateRecordFormService.getRateRecord).toHaveBeenCalled();
      expect(rateRecordService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRateRecord>>();
      const rateRecord = { id: 123 };
      jest.spyOn(rateRecordService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ rateRecord });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(rateRecordService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareUser', () => {
      it('Should forward to userService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(userService, 'compareUser');
        comp.compareUser(entity, entity2);
        expect(userService.compareUser).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareHandoff', () => {
      it('Should forward to handoffService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(handoffService, 'compareHandoff');
        comp.compareHandoff(entity, entity2);
        expect(handoffService.compareHandoff).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
