import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ItemImageFormService } from './item-image-form.service';
import { ItemImageService } from '../service/item-image.service';
import { IItemImage } from '../item-image.model';
import { IItem } from 'app/entities/item/item.model';
import { ItemService } from 'app/entities/item/service/item.service';

import { ItemImageUpdateComponent } from './item-image-update.component';

describe('ItemImage Management Update Component', () => {
  let comp: ItemImageUpdateComponent;
  let fixture: ComponentFixture<ItemImageUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let itemImageFormService: ItemImageFormService;
  let itemImageService: ItemImageService;
  let itemService: ItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ItemImageUpdateComponent],
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
      .overrideTemplate(ItemImageUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ItemImageUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    itemImageFormService = TestBed.inject(ItemImageFormService);
    itemImageService = TestBed.inject(ItemImageService);
    itemService = TestBed.inject(ItemService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Item query and add missing value', () => {
      const itemImage: IItemImage = { id: 456 };
      const item: IItem = { id: 42893 };
      itemImage.item = item;

      const itemCollection: IItem[] = [{ id: 22693 }];
      jest.spyOn(itemService, 'query').mockReturnValue(of(new HttpResponse({ body: itemCollection })));
      const additionalItems = [item];
      const expectedCollection: IItem[] = [...additionalItems, ...itemCollection];
      jest.spyOn(itemService, 'addItemToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ itemImage });
      comp.ngOnInit();

      expect(itemService.query).toHaveBeenCalled();
      expect(itemService.addItemToCollectionIfMissing).toHaveBeenCalledWith(
        itemCollection,
        ...additionalItems.map(expect.objectContaining)
      );
      expect(comp.itemsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const itemImage: IItemImage = { id: 456 };
      const item: IItem = { id: 27665 };
      itemImage.item = item;

      activatedRoute.data = of({ itemImage });
      comp.ngOnInit();

      expect(comp.itemsSharedCollection).toContain(item);
      expect(comp.itemImage).toEqual(itemImage);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IItemImage>>();
      const itemImage = { id: 123 };
      jest.spyOn(itemImageFormService, 'getItemImage').mockReturnValue(itemImage);
      jest.spyOn(itemImageService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ itemImage });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: itemImage }));
      saveSubject.complete();

      // THEN
      expect(itemImageFormService.getItemImage).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(itemImageService.update).toHaveBeenCalledWith(expect.objectContaining(itemImage));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IItemImage>>();
      const itemImage = { id: 123 };
      jest.spyOn(itemImageFormService, 'getItemImage').mockReturnValue({ id: null });
      jest.spyOn(itemImageService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ itemImage: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: itemImage }));
      saveSubject.complete();

      // THEN
      expect(itemImageFormService.getItemImage).toHaveBeenCalled();
      expect(itemImageService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IItemImage>>();
      const itemImage = { id: 123 };
      jest.spyOn(itemImageService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ itemImage });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(itemImageService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
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
