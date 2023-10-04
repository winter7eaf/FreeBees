import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IUserRate } from '../user-rate.model';
import { UserRateService } from '../service/user-rate.service';

@Injectable({ providedIn: 'root' })
export class UserRateRoutingResolveService implements Resolve<IUserRate | null> {
  constructor(protected service: UserRateService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IUserRate | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((userRate: HttpResponse<IUserRate>) => {
          if (userRate.body) {
            return of(userRate.body);
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
