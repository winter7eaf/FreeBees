import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { RateRecordComponent } from './list/rate-record.component';
import { RateRecordDetailComponent } from './detail/rate-record-detail.component';
import { RateRecordUpdateComponent } from './update/rate-record-update.component';
import { RateRecordDeleteDialogComponent } from './delete/rate-record-delete-dialog.component';
import { RateRecordRoutingModule } from './route/rate-record-routing.module';

@NgModule({
  imports: [SharedModule, RateRecordRoutingModule],
  declarations: [RateRecordComponent, RateRecordDetailComponent, RateRecordUpdateComponent, RateRecordDeleteDialogComponent],
})
export class RateRecordModule {}
