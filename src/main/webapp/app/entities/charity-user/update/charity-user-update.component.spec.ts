import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CharityUserFormService } from './charity-user-form.service';
import { CharityUserService } from '../service/charity-user.service';
import { ICharityUser } from '../charity-user.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { CharityUserUpdateComponent } from './charity-user-update.component';

describe('CharityUser Management Update Component', () => {
  let comp: CharityUserUpdateComponent;
  let fixture: ComponentFixture<CharityUserUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let charityUserFormService: CharityUserFormService;
  let charityUserService: CharityUserService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CharityUserUpdateComponent],
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
      .overrideTemplate(CharityUserUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CharityUserUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    charityUserFormService = TestBed.inject(CharityUserFormService);
    charityUserService = TestBed.inject(CharityUserService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const charityUser: ICharityUser = { id: 456 };
      const user: IUser = { id: 58640 };
      charityUser.user = user;

      const userCollection: IUser[] = [{ id: 29066 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ charityUser });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const charityUser: ICharityUser = { id: 456 };
      const user: IUser = { id: 62265 };
      charityUser.user = user;

      activatedRoute.data = of({ charityUser });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.charityUser).toEqual(charityUser);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICharityUser>>();
      const charityUser = { id: 123 };
      jest.spyOn(charityUserFormService, 'getCharityUser').mockReturnValue(charityUser);
      jest.spyOn(charityUserService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ charityUser });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: charityUser }));
      saveSubject.complete();

      // THEN
      expect(charityUserFormService.getCharityUser).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(charityUserService.update).toHaveBeenCalledWith(expect.objectContaining(charityUser));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICharityUser>>();
      const charityUser = { id: 123 };
      jest.spyOn(charityUserFormService, 'getCharityUser').mockReturnValue({ id: null });
      jest.spyOn(charityUserService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ charityUser: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: charityUser }));
      saveSubject.complete();

      // THEN
      expect(charityUserFormService.getCharityUser).toHaveBeenCalled();
      expect(charityUserService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICharityUser>>();
      const charityUser = { id: 123 };
      jest.spyOn(charityUserService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ charityUser });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(charityUserService.update).toHaveBeenCalled();
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
