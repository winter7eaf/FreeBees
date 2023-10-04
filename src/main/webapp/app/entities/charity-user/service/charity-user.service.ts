import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICharityUser, NewCharityUser } from '../charity-user.model';

export type PartialUpdateCharityUser = Partial<ICharityUser> & Pick<ICharityUser, 'id'>;

export type EntityResponseType = HttpResponse<ICharityUser>;
export type EntityArrayResponseType = HttpResponse<ICharityUser[]>;

@Injectable({ providedIn: 'root' })
export class CharityUserService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/charity-users');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(charityUser: NewCharityUser): Observable<EntityResponseType> {
    return this.http.post<ICharityUser>(this.resourceUrl, charityUser, { observe: 'response' });
  }

  update(charityUser: ICharityUser): Observable<EntityResponseType> {
    return this.http.put<ICharityUser>(`${this.resourceUrl}/${this.getCharityUserIdentifier(charityUser)}`, charityUser, {
      observe: 'response',
    });
  }

  partialUpdate(charityUser: PartialUpdateCharityUser): Observable<EntityResponseType> {
    return this.http.patch<ICharityUser>(`${this.resourceUrl}/${this.getCharityUserIdentifier(charityUser)}`, charityUser, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICharityUser>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICharityUser[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCharityUserIdentifier(charityUser: Pick<ICharityUser, 'id'>): number {
    return charityUser.id;
  }

  compareCharityUser(o1: Pick<ICharityUser, 'id'> | null, o2: Pick<ICharityUser, 'id'> | null): boolean {
    return o1 && o2 ? this.getCharityUserIdentifier(o1) === this.getCharityUserIdentifier(o2) : o1 === o2;
  }

  addCharityUserToCollectionIfMissing<Type extends Pick<ICharityUser, 'id'>>(
    charityUserCollection: Type[],
    ...charityUsersToCheck: (Type | null | undefined)[]
  ): Type[] {
    const charityUsers: Type[] = charityUsersToCheck.filter(isPresent);
    if (charityUsers.length > 0) {
      const charityUserCollectionIdentifiers = charityUserCollection.map(
        charityUserItem => this.getCharityUserIdentifier(charityUserItem)!
      );
      const charityUsersToAdd = charityUsers.filter(charityUserItem => {
        const charityUserIdentifier = this.getCharityUserIdentifier(charityUserItem);
        if (charityUserCollectionIdentifiers.includes(charityUserIdentifier)) {
          return false;
        }
        charityUserCollectionIdentifiers.push(charityUserIdentifier);
        return true;
      });
      return [...charityUsersToAdd, ...charityUserCollection];
    }
    return charityUserCollection;
  }
}
