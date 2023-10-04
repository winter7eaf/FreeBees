import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { UserRateDetailComponent } from './user-rate-detail.component';

describe('UserRate Management Detail Component', () => {
  let comp: UserRateDetailComponent;
  let fixture: ComponentFixture<UserRateDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserRateDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ userRate: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(UserRateDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(UserRateDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load userRate on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.userRate).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
