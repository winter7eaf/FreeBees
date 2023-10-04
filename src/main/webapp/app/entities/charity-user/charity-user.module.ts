import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CharityUserComponent } from './list/charity-user.component';
import { CharityUserDetailComponent } from './detail/charity-user-detail.component';
import { CharityUserUpdateComponent } from './update/charity-user-update.component';
import { CharityUserDeleteDialogComponent } from './delete/charity-user-delete-dialog.component';
import { CharityUserRoutingModule } from './route/charity-user-routing.module';

@NgModule({
  imports: [SharedModule, CharityUserRoutingModule],
  declarations: [CharityUserComponent, CharityUserDetailComponent, CharityUserUpdateComponent, CharityUserDeleteDialogComponent],
})
export class CharityUserModule {}
