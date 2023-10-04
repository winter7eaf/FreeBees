import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'item',
        data: { pageTitle: 'teamprojectApp.item.home.title' },
        loadChildren: () => import('./item/item.module').then(m => m.ItemModule),
      },
      {
        path: 'tag',
        data: { pageTitle: 'teamprojectApp.tag.home.title' },
        loadChildren: () => import('./tag/tag.module').then(m => m.TagModule),
      },
      {
        path: 'user-profile',
        data: { pageTitle: 'teamprojectApp.userProfile.home.title' },
        loadChildren: () => import('./user-profile/user-profile.module').then(m => m.UserProfileModule),
      },
      {
        path: 'user-rate',
        data: { pageTitle: 'teamprojectApp.userRate.home.title' },
        loadChildren: () => import('./user-rate/user-rate.module').then(m => m.UserRateModule),
      },
      {
        path: 'rate-record',
        data: { pageTitle: 'teamprojectApp.rateRecord.home.title' },
        loadChildren: () => import('./rate-record/rate-record.module').then(m => m.RateRecordModule),
      },
      {
        path: 'item-image',
        data: { pageTitle: 'teamprojectApp.itemImage.home.title' },
        loadChildren: () => import('./item-image/item-image.module').then(m => m.ItemImageModule),
      },
      {
        path: 'request',
        data: { pageTitle: 'teamprojectApp.request.home.title' },
        loadChildren: () => import('./request/request.module').then(m => m.RequestModule),
      },
      {
        path: 'handoff',
        data: { pageTitle: 'teamprojectApp.handoff.home.title' },
        loadChildren: () => import('./handoff/handoff.module').then(m => m.HandoffModule),
      },
      {
        path: 'charity-user',
        data: { pageTitle: 'teamprojectApp.charityUser.home.title' },
        loadChildren: () => import('./charity-user/charity-user.module').then(m => m.CharityUserModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
