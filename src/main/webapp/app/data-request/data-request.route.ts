import { Route } from '@angular/router';

import { DataRequestComponent } from './data-request.component';

export const DATA_REQUEST_ROUTE: Route = {
  path: '',
  component: DataRequestComponent,
  data: {
    pageTitle: 'data-request.title',
  },
};
