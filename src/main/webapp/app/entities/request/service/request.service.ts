import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IRequest, NewRequest } from '../request.model';

export type PartialUpdateRequest = Partial<IRequest> & Pick<IRequest, 'id'>;

type RestOf<T extends IRequest | NewRequest> = Omit<T, 'sentTime' | 'expiryTime' | 'responseTime'> & {
  sentTime?: string | null;
  expiryTime?: string | null;
  responseTime?: string | null;
};

export type RestRequest = RestOf<IRequest>;

export type NewRestRequest = RestOf<NewRequest>;

export type PartialUpdateRestRequest = RestOf<PartialUpdateRequest>;

export type EntityResponseType = HttpResponse<IRequest>;
export type EntityArrayResponseType = HttpResponse<IRequest[]>;

@Injectable({ providedIn: 'root' })
export class RequestService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/requests');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(request: NewRequest): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(request);
    return this.http
      .post<RestRequest>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(request: IRequest): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(request);
    return this.http
      .put<RestRequest>(`${this.resourceUrl}/${this.getRequestIdentifier(request)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(request: PartialUpdateRequest): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(request);
    return this.http
      .patch<RestRequest>(`${this.resourceUrl}/${this.getRequestIdentifier(request)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestRequest>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestRequest[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getRequestIdentifier(request: Pick<IRequest, 'id'>): number {
    return request.id;
  }

  compareRequest(o1: Pick<IRequest, 'id'> | null, o2: Pick<IRequest, 'id'> | null): boolean {
    return o1 && o2 ? this.getRequestIdentifier(o1) === this.getRequestIdentifier(o2) : o1 === o2;
  }

  addRequestToCollectionIfMissing<Type extends Pick<IRequest, 'id'>>(
    requestCollection: Type[],
    ...requestsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const requests: Type[] = requestsToCheck.filter(isPresent);
    if (requests.length > 0) {
      const requestCollectionIdentifiers = requestCollection.map(requestItem => this.getRequestIdentifier(requestItem)!);
      const requestsToAdd = requests.filter(requestItem => {
        const requestIdentifier = this.getRequestIdentifier(requestItem);
        if (requestCollectionIdentifiers.includes(requestIdentifier)) {
          return false;
        }
        requestCollectionIdentifiers.push(requestIdentifier);
        return true;
      });
      return [...requestsToAdd, ...requestCollection];
    }
    return requestCollection;
  }

  protected convertDateFromClient<T extends IRequest | NewRequest | PartialUpdateRequest>(request: T): RestOf<T> {
    return {
      ...request,
      sentTime: request.sentTime?.toJSON() ?? null,
      expiryTime: request.expiryTime?.toJSON() ?? null,
      responseTime: request.responseTime?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restRequest: RestRequest): IRequest {
    return {
      ...restRequest,
      sentTime: restRequest.sentTime ? dayjs(restRequest.sentTime) : undefined,
      expiryTime: restRequest.expiryTime ? dayjs(restRequest.expiryTime) : undefined,
      responseTime: restRequest.responseTime ? dayjs(restRequest.responseTime) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestRequest>): HttpResponse<IRequest> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestRequest[]>): HttpResponse<IRequest[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
