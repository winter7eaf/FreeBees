import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IRateRecord } from '../rate-record.model';
import { RateRecordService } from '../service/rate-record.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './rate-record-delete-dialog.component.html',
})
export class RateRecordDeleteDialogComponent {
  rateRecord?: IRateRecord;

  constructor(protected rateRecordService: RateRecordService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.rateRecordService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
