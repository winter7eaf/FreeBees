import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { RateRecordDetailComponent } from './rate-record-detail.component';

describe('RateRecord Management Detail Component', () => {
  let comp: RateRecordDetailComponent;
  let fixture: ComponentFixture<RateRecordDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RateRecordDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ rateRecord: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(RateRecordDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(RateRecordDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load rateRecord on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.rateRecord).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
