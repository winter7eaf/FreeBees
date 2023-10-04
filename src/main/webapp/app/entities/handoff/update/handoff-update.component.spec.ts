import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { HandoffFormService } from './handoff-form.service';
import { HandoffService } from '../service/handoff.service';
import { IHandoff } from '../handoff.model';
import { IRateRecord } from 'app/entities/rate-record/rate-record.model';
import { RateRecordService } from 'app/entities/rate-record/service/rate-record.service';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IItem } from 'app/entities/item/item.model';
import { ItemService } from 'app/entities/item/service/item.service';

import { HandoffUpdateComponent } from './handoff-update.component';

describe('Handoff Management Update Component', () => {
  let comp: HandoffUpdateComponent;
  let fixture: ComponentFixture<HandoffUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let handoffFormService: HandoffFormService;
  let handoffService: HandoffService;
  let rateRecordService: RateRecordService;
  let userService: UserService;
  let itemService: ItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [HandoffUpdateComponent],
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
      .overrideTemplate(HandoffUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(HandoffUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    handoffFormService = TestBed.inject(HandoffFormService);
    handoffService = TestBed.inject(HandoffService);
    rateRecordService = TestBed.inject(RateRecordService);
    userService = TestBed.inject(UserService);
    itemService = TestBed.inject(ItemService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call RateRecord query and add missing value', () => {
      const handoff: IHandoff = { id: 456 };
      const rateToGiver: IRateRecord = { id: 97491 };
      handoff.rateToGiver = rateToGiver;
      const rateToReceiver: IRateRecord = { id: 72861 };
      handoff.rateToReceiver = rateToReceiver;

      const rateRecordCollection: IRateRecord[] = [{ id: 46772 }];
      jest.spyOn(rateRecordService, 'query').mockReturnValue(of(new HttpResponse({ body: rateRecordCollection })));
      const additionalRateRecords = [rateToGiver, rateToReceiver];
      const expectedCollection: IRateRecord[] = [...additionalRateRecords, ...rateRecordCollection];
      jest.spyOn(rateRecordService, 'addRateRecordToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ handoff });
      comp.ngOnInit();

      expect(rateRecordService.query).toHaveBeenCalled();
      expect(rateRecordService.addRateRecordToCollectionIfMissing).toHaveBeenCalledWith(
        rateRecordCollection,
        ...additionalRateRecords.map(expect.objectContaining)
      );
      expect(comp.rateRecordsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call User query and add missing value', () => {
      const handoff: IHandoff = { id: 456 };
      const giver: IUser = { id: 73903 };
      handoff.giver = giver;
      const receiver: IUser = { id: 87896 };
      handoff.receiver = receiver;

      const userCollection: IUser[] = [{ id: 92998 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [giver, receiver];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ handoff });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Item query and add missing value', () => {
      const handoff: IHandoff = { id: 456 };
      const item: IItem = { id: 33925 };
      handoff.item = item;

      const itemCollection: IItem[] = [{ id: 86123 }];
      jest.spyOn(itemService, 'query').mockReturnValue(of(new HttpResponse({ body: itemCollection })));
      const additionalItems = [item];
      const expectedCollection: IItem[] = [...additionalItems, ...itemCollection];
      jest.spyOn(itemService, 'addItemToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ handoff });
      comp.ngOnInit();

      expect(itemService.query).toHaveBeenCalled();
      expect(itemService.addItemToCollectionIfMissing).toHaveBeenCalledWith(
        itemCollection,
        ...additionalItems.map(expect.objectContaining)
      );
      expect(comp.itemsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const handoff: IHandoff = { id: 456 };
      const rateToGiver: IRateRecord = { id: 74552 };
      handoff.rateToGiver = rateToGiver;
      const rateToReceiver: IRateRecord = { id: 23295 };
      handoff.rateToReceiver = rateToReceiver;
      const giver: IUser = { id: 24688 };
      handoff.giver = giver;
      const receiver: IUser = { id: 41338 };
      handoff.receiver = receiver;
      const item: IItem = { id: 79410 };
      handoff.item = item;

      activatedRoute.data = of({ handoff });
      comp.ngOnInit();

      expect(comp.rateRecordsSharedCollection).toContain(rateToGiver);
      expect(comp.rateRecordsSharedCollection).toContain(rateToReceiver);
      expect(comp.usersSharedCollection).toContain(giver);
      expect(comp.usersSharedCollection).toContain(receiver);
      expect(comp.itemsSharedCollection).toContain(item);
      expect(comp.handoff).toEqual(handoff);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IHandoff>>();
      const handoff = { id: 123 };
      jest.spyOn(handoffFormService, 'getHandoff').mockReturnValue(handoff);
      jest.spyOn(handoffService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ handoff });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: handoff }));
      saveSubject.complete();

      // THEN
      expect(handoffFormService.getHandoff).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(handoffService.update).toHaveBeenCalledWith(expect.objectContaining(handoff));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IHandoff>>();
      const handoff = { id: 123 };
      jest.spyOn(handoffFormService, 'getHandoff').mockReturnValue({ id: null });
      jest.spyOn(handoffService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ handoff: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: handoff }));
      saveSubject.complete();

      // THEN
      expect(handoffFormService.getHandoff).toHaveBeenCalled();
      expect(handoffService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IHandoff>>();
      const handoff = { id: 123 };
      jest.spyOn(handoffService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ handoff });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(handoffService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareRateRecord', () => {
      it('Should forward to rateRecordService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(rateRecordService, 'compareRateRecord');
        comp.compareRateRecord(entity, entity2);
        expect(rateRecordService.compareRateRecord).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareUser', () => {
      it('Should forward to userService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(userService, 'compareUser');
        comp.compareUser(entity, entity2);
        expect(userService.compareUser).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareItem', () => {
      it('Should forward to itemService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(itemService, 'compareItem');
        comp.compareItem(entity, entity2);
        expect(itemService.compareItem).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
