import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IItemImage } from '../item-image.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-item-image-detail',
  templateUrl: './item-image-detail.component.html',
})
export class ItemImageDetailComponent implements OnInit {
  itemImage: IItemImage | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ itemImage }) => {
      this.itemImage = itemImage;
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  previousState(): void {
    window.history.back();
  }
}
