import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { HandoffService } from '../service/handoff.service';

import { HandoffComponent } from './handoff.component';

describe('Handoff Management Component', () => {
  let comp: HandoffComponent;
  let fixture: ComponentFixture<HandoffComponent>;
  let service: HandoffService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'handoff', component: HandoffComponent }]), HttpClientTestingModule],
      declarations: [HandoffComponent],
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
      .overrideTemplate(HandoffComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(HandoffComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(HandoffService);

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
    expect(comp.handoffs?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to handoffService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getHandoffIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getHandoffIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
