import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { combineLatest, Observable, Subject, switchMap, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import postcodes from 'node-postcodes.io';
import { IItem } from '../entities/item/item.model';
import { ASC, DEFAULT_SORT_DATA, DESC, SORT } from 'app/config/navigation.constants';
import { EntityArrayResponseType, ItemService } from '../entities/item/service/item.service';
import { DataUtils } from 'app/core/util/data-util.service';
import { SortService } from 'app/shared/sort/sort.service';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ItemCondition } from 'app/entities/enumerations/item-condition.model';
import { ITag } from '../entities/tag/tag.model';
import { TagService } from '../entities/tag/service/tag.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { map, takeUntil } from 'rxjs/operators';
import { AccountService } from '../core/auth/account.service';
import { Account } from '../core/auth/account.model';
import { ItemState } from '../entities/enumerations/item-state.model';
import { UserProfileService } from '../entities/user-profile/service/user-profile.service';
import { IUser } from '../entities/user/user.model';
import { UserService } from '../entities/user/user.service';
import { IUserProfile } from '../entities/user-profile/user-profile.model';

@Component({
  selector: 'jhi-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  items: IItem[] = [];
  filteredItems: IItem[] = [];
  tags: ITag[] = [];
  isLoading = false;
  searchQuery = '';
  filterTags: ITag[] = [];
  filterCondition?: ItemCondition;
  filterPostcode = '';
  predicate = 'id';
  ascending = true;
  itemCondition = Object.keys(ItemCondition);
  itemState = Object.keys(ItemState);
  dropDownSettings: IDropdownSettings = {};
  account: Account | null = null;
  currentUser?: IUser;
  currentProfile?: IUserProfile;
  profiles: IUserProfile[] = [];
  users: IUser[] | null = [];
  currentTags: Pick<ITag, 'id' | 'name'>[] = [];
  postcode: string = '';
  page!: number;
  private readonly destroy$ = new Subject<void>();
  constructor(
    protected itemService: ItemService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected sortService: SortService,
    protected dataUtils: DataUtils,
    protected modalService: NgbModal,
    protected tagService: TagService,
    protected accountService: AccountService,
    protected userService: UserService,
    protected userProfileService: UserProfileService,
    protected http: HttpClient
  ) {}
  ngOnInit(): void {
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => {
        this.account = account;
      });
    this.load();
  }
  searchItems(): void {
    this.filteredItems = this.items.filter(item => {
      return item.title?.toLowerCase().includes(this.searchQuery.toLowerCase());
    });
  }
  findProfileByUser(): void {
    if (this.users !== null && this.users !== undefined) {
      for (let x = 0; x < this.users.length; x++) {
        if (this.users[x].login === this.account?.login) {
          this.currentUser = this.users[x];
        }
      }
    }
    if (this.profiles !== null && this.profiles !== undefined) {
      for (let x = 0; x < this.profiles.length; x++) {
        if (this.profiles[x].user?.id === this.currentUser?.id) {
          this.currentProfile = this.profiles[x];
        }
      }
    }
    if (this.currentProfile && this.currentProfile.lookingfors) {
      this.currentTags = this.currentProfile.lookingfors;
    }
    if (this.currentProfile && this.currentProfile.postcode) {
      this.postcode = this.currentProfile.postcode;
    }
  }

  test = 'no';
  onItemSelect(tag: any) {
    this.filterTags.push(tag);
  }
  onItemUnselect(tag: any) {
    let toBeDel = this.filterTags.indexOf(tag);
    delete this.filterTags[toBeDel];
    if (toBeDel == this.filterTags.length - 1) {
      this.filterTags.pop();
    } else {
      for (let x = toBeDel; x < this.filterTags.length; x++) {
        this.filterTags[x] = this.filterTags[x + 1];
      }
      this.filterTags.pop();
    }
  }
  filterBy(): void {
    this.searchItems();
    this.filteredItems = this.filteredItems.filter(item => {
      if (item.postcode == null) {
        return [];
      } else {
        return item.postcode.includes(this.filterPostcode);
      }
    });
    this.filteredItems = this.filteredItems.filter(item => {
      if (item.condition == null || this.filterCondition == undefined) {
        return [];
      } else {
        return this.equalsCon(item.condition, this.filterCondition);
      }
    });
    //for(let x=0; x<this.filteredItems.length;x++){
    //   if(this.items[x].tags===null)
    //   this.test='fuck you';
    // }
    let newItems: IItem[] = [];
    this.filteredItems.forEach(item => {
      if (item.tags == null) {
        return;
      } else {
        for (let a = 0; a < item.tags.length; a++) {
          for (let b = 0; b < this.filterTags.length; b++) {
            if (item.tags[a].name === this.filterTags[b].name && !this.includesItem(newItems, item)) {
              newItems.push(item);
            }
          }
        }
        return;
      }
    });
    if (this.filterTags.length === 0) newItems = this.filteredItems;
    this.filteredItems = newItems;
    this.closePopup();
    this.filterTags = [];
    this.filterPostcode = '';
    this.filterCondition = undefined;
  }
  equalsCon(itemCondition: ItemCondition, filterCondition: ItemCondition) {
    return itemCondition === filterCondition;
  }
  trackId = (_index: number, item: IItem): number => this.itemService.getItemIdentifier(item);
  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }
  //to make popups for the filters
  displayStyle = 'none';
  openPopup() {
    this.displayStyle = 'block';
  }
  closePopup() {
    this.displayStyle = 'none';
  }
  initialFilter(): void {
    this.items = this.items.filter(item => {
      if (item.state !== null && item.state !== undefined && item.giver !== null && item.giver !== undefined) {
        return item.state !== this.itemState[2] && item.state !== this.itemState[3] && item.giver.login !== this.account?.login;
      } else {
        return [];
      }
    });
  }
  async sortByPostcode(): Promise<void> {
    this.findProfileByUser();
    let nearest = await postcodes.nearest(this.postcode.replace(/\s/g, ''));
    console.log(nearest);
    nearest = nearest.result;
    console.log(nearest);
    let newList = [];
    let secondList = [];
    for (let x = 0; x < nearest.length; x++) {
      for (let y = 0; y < this.filteredItems?.length; y++) {
        if (!this.includesItem(newList, this.filteredItems[y]) && !this.includesItem(secondList, this.filteredItems[y])) {
          if (this.filteredItems[y]?.postcode === nearest[x].postcode) newList.push(this.filteredItems[y]);
          else {
            secondList.push(this.filteredItems[y]);
          }
        }
      }
    }
    this.filteredItems = newList.concat(secondList);
  }
  sortByTags(): void {
    this.findProfileByUser();
    let firstItems: IItem[] = [];
    let secondItems: IItem[] = [];
    console.log(this.currentTags);
    if (this.currentTags.length == 0) {
      this.filteredItems = this.filteredItems;
    } else {
      this.filteredItems.forEach(item => {
        if (item.tags == null) {
          return;
        } else {
          if (!this.includesItem(firstItems, item) && !this.includesItem(secondItems, item)) {
            if (this.includesTag(item.tags, this.currentTags)) firstItems.push(item);
            else secondItems.push(item);
          }
        }
      });
      console.log(this.currentTags);
      console.log(firstItems);
      console.log(secondItems);
      this.filteredItems = firstItems.concat(secondItems);
    }
  }
  sortByTitleLater(): void {
    this.filteredItems.sort((a, b) => {
      if (a.title !== undefined && b.title !== undefined && b.title !== null) {
        const result = a.title?.localeCompare(b.title);
        return result !== undefined ? result : 0;
      } else {
        return 0;
      }
    });
  }
  sortByTitle(): void {
    this.items.sort((a, b) => {
      if (a.title !== undefined && b.title !== undefined && b.title !== null) {
        const result = a.title?.localeCompare(b.title);
        return result !== undefined ? result : 0;
      } else {
        return 0;
      }
    });
  }
  includesTag(tagsI: ITag[], tagsU: ITag[]): boolean {
    for (let x = 0; x < tagsI.length; x++) {
      for (let y = 0; y < tagsU.length; y++) if (tagsI[x].id === tagsU[y].id) return true;
    }
    return false;
  }
  includesItem(items: IItem[], item: IItem): boolean {
    for (let x = 0; x < items.length; x++) {
      if (items[x].id === item.id) return true;
    }
    return false;
  }
  load(): void {
    this.loadFromBackendWithRouteInformations().subscribe({
      next: (res: EntityArrayResponseType) => {
        this.onResponseSuccess(res);
      },
    });
    this.activatedRoute.url.subscribe(() => {
      this.tagService
        .query()
        .pipe(map((res: HttpResponse<ITag[]>) => res.body ?? []))
        .subscribe((tags: ITag[]) => (this.tags = tags));
    });
    this.activatedRoute.url.subscribe(() => {
      this.userService.query().subscribe((res: HttpResponse<IUser[]>) => {
        this.users = res.body ?? [];
      });
    });
    this.activatedRoute.url.subscribe(() => {
      this.userProfileService.query().subscribe((res: HttpResponse<IUserProfile[]>) => {
        this.profiles = res.body ?? [];
      });
    });
    this.dropDownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'select all',
      unSelectAllText: 'unselect all',
      itemsShowLimit: 5,
      allowSearchFilter: true,
      enableCheckAll: false,
    };
  }

  protected loadFromBackendWithRouteInformations(): Observable<EntityArrayResponseType> {
    return combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data]).pipe(
      tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
      switchMap(() => this.queryBackend(this.predicate, this.ascending))
    );
  }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    const sort = (params.get(SORT) ?? data[DEFAULT_SORT_DATA]).split(',');
    this.predicate = sort[0];
    this.ascending = sort[1] === ASC;
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    this.items = this.refineData(dataFromBody);
    this.initialFilter();
    this.sortByTitle();
    this.filteredItems = this.items;
  }

  protected refineData(data: IItem[]): IItem[] {
    return data.sort(this.sortService.startSort(this.predicate, this.ascending ? 1 : -1));
  }

  protected fillComponentAttributesFromResponseBody(data: IItem[] | null): IItem[] {
    return data ?? [];
  }

  protected queryBackend(predicate?: string, ascending?: boolean): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject = {
      eagerload: true,
      sort: this.getSortQueryParam(predicate, ascending),
    };
    return this.itemService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
  }

  protected getSortQueryParam(predicate = this.predicate, ascending = this.ascending): string[] {
    const ascendingQueryParam = ascending ? ASC : DESC;
    if (predicate === '') {
      return [];
    } else {
      return [predicate + ',' + ascendingQueryParam];
    }
  }
}
