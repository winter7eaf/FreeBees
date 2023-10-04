import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { UserRateComponent } from '../list/user-rate.component';
import { UserRateDetailComponent } from '../detail/user-rate-detail.component';
import { UserRateUpdateComponent } from '../update/user-rate-update.component';
import { UserRateRoutingResolveService } from './user-rate-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const userRateRoute: Routes = [
  {
    path: '',
    component: UserRateComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: UserRateDetailComponent,
    resolve: {
      userRate: UserRateRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: UserRateUpdateComponent,
    resolve: {
      userRate: UserRateRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: UserRateUpdateComponent,
    resolve: {
      userRate: UserRateRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(userRateRoute)],
  exports: [RouterModule],
})
export class UserRateRoutingModule {}
