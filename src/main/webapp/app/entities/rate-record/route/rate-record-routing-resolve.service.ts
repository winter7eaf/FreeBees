import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IRateRecord } from '../rate-record.model';
import { RateRecordService } from '../service/rate-record.service';

@Injectable({ providedIn: 'root' })
export class RateRecordRoutingResolveService implements Resolve<IRateRecord | null> {
  constructor(protected service: RateRecordService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IRateRecord | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((rateRecord: HttpResponse<IRateRecord>) => {
          if (rateRecord.body) {
            return of(rateRecord.body);
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
