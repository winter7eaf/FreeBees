import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ItemImageComponent } from '../list/item-image.component';
import { ItemImageDetailComponent } from '../detail/item-image-detail.component';
import { ItemImageUpdateComponent } from '../update/item-image-update.component';
import { ItemImageRoutingResolveService } from './item-image-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const itemImageRoute: Routes = [
  {
    path: '',
    component: ItemImageComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ItemImageDetailComponent,
    resolve: {
      itemImage: ItemImageRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ItemImageUpdateComponent,
    resolve: {
      itemImage: ItemImageRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ItemImageUpdateComponent,
    resolve: {
      itemImage: ItemImageRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(itemImageRoute)],
  exports: [RouterModule],
})
export class ItemImageRoutingModule {}
