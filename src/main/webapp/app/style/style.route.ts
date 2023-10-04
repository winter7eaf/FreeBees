import { Route } from '@angular/router';

import { StyleComponent } from './style.component';

export const STYLE_ROUTE: Route = {
  path: '',
  component: StyleComponent,
  data: {
    pageTitle: 'style.title',
  },
};
