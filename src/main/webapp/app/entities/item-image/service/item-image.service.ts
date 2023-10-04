import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IItemImage, NewItemImage } from '../item-image.model';

export type PartialUpdateItemImage = Partial<IItemImage> & Pick<IItemImage, 'id'>;

export type EntityResponseType = HttpResponse<IItemImage>;
export type EntityArrayResponseType = HttpResponse<IItemImage[]>;

@Injectable({ providedIn: 'root' })
export class ItemImageService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/item-images');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(itemImage: NewItemImage): Observable<EntityResponseType> {
    return this.http.post<IItemImage>(this.resourceUrl, itemImage, { observe: 'response' });
  }

  update(itemImage: IItemImage): Observable<EntityResponseType> {
    return this.http.put<IItemImage>(`${this.resourceUrl}/${this.getItemImageIdentifier(itemImage)}`, itemImage, { observe: 'response' });
  }

  partialUpdate(itemImage: PartialUpdateItemImage): Observable<EntityResponseType> {
    return this.http.patch<IItemImage>(`${this.resourceUrl}/${this.getItemImageIdentifier(itemImage)}`, itemImage, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IItemImage>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IItemImage[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getItemImageIdentifier(itemImage: Pick<IItemImage, 'id'>): number {
    return itemImage.id;
  }

  compareItemImage(o1: Pick<IItemImage, 'id'> | null, o2: Pick<IItemImage, 'id'> | null): boolean {
    return o1 && o2 ? this.getItemImageIdentifier(o1) === this.getItemImageIdentifier(o2) : o1 === o2;
  }

  addItemImageToCollectionIfMissing<Type extends Pick<IItemImage, 'id'>>(
    itemImageCollection: Type[],
    ...itemImagesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const itemImages: Type[] = itemImagesToCheck.filter(isPresent);
    if (itemImages.length > 0) {
      const itemImageCollectionIdentifiers = itemImageCollection.map(itemImageItem => this.getItemImageIdentifier(itemImageItem)!);
      const itemImagesToAdd = itemImages.filter(itemImageItem => {
        const itemImageIdentifier = this.getItemImageIdentifier(itemImageItem);
        if (itemImageCollectionIdentifiers.includes(itemImageIdentifier)) {
          return false;
        }
        itemImageCollectionIdentifiers.push(itemImageIdentifier);
        return true;
      });
      return [...itemImagesToAdd, ...itemImageCollection];
    }
    return itemImageCollection;
  }
}
