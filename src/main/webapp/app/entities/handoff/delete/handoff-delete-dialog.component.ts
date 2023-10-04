import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IHandoff } from '../handoff.model';
import { HandoffService } from '../service/handoff.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './handoff-delete-dialog.component.html',
})
export class HandoffDeleteDialogComponent {
  handoff?: IHandoff;

  constructor(protected handoffService: HandoffService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.handoffService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
