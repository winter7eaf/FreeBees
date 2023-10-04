import { Route } from '@angular/router';
import { UserRouteAccessService } from '../core/auth/user-route-access.service';
import { PublishComponent } from './publish.component';

export const PUBLISH_ROUTE: Route = {
  path: '',
  component: PublishComponent,
  data: {
    pageTitle: 'publish.title',
  },
  canActivate: [UserRouteAccessService],
};
