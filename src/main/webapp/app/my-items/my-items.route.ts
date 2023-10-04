import { Route } from '@angular/router';

import { MyItemsComponent } from './my-items.component';

import { ASC } from 'app/config/navigation.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

export const MY_ITEMS_ROUTE: Route = {
  path: '',
  component: MyItemsComponent,
  data: {
    pageTitle: 'my-items.title',
    defaultSort: 'id,' + ASC,
  },
  canActivate: [UserRouteAccessService],
};
