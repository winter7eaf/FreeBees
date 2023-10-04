import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { errorRoute } from './layouts/error/error.route';
import { navbarRoute } from './layouts/navbar/navbar.route';
import { DEBUG_INFO_ENABLED } from 'app/app.constants';
import { Authority } from 'app/config/authority.constants';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PublishComponent } from './publish/publish.component';

@NgModule({
  imports: [
    RouterModule.forRoot(
      [
        {
          path: 'admin',
          data: {
            authorities: [Authority.ADMIN],
          },
          canActivate: [UserRouteAccessService],
          loadChildren: () => import('./admin/admin-routing.module').then(m => m.AdminRoutingModule),
        },
        {
          path: 'account',
          loadChildren: () => import('./account/account.module').then(m => m.AccountModule),
        },
        {
          path: 'login',
          loadChildren: () => import('./login/login.module').then(m => m.LoginModule),
        },
        // I have strongly feeling that this is not the best way to do this, will check again later.
        {
          path: 'gdpr',
          loadChildren: () => import('./gdpr/gdpr.module').then(m => m.GdprModule),
        },
        {
          path: 'search',
          data: {
            authorities: [Authority.ADMIN, Authority.USER],
          },
          canActivate: [UserRouteAccessService],
          loadChildren: () => import('./search/search.module').then(m => m.SearchModule),
        },
        {
          path: 'cookies',
          loadChildren: () => import('./cookies/cookies.module').then(m => m.CookiesModule),
        },
        {
          path: 'publish',
          data: {
            authorities: [Authority.ADMIN, Authority.USER],
          },
          canActivate: [UserRouteAccessService],
          loadChildren: () => import('./publish/publish.module').then(m => m.PublishModule),
        },
        {
          path: 'data-request',
          loadChildren: () => import('./data-request/data-request.module').then(m => m.DataRequestModule),
        },
        {
          path: 'charity',
          loadChildren: () => import('./charity-page/charity-page.module').then(m => m.CharityModule),
        },
        {
          path: 'my-items',
          loadChildren: () => import('./my-items/my-items.module').then(m => m.MyItemsModule),
        },
        {
          path: 'style',
          loadChildren: () => import('./style/style.module').then(m => m.StyleModule),
        },

        // Below are the protected routes for the entities and the home. That means you cannot go to '/' before being signed in.
        // This is a weird fix though, because here we can 2 modules pointing to the same path (don't know if that's best practice)
        // And it seems like the UserRouteAccessService, even if removed for the EntityRoutingModule path, still doesn't allow access to unauthenticated users.
        // For now it works, but might need a better fix in the future.
        {
          path: '',
          data: {
            authorities: [Authority.USER, Authority.ADMIN, Authority.CHARITY],
          },
          canActivate: [UserRouteAccessService],
          loadChildren: () => import(`./home/home.module`).then(m => m.HomeModule),
        },
        {
          path: '',
          loadChildren: () => import(`./entities/entity-routing.module`).then(m => m.EntityRoutingModule),
        },
        navbarRoute,
        ...errorRoute,
      ],
      { enableTracing: DEBUG_INFO_ENABLED }
    ),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
