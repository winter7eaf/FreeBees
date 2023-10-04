import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { RateRecordService } from '../service/rate-record.service';

import { RateRecordComponent } from './rate-record.component';

describe('RateRecord Management Component', () => {
  let comp: RateRecordComponent;
  let fixture: ComponentFixture<RateRecordComponent>;
  let service: RateRecordService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'rate-record', component: RateRecordComponent }]), HttpClientTestingModule],
      declarations: [RateRecordComponent],
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
      .overrideTemplate(RateRecordComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(RateRecordComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(RateRecordService);

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
    expect(comp.rateRecords?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to rateRecordService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getRateRecordIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getRateRecordIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
