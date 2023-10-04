import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IHandoff } from '../handoff.model';

@Component({
  selector: 'jhi-handoff-detail',
  templateUrl: './handoff-detail.component.html',
})
export class HandoffDetailComponent implements OnInit {
  handoff: IHandoff | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ handoff }) => {
      this.handoff = handoff;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
