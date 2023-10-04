import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { SEARCH_ROUTE } from './search.route';
import { SearchComponent } from './search.component';
import { FormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([SEARCH_ROUTE]), FormsModule, NgMultiSelectDropDownModule.forRoot()],
  declarations: [SearchComponent],
})
export class SearchModule {}
