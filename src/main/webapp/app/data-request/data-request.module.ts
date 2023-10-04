import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { DATA_REQUEST_ROUTE } from './data-request.route';
import { DataRequestComponent } from './data-request.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([DATA_REQUEST_ROUTE])],
  declarations: [DataRequestComponent],
})
export class DataRequestModule {}
