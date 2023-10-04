import { NgModule } from '@angular/core';
import { PublishComponent } from './publish.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { PUBLISH_ROUTE } from './publish.route';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  declarations: [PublishComponent],
  imports: [SharedModule, RouterModule.forChild([PUBLISH_ROUTE]), NgMultiSelectDropDownModule.forRoot()],
})
export class PublishModule {}
