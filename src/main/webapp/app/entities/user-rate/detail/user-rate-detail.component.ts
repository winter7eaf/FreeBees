import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IUserRate } from '../user-rate.model';

@Component({
  selector: 'jhi-user-rate-detail',
  templateUrl: './user-rate-detail.component.html',
})
export class UserRateDetailComponent implements OnInit {
  userRate: IUserRate | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userRate }) => {
      this.userRate = userRate;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
