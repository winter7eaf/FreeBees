import { Route } from '@angular/router';

import { SearchComponent } from './search.component';
import { UserRouteAccessService } from '../core/auth/user-route-access.service';
import { ASC } from '../config/navigation.constants';

export const SEARCH_ROUTE: Route = {
  path: '',
  component: SearchComponent,
  data: {
    pageTitle: 'search.title',
    defaultSort: 'id' + ASC,
  },
  canActivate: [UserRouteAccessService],
};
