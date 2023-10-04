import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ItemImageService } from '../service/item-image.service';

import { ItemImageComponent } from './item-image.component';

describe('ItemImage Management Component', () => {
  let comp: ItemImageComponent;
  let fixture: ComponentFixture<ItemImageComponent>;
  let service: ItemImageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'item-image', component: ItemImageComponent }]), HttpClientTestingModule],
      declarations: [ItemImageComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(ItemImageComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ItemImageComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ItemImageService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.itemImages?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to itemImageService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getItemImageIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getItemImageIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
