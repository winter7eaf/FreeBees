import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IItemImage } from '../item-image.model';
import { ItemImageService } from '../service/item-image.service';

@Injectable({ providedIn: 'root' })
export class ItemImageRoutingResolveService implements Resolve<IItemImage | null> {
  constructor(protected service: ItemImageService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IItemImage | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((itemImage: HttpResponse<IItemImage>) => {
          if (itemImage.body) {
            return of(itemImage.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
