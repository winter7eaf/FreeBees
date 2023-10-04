import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { RequestDetailComponent } from './request-detail.component';

describe('Request Management Detail Component', () => {
  let comp: RequestDetailComponent;
  let fixture: ComponentFixture<RequestDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RequestDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ request: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(RequestDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(RequestDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load request on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.request).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
