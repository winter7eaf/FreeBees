import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { COOKIES_ROUTE } from './cookies.component.route';
import { CookiesComponent } from './cookies.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([COOKIES_ROUTE])],
  declarations: [CookiesComponent],
})
export class CookiesModule {}
