import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { HandoffFormService, HandoffFormGroup } from './handoff-form.service';
import { IHandoff } from '../handoff.model';
import { HandoffService } from '../service/handoff.service';
import { IRateRecord } from 'app/entities/rate-record/rate-record.model';
import { RateRecordService } from 'app/entities/rate-record/service/rate-record.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IItem } from 'app/entities/item/item.model';
import { ItemService } from 'app/entities/item/service/item.service';
import { HandoffState } from 'app/entities/enumerations/handoff-state.model';

@Component({
  selector: 'jhi-handoff-update',
  templateUrl: './handoff-update.component.html',
})
export class HandoffUpdateComponent implements OnInit {
  isSaving = false;
  handoff: IHandoff | null = null;
  handoffStateValues = Object.keys(HandoffState);

  rateRecordsSharedCollection: IRateRecord[] = [];
  usersSharedCollection: IUser[] = [];
  itemsSharedCollection: IItem[] = [];

  editForm: HandoffFormGroup = this.handoffFormService.createHandoffFormGroup();

  constructor(
    protected handoffService: HandoffService,
    protected handoffFormService: HandoffFormService,
    protected rateRecordService: RateRecordService,
    protected userService: UserService,
    protected itemService: ItemService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareRateRecord = (o1: IRateRecord | null, o2: IRateRecord | null): boolean => this.rateRecordService.compareRateRecord(o1, o2);

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  compareItem = (o1: IItem | null, o2: IItem | null): boolean => this.itemService.compareItem(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ handoff }) => {
      this.handoff = handoff;
      if (handoff) {
        this.updateForm(handoff);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const handoff = this.handoffFormService.getHandoff(this.editForm);
    if (handoff.id !== null) {
      this.subscribeToSaveResponse(this.handoffService.update(handoff));
    } else {
      this.subscribeToSaveResponse(this.handoffService.create(handoff));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IHandoff>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(handoff: IHandoff): void {
    this.handoff = handoff;
    this.handoffFormService.resetForm(this.editForm, handoff);

    this.rateRecordsSharedCollection = this.rateRecordService.addRateRecordToCollectionIfMissing<IRateRecord>(
      this.rateRecordsSharedCollection,
      handoff.rateToGiver,
      handoff.rateToReceiver
    );
    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(
      this.usersSharedCollection,
      handoff.giver,
      handoff.receiver
    );
    this.itemsSharedCollection = this.itemService.addItemToCollectionIfMissing<IItem>(this.itemsSharedCollection, handoff.item);
  }

  protected loadRelationshipsOptions(): void {
    this.rateRecordService
      .query()
      .pipe(map((res: HttpResponse<IRateRecord[]>) => res.body ?? []))
      .pipe(
        map((rateRecords: IRateRecord[]) =>
          this.rateRecordService.addRateRecordToCollectionIfMissing<IRateRecord>(
            rateRecords,
            this.handoff?.rateToGiver,
            this.handoff?.rateToReceiver
          )
        )
      )
      .subscribe((rateRecords: IRateRecord[]) => (this.rateRecordsSharedCollection = rateRecords));

    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(
        map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.handoff?.giver, this.handoff?.receiver))
      )
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.itemService
      .query()
      .pipe(map((res: HttpResponse<IItem[]>) => res.body ?? []))
      .pipe(map((items: IItem[]) => this.itemService.addItemToCollectionIfMissing<IItem>(items, this.handoff?.item)))
      .subscribe((items: IItem[]) => (this.itemsSharedCollection = items));
  }
}
