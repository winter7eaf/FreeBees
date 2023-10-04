import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IHandoff, NewHandoff } from '../handoff.model';

export type PartialUpdateHandoff = Partial<IHandoff> & Pick<IHandoff, 'id'>;

type RestOf<T extends IHandoff | NewHandoff> = Omit<T, 'startTime' | 'endTime'> & {
  startTime?: string | null;
  endTime?: string | null;
};

export type RestHandoff = RestOf<IHandoff>;

export type NewRestHandoff = RestOf<NewHandoff>;

export type PartialUpdateRestHandoff = RestOf<PartialUpdateHandoff>;

export type EntityResponseType = HttpResponse<IHandoff>;
export type EntityArrayResponseType = HttpResponse<IHandoff[]>;

@Injectable({ providedIn: 'root' })
export class HandoffService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/handoffs');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(handoff: NewHandoff): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(handoff);
    return this.http
      .post<RestHandoff>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(handoff: IHandoff): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(handoff);
    return this.http
      .put<RestHandoff>(`${this.resourceUrl}/${this.getHandoffIdentifier(handoff)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(handoff: PartialUpdateHandoff): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(handoff);
    return this.http
      .patch<RestHandoff>(`${this.resourceUrl}/${this.getHandoffIdentifier(handoff)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestHandoff>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestHandoff[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getHandoffIdentifier(handoff: Pick<IHandoff, 'id'>): number {
    return handoff.id;
  }

  compareHandoff(o1: Pick<IHandoff, 'id'> | null, o2: Pick<IHandoff, 'id'> | null): boolean {
    return o1 && o2 ? this.getHandoffIdentifier(o1) === this.getHandoffIdentifier(o2) : o1 === o2;
  }

  addHandoffToCollectionIfMissing<Type extends Pick<IHandoff, 'id'>>(
    handoffCollection: Type[],
    ...handoffsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const handoffs: Type[] = handoffsToCheck.filter(isPresent);
    if (handoffs.length > 0) {
      const handoffCollectionIdentifiers = handoffCollection.map(handoffItem => this.getHandoffIdentifier(handoffItem)!);
      const handoffsToAdd = handoffs.filter(handoffItem => {
        const handoffIdentifier = this.getHandoffIdentifier(handoffItem);
        if (handoffCollectionIdentifiers.includes(handoffIdentifier)) {
          return false;
        }
        handoffCollectionIdentifiers.push(handoffIdentifier);
        return true;
      });
      return [...handoffsToAdd, ...handoffCollection];
    }
    return handoffCollection;
  }

  protected convertDateFromClient<T extends IHandoff | NewHandoff | PartialUpdateHandoff>(handoff: T): RestOf<T> {
    return {
      ...handoff,
      startTime: handoff.startTime?.toJSON() ?? null,
      endTime: handoff.endTime?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restHandoff: RestHandoff): IHandoff {
    return {
      ...restHandoff,
      startTime: restHandoff.startTime ? dayjs(restHandoff.startTime) : undefined,
      endTime: restHandoff.endTime ? dayjs(restHandoff.endTime) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestHandoff>): HttpResponse<IHandoff> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestHandoff[]>): HttpResponse<IHandoff[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
