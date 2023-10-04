import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { CharityUserService } from '../service/charity-user.service';

import { CharityUserComponent } from './charity-user.component';

describe('CharityUser Management Component', () => {
  let comp: CharityUserComponent;
  let fixture: ComponentFixture<CharityUserComponent>;
  let service: CharityUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'charity-user', component: CharityUserComponent }]), HttpClientTestingModule],
      declarations: [CharityUserComponent],
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
      .overrideTemplate(CharityUserComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CharityUserComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(CharityUserService);

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
    expect(comp.charityUsers?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to charityUserService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getCharityUserIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getCharityUserIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
