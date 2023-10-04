import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { RateRecordFormService, RateRecordFormGroup } from './rate-record-form.service';
import { IRateRecord } from '../rate-record.model';
import { RateRecordService } from '../service/rate-record.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IHandoff } from 'app/entities/handoff/handoff.model';
import { HandoffService } from 'app/entities/handoff/service/handoff.service';

@Component({
  selector: 'jhi-rate-record-update',
  templateUrl: './rate-record-update.component.html',
})
export class RateRecordUpdateComponent implements OnInit {
  isSaving = false;
  rateRecord: IRateRecord | null = null;

  usersSharedCollection: IUser[] = [];
  handoffsSharedCollection: IHandoff[] = [];

  editForm: RateRecordFormGroup = this.rateRecordFormService.createRateRecordFormGroup();

  constructor(
    protected rateRecordService: RateRecordService,
    protected rateRecordFormService: RateRecordFormService,
    protected userService: UserService,
    protected handoffService: HandoffService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  compareHandoff = (o1: IHandoff | null, o2: IHandoff | null): boolean => this.handoffService.compareHandoff(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ rateRecord }) => {
      this.rateRecord = rateRecord;
      if (rateRecord) {
        this.updateForm(rateRecord);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const rateRecord = this.rateRecordFormService.getRateRecord(this.editForm);
    if (rateRecord.id !== null) {
      this.subscribeToSaveResponse(this.rateRecordService.update(rateRecord));
    } else {
      this.subscribeToSaveResponse(this.rateRecordService.create(rateRecord));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRateRecord>>): void {
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

  protected updateForm(rateRecord: IRateRecord): void {
    this.rateRecord = rateRecord;
    this.rateRecordFormService.resetForm(this.editForm, rateRecord);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(
      this.usersSharedCollection,
      rateRecord.rater,
      rateRecord.ratee
    );
    this.handoffsSharedCollection = this.handoffService.addHandoffToCollectionIfMissing<IHandoff>(
      this.handoffsSharedCollection,
      rateRecord.handoffRef
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(
        map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.rateRecord?.rater, this.rateRecord?.ratee))
      )
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.handoffService
      .query()
      .pipe(map((res: HttpResponse<IHandoff[]>) => res.body ?? []))
      .pipe(
        map((handoffs: IHandoff[]) => this.handoffService.addHandoffToCollectionIfMissing<IHandoff>(handoffs, this.rateRecord?.handoffRef))
      )
      .subscribe((handoffs: IHandoff[]) => (this.handoffsSharedCollection = handoffs));
  }
}
