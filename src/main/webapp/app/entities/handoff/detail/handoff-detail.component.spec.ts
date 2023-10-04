import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { HandoffDetailComponent } from './handoff-detail.component';

describe('Handoff Management Detail Component', () => {
  let comp: HandoffDetailComponent;
  let fixture: ComponentFixture<HandoffDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HandoffDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ handoff: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(HandoffDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(HandoffDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load handoff on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.handoff).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
