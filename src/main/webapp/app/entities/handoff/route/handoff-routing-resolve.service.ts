import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IHandoff } from '../handoff.model';
import { HandoffService } from '../service/handoff.service';

@Injectable({ providedIn: 'root' })
export class HandoffRoutingResolveService implements Resolve<IHandoff | null> {
  constructor(protected service: HandoffService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IHandoff | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((handoff: HttpResponse<IHandoff>) => {
          if (handoff.body) {
            return of(handoff.body);
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
