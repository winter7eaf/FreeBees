import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { CHARITY_ROUTE } from './charity-page.route';
import { CharityPageComponent } from './charity-page.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([CHARITY_ROUTE])],
  declarations: [CharityPageComponent],
})
export class CharityModule {}
