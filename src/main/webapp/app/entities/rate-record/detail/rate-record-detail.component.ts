import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IRateRecord } from '../rate-record.model';

@Component({
  selector: 'jhi-rate-record-detail',
  templateUrl: './rate-record-detail.component.html',
})
export class RateRecordDetailComponent implements OnInit {
  rateRecord: IRateRecord | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ rateRecord }) => {
      this.rateRecord = rateRecord;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
