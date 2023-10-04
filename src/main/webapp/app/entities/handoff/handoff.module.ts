import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { HandoffComponent } from './list/handoff.component';
import { HandoffDetailComponent } from './detail/handoff-detail.component';
import { HandoffUpdateComponent } from './update/handoff-update.component';
import { HandoffDeleteDialogComponent } from './delete/handoff-delete-dialog.component';
import { HandoffRoutingModule } from './route/handoff-routing.module';

@NgModule({
  imports: [SharedModule, HandoffRoutingModule],
  declarations: [HandoffComponent, HandoffDetailComponent, HandoffUpdateComponent, HandoffDeleteDialogComponent],
})
export class HandoffModule {}
