import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { UserRateComponent } from './list/user-rate.component';
import { UserRateDetailComponent } from './detail/user-rate-detail.component';
import { UserRateUpdateComponent } from './update/user-rate-update.component';
import { UserRateDeleteDialogComponent } from './delete/user-rate-delete-dialog.component';
import { UserRateRoutingModule } from './route/user-rate-routing.module';

@NgModule({
  imports: [SharedModule, UserRateRoutingModule],
  declarations: [UserRateComponent, UserRateDetailComponent, UserRateUpdateComponent, UserRateDeleteDialogComponent],
})
export class UserRateModule {}
