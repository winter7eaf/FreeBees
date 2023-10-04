import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ItemImageComponent } from './list/item-image.component';
import { ItemImageDetailComponent } from './detail/item-image-detail.component';
import { ItemImageUpdateComponent } from './update/item-image-update.component';
import { ItemImageDeleteDialogComponent } from './delete/item-image-delete-dialog.component';
import { ItemImageRoutingModule } from './route/item-image-routing.module';

@NgModule({
  imports: [SharedModule, ItemImageRoutingModule],
  declarations: [ItemImageComponent, ItemImageDetailComponent, ItemImageUpdateComponent, ItemImageDeleteDialogComponent],
})
export class ItemImageModule {}
