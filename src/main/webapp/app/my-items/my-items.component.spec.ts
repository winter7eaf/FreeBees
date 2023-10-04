import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ItemService } from '../entities/item/service/item.service';

import { MyItemsComponent } from './my-items.component';

describe('Item Management Component', () => {
  let comp: MyItemsComponent;
  let fixture: ComponentFixture<MyItemsComponent>;
  let service: ItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'my-items', component: MyItemsComponent }]), HttpClientTestingModule],
      declarations: [MyItemsComponent],
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
      .overrideTemplate(MyItemsComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MyItemsComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ItemService);

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
    expect(comp.items?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to itemService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getItemIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getItemIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
