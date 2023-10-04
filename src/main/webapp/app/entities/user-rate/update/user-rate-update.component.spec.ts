import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { UserRateFormService } from './user-rate-form.service';
import { UserRateService } from '../service/user-rate.service';
import { IUserRate } from '../user-rate.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { UserRateUpdateComponent } from './user-rate-update.component';

describe('UserRate Management Update Component', () => {
  let comp: UserRateUpdateComponent;
  let fixture: ComponentFixture<UserRateUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let userRateFormService: UserRateFormService;
  let userRateService: UserRateService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [UserRateUpdateComponent],
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
      .overrideTemplate(UserRateUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UserRateUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    userRateFormService = TestBed.inject(UserRateFormService);
    userRateService = TestBed.inject(UserRateService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const userRate: IUserRate = { id: 456 };
      const user: IUser = { id: 64499 };
      userRate.user = user;

      const userCollection: IUser[] = [{ id: 11862 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ userRate });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const userRate: IUserRate = { id: 456 };
      const user: IUser = { id: 31709 };
      userRate.user = user;

      activatedRoute.data = of({ userRate });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.userRate).toEqual(userRate);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserRate>>();
      const userRate = { id: 123 };
      jest.spyOn(userRateFormService, 'getUserRate').mockReturnValue(userRate);
      jest.spyOn(userRateService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userRate });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: userRate }));
      saveSubject.complete();

      // THEN
      expect(userRateFormService.getUserRate).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(userRateService.update).toHaveBeenCalledWith(expect.objectContaining(userRate));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserRate>>();
      const userRate = { id: 123 };
      jest.spyOn(userRateFormService, 'getUserRate').mockReturnValue({ id: null });
      jest.spyOn(userRateService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userRate: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: userRate }));
      saveSubject.complete();

      // THEN
      expect(userRateFormService.getUserRate).toHaveBeenCalled();
      expect(userRateService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserRate>>();
      const userRate = { id: 123 };
      jest.spyOn(userRateService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userRate });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(userRateService.update).toHaveBeenCalled();
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
  });
});
