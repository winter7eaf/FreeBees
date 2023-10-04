import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { MY_ITEMS_ROUTE } from './my-items.route';
import { MyItemsComponent } from './my-items.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([MY_ITEMS_ROUTE])],
  declarations: [MyItemsComponent],
})
export class MyItemsModule {}
