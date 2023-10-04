import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { CharityUserFormService, CharityUserFormGroup } from './charity-user-form.service';
import { ICharityUser } from '../charity-user.model';
import { CharityUserService } from '../service/charity-user.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-charity-user-update',
  templateUrl: './charity-user-update.component.html',
})
export class CharityUserUpdateComponent implements OnInit {
  isSaving = false;
  charityUser: ICharityUser | null = null;

  usersSharedCollection: IUser[] = [];

  editForm: CharityUserFormGroup = this.charityUserFormService.createCharityUserFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected charityUserService: CharityUserService,
    protected charityUserFormService: CharityUserFormService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ charityUser }) => {
      this.charityUser = charityUser;
      if (charityUser) {
        this.updateForm(charityUser);
      }

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('teamprojectApp.error', { ...err, key: 'error.file.' + err.key })),
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const charityUser = this.charityUserFormService.getCharityUser(this.editForm);
    if (charityUser.id !== null) {
      this.subscribeToSaveResponse(this.charityUserService.update(charityUser));
    } else {
      this.subscribeToSaveResponse(this.charityUserService.create(charityUser));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICharityUser>>): void {
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

  protected updateForm(charityUser: ICharityUser): void {
    this.charityUser = charityUser;
    this.charityUserFormService.resetForm(this.editForm, charityUser);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, charityUser.user);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.charityUser?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }
}
