import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { STYLE_ROUTE } from './style.route';
import { StyleComponent } from './style.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([STYLE_ROUTE])],
  declarations: [StyleComponent],
})
export class StyleModule {}
