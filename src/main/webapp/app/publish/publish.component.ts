import { Component, ElementRef, OnInit } from '@angular/core';
import { IItem } from '../entities/item/item.model';
import { ItemCondition } from '../entities/enumerations/item-condition.model';
import { ItemState } from '../entities/enumerations/item-state.model';
import { IUser } from '../entities/user/user.model';
import { ItemFormGroup, ItemFormService } from '../entities/item/update/item-form.service';
import { DataUtils, FileLoadError } from '../core/util/data-util.service';
import { EventManager, EventWithContent } from '../core/util/event-manager.service';
import { ItemService } from '../entities/item/service/item.service';
import { UserService } from '../entities/user/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertError } from '../shared/alert/alert-error.model';
import { Observable, Subject } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { finalize, map, takeUntil } from 'rxjs/operators';
import { TagService } from '../entities/tag/service/tag.service';
import { ITag } from '../entities/tag/tag.model';
import dayjs from 'dayjs/esm';
import { Account } from '../core/auth/account.model';
import { AccountService } from '../core/auth/account.service';
import { IUserProfile } from '../entities/user-profile/user-profile.model';
import { UserProfileService } from '../entities/user-profile/service/user-profile.service';

@Component({
  selector: 'jhi-publish',
  templateUrl: './publish.component.html',
  styleUrls: ['./publish.component.scss'],
  // encapsulation: ViewEncapsulation.None
})
export class PublishComponent implements OnInit {
  isSaving = false;
  item: IItem | null = null;
  itemConditionValues = Object.keys(ItemCondition);
  itemStateValues = Object.keys(ItemState);

  usersSharedCollection: IUser[] = [];
  tagsSharedCollection: ITag[] = [];

  dropDownSettings = {};

  userProfiles?: IUserProfile[];

  userPostcode: any;

  editForm: ItemFormGroup = this.itemFormService.createItemFormGroup();

  private readonly destroy$ = new Subject<void>();
  account: Account | null = null;

  title: string | undefined;

  constructor(
    private accountService: AccountService,
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected itemService: ItemService,
    protected itemFormService: ItemFormService,
    protected userService: UserService,
    protected tagService: TagService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected userProfileService: UserProfileService
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  compareTag = (o1: ITag | null, o2: ITag | null): boolean => this.tagService.compareTag(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ item }) => {
      this.item = item;
      if (item) {
        this.updateForm(item);
      }

      this.loadRelationshipsOptions();
    });

    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => (this.account = account));

    this.dropDownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      enableCheckAll: false,
      limitSelection: 3,
      allowSearchFilter: true,
    };

    // this.loadUsers();
  }

  // loadUsers(): void {
  //   this.userProfileService.query().subscribe({
  //     next: (res: HttpResponse<IUserProfile[]>) => {
  //       this.userProfiles = res.body ?? [];
  //       this.getUserProfilesDetails(res.body ?? []);
  //     },
  //   });
  // }
  //
  // getUserProfilesDetails(userProfiles: IUserProfile[]): void {
  //   this.userPostcode = userProfiles.map(userProfile => userProfile.postcode);
  // }

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

  clearInputImage(field: string, fieldContentType: string, idInput: string): void {
    this.editForm.patchValue({
      [field]: null,
      [fieldContentType]: null,
    });
    if (idInput && this.elementRef.nativeElement.querySelector('#' + idInput)) {
      this.elementRef.nativeElement.querySelector('#' + idInput).value = null;
    }
  }

  previousState(potentialItem: any): void {
    if (confirm('Are you sure you want to delete publishing ' + potentialItem + '\nYou will lose all the details you entered.')) {
      window.history.back();
    }
  }

  save(): void {
    this.isSaving = true;
    const item = this.itemFormService.getItem(this.editForm);
    if (item.id !== null) {
      this.subscribeToSaveResponse(this.itemService.update(item));
    } else {
      item.uploadTime = dayjs(new Date());
      item.givenTime = null;
      item.state = ItemState.AVAILABLE;
      item.giver = this.account;
      this.subscribeToSaveResponse(this.itemService.create(item));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IItem>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.router.navigate(['/my-items']);
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(item: IItem): void {
    this.item = item;
    this.itemFormService.resetForm(this.editForm, item);

    this.tagsSharedCollection = this.tagService.addTagToCollectionIfMissing<ITag>(this.tagsSharedCollection, ...(item.tags ?? []));
  }

  protected loadRelationshipsOptions(): void {
    this.tagService
      .query()
      .pipe(map((res: HttpResponse<ITag[]>) => res.body ?? []))
      .pipe(map((tags: ITag[]) => this.tagService.addTagToCollectionIfMissing<ITag>(tags, ...(this.item?.tags ?? []))))
      .subscribe((tags: ITag[]) => (this.tagsSharedCollection = tags));
  }
}
