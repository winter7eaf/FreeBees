import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IRateRecord, NewRateRecord } from '../rate-record.model';

export type PartialUpdateRateRecord = Partial<IRateRecord> & Pick<IRateRecord, 'id'>;

export type EntityResponseType = HttpResponse<IRateRecord>;
export type EntityArrayResponseType = HttpResponse<IRateRecord[]>;

@Injectable({ providedIn: 'root' })
export class RateRecordService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/rate-records');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(rateRecord: NewRateRecord): Observable<EntityResponseType> {
    return this.http.post<IRateRecord>(this.resourceUrl, rateRecord, { observe: 'response' });
  }

  update(rateRecord: IRateRecord): Observable<EntityResponseType> {
    return this.http.put<IRateRecord>(`${this.resourceUrl}/${this.getRateRecordIdentifier(rateRecord)}`, rateRecord, {
      observe: 'response',
    });
  }

  partialUpdate(rateRecord: PartialUpdateRateRecord): Observable<EntityResponseType> {
    return this.http.patch<IRateRecord>(`${this.resourceUrl}/${this.getRateRecordIdentifier(rateRecord)}`, rateRecord, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IRateRecord>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IRateRecord[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getRateRecordIdentifier(rateRecord: Pick<IRateRecord, 'id'>): number {
    return rateRecord.id;
  }

  compareRateRecord(o1: Pick<IRateRecord, 'id'> | null, o2: Pick<IRateRecord, 'id'> | null): boolean {
    return o1 && o2 ? this.getRateRecordIdentifier(o1) === this.getRateRecordIdentifier(o2) : o1 === o2;
  }

  addRateRecordToCollectionIfMissing<Type extends Pick<IRateRecord, 'id'>>(
    rateRecordCollection: Type[],
    ...rateRecordsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const rateRecords: Type[] = rateRecordsToCheck.filter(isPresent);
    if (rateRecords.length > 0) {
      const rateRecordCollectionIdentifiers = rateRecordCollection.map(rateRecordItem => this.getRateRecordIdentifier(rateRecordItem)!);
      const rateRecordsToAdd = rateRecords.filter(rateRecordItem => {
        const rateRecordIdentifier = this.getRateRecordIdentifier(rateRecordItem);
        if (rateRecordCollectionIdentifiers.includes(rateRecordIdentifier)) {
          return false;
        }
        rateRecordCollectionIdentifiers.push(rateRecordIdentifier);
        return true;
      });
      return [...rateRecordsToAdd, ...rateRecordCollection];
    }
    return rateRecordCollection;
  }
}
