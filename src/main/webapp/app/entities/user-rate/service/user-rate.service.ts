import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IUserRate, NewUserRate } from '../user-rate.model';

export type PartialUpdateUserRate = Partial<IUserRate> & Pick<IUserRate, 'id'>;

export type EntityResponseType = HttpResponse<IUserRate>;
export type EntityArrayResponseType = HttpResponse<IUserRate[]>;

@Injectable({ providedIn: 'root' })
export class UserRateService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/user-rates');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(userRate: NewUserRate): Observable<EntityResponseType> {
    return this.http.post<IUserRate>(this.resourceUrl, userRate, { observe: 'response' });
  }

  update(userRate: IUserRate): Observable<EntityResponseType> {
    return this.http.put<IUserRate>(`${this.resourceUrl}/${this.getUserRateIdentifier(userRate)}`, userRate, { observe: 'response' });
  }

  partialUpdate(userRate: PartialUpdateUserRate): Observable<EntityResponseType> {
    return this.http.patch<IUserRate>(`${this.resourceUrl}/${this.getUserRateIdentifier(userRate)}`, userRate, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IUserRate>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IUserRate[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getUserRateIdentifier(userRate: Pick<IUserRate, 'id'>): number {
    return userRate.id;
  }

  compareUserRate(o1: Pick<IUserRate, 'id'> | null, o2: Pick<IUserRate, 'id'> | null): boolean {
    return o1 && o2 ? this.getUserRateIdentifier(o1) === this.getUserRateIdentifier(o2) : o1 === o2;
  }

  addUserRateToCollectionIfMissing<Type extends Pick<IUserRate, 'id'>>(
    userRateCollection: Type[],
    ...userRatesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const userRates: Type[] = userRatesToCheck.filter(isPresent);
    if (userRates.length > 0) {
      const userRateCollectionIdentifiers = userRateCollection.map(userRateItem => this.getUserRateIdentifier(userRateItem)!);
      const userRatesToAdd = userRates.filter(userRateItem => {
        const userRateIdentifier = this.getUserRateIdentifier(userRateItem);
        if (userRateCollectionIdentifiers.includes(userRateIdentifier)) {
          return false;
        }
        userRateCollectionIdentifiers.push(userRateIdentifier);
        return true;
      });
      return [...userRatesToAdd, ...userRateCollection];
    }
    return userRateCollection;
  }
}
