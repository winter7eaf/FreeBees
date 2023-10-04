import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICharityUser } from '../charity-user.model';
import { CharityUserService } from '../service/charity-user.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './charity-user-delete-dialog.component.html',
})
export class CharityUserDeleteDialogComponent {
  charityUser?: ICharityUser;

  constructor(protected charityUserService: CharityUserService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.charityUserService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
