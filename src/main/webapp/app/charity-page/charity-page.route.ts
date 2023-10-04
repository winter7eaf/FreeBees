import { Route } from '@angular/router';
import { CharityPageComponent } from './charity-page.component';

export const CHARITY_ROUTE: Route = {
  path: '',
  component: CharityPageComponent,
  data: {
    pageTitle: 'charity-page.title',
  },
};
