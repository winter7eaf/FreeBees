import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { UserRateFormService, UserRateFormGroup } from './user-rate-form.service';
import { IUserRate } from '../user-rate.model';
import { UserRateService } from '../service/user-rate.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-user-rate-update',
  templateUrl: './user-rate-update.component.html',
})
export class UserRateUpdateComponent implements OnInit {
  isSaving = false;
  userRate: IUserRate | null = null;

  usersSharedCollection: IUser[] = [];

  editForm: UserRateFormGroup = this.userRateFormService.createUserRateFormGroup();

  constructor(
    protected userRateService: UserRateService,
    protected userRateFormService: UserRateFormService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userRate }) => {
      this.userRate = userRate;
      if (userRate) {
        this.updateForm(userRate);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const userRate = this.userRateFormService.getUserRate(this.editForm);
    if (userRate.id !== null) {
      this.subscribeToSaveResponse(this.userRateService.update(userRate));
    } else {
      this.subscribeToSaveResponse(this.userRateService.create(userRate));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUserRate>>): void {
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

  protected updateForm(userRate: IUserRate): void {
    this.userRate = userRate;
    this.userRateFormService.resetForm(this.editForm, userRate);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, userRate.user);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.userRate?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }
}
