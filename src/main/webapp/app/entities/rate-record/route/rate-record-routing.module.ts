import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { RateRecordComponent } from '../list/rate-record.component';
import { RateRecordDetailComponent } from '../detail/rate-record-detail.component';
import { RateRecordUpdateComponent } from '../update/rate-record-update.component';
import { RateRecordRoutingResolveService } from './rate-record-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const rateRecordRoute: Routes = [
  {
    path: '',
    component: RateRecordComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: RateRecordDetailComponent,
    resolve: {
      rateRecord: RateRecordRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: RateRecordUpdateComponent,
    resolve: {
      rateRecord: RateRecordRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: RateRecordUpdateComponent,
    resolve: {
      rateRecord: RateRecordRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(rateRecordRoute)],
  exports: [RouterModule],
})
export class RateRecordRoutingModule {}
