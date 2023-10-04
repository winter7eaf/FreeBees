import { Route } from '@angular/router';

import { CookiesComponent } from './cookies.component';

export const COOKIES_ROUTE: Route = {
  path: '',
  component: CookiesComponent,
  data: {
    pageTitle: 'cookies.title',
  },
};
