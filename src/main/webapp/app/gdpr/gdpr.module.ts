import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { GDPR_ROUTE } from './gdpr.route';
import { GdprComponent } from './gdpr.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([GDPR_ROUTE])],
  declarations: [GdprComponent],
})
export class GdprModule {}
