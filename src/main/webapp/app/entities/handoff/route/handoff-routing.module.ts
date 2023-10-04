import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { HandoffComponent } from '../list/handoff.component';
import { HandoffDetailComponent } from '../detail/handoff-detail.component';
import { HandoffUpdateComponent } from '../update/handoff-update.component';
import { HandoffRoutingResolveService } from './handoff-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const handoffRoute: Routes = [
  {
    path: '',
    component: HandoffComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: HandoffDetailComponent,
    resolve: {
      handoff: HandoffRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: HandoffUpdateComponent,
    resolve: {
      handoff: HandoffRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: HandoffUpdateComponent,
    resolve: {
      handoff: HandoffRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(handoffRoute)],
  exports: [RouterModule],
})
export class HandoffRoutingModule {}
