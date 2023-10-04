import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CharityUserComponent } from '../list/charity-user.component';
import { CharityUserDetailComponent } from '../detail/charity-user-detail.component';
import { CharityUserUpdateComponent } from '../update/charity-user-update.component';
import { CharityUserRoutingResolveService } from './charity-user-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const charityUserRoute: Routes = [
  {
    path: '',
    component: CharityUserComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CharityUserDetailComponent,
    resolve: {
      charityUser: CharityUserRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CharityUserUpdateComponent,
    resolve: {
      charityUser: CharityUserRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CharityUserUpdateComponent,
    resolve: {
      charityUser: CharityUserRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(charityUserRoute)],
  exports: [RouterModule],
})
export class CharityUserRoutingModule {}
