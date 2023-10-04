import { Route } from '@angular/router';

import { GdprComponent } from './gdpr.component';

export const GDPR_ROUTE: Route = {
  path: '',
  component: GdprComponent,
  data: {
    pageTitle: 'gdpr.title',
  },
};
