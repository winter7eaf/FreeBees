import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { UserRateService } from '../service/user-rate.service';

import { UserRateComponent } from './user-rate.component';

describe('UserRate Management Component', () => {
  let comp: UserRateComponent;
  let fixture: ComponentFixture<UserRateComponent>;
  let service: UserRateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'user-rate', component: UserRateComponent }]), HttpClientTestingModule],
      declarations: [UserRateComponent],
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
      .overrideTemplate(UserRateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UserRateComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(UserRateService);

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
    expect(comp.userRates?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to userRateService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getUserRateIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getUserRateIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
