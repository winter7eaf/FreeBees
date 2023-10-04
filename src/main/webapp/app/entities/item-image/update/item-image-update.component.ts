import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ItemImageFormService, ItemImageFormGroup } from './item-image-form.service';
import { IItemImage } from '../item-image.model';
import { ItemImageService } from '../service/item-image.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IItem } from 'app/entities/item/item.model';
import { ItemService } from 'app/entities/item/service/item.service';

@Component({
  selector: 'jhi-item-image-update',
  templateUrl: './item-image-update.component.html',
})
export class ItemImageUpdateComponent implements OnInit {
  isSaving = false;
  itemImage: IItemImage | null = null;

  itemsSharedCollection: IItem[] = [];

  editForm: ItemImageFormGroup = this.itemImageFormService.createItemImageFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected itemImageService: ItemImageService,
    protected itemImageFormService: ItemImageFormService,
    protected itemService: ItemService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareItem = (o1: IItem | null, o2: IItem | null): boolean => this.itemService.compareItem(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ itemImage }) => {
      this.itemImage = itemImage;
      if (itemImage) {
        this.updateForm(itemImage);
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

  clearInputImage(field: string, fieldContentType: string, idInput: string): void {
    this.editForm.patchValue({
      [field]: null,
      [fieldContentType]: null,
    });
    if (idInput && this.elementRef.nativeElement.querySelector('#' + idInput)) {
      this.elementRef.nativeElement.querySelector('#' + idInput).value = null;
    }
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const itemImage = this.itemImageFormService.getItemImage(this.editForm);
    if (itemImage.id !== null) {
      this.subscribeToSaveResponse(this.itemImageService.update(itemImage));
    } else {
      this.subscribeToSaveResponse(this.itemImageService.create(itemImage));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IItemImage>>): void {
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

  protected updateForm(itemImage: IItemImage): void {
    this.itemImage = itemImage;
    this.itemImageFormService.resetForm(this.editForm, itemImage);

    this.itemsSharedCollection = this.itemService.addItemToCollectionIfMissing<IItem>(this.itemsSharedCollection, itemImage.item);
  }

  protected loadRelationshipsOptions(): void {
    this.itemService
      .query()
      .pipe(map((res: HttpResponse<IItem[]>) => res.body ?? []))
      .pipe(map((items: IItem[]) => this.itemService.addItemToCollectionIfMissing<IItem>(items, this.itemImage?.item)))
      .subscribe((items: IItem[]) => (this.itemsSharedCollection = items));
  }
}
