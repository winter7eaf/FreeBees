import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { RequestComponent } from '../list/request.component';
import { RequestDetailComponent } from '../detail/request-detail.component';
import { RequestUpdateComponent } from '../update/request-update.component';
import { RequestRoutingResolveService } from './request-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const requestRoute: Routes = [
  {
    path: '',
    component: RequestComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: RequestDetailComponent,
    resolve: {
      request: RequestRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: RequestUpdateComponent,
    resolve: {
      request: RequestRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: RequestUpdateComponent,
    resolve: {
      request: RequestRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(requestRoute)],
  exports: [RouterModule],
})
export class RequestRoutingModule {}
