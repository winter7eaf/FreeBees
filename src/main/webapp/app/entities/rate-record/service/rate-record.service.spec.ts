import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IRateRecord } from '../rate-record.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../rate-record.test-samples';

import { RateRecordService } from './rate-record.service';

const requireRestSample: IRateRecord = {
  ...sampleWithRequiredData,
};

describe('RateRecord Service', () => {
  let service: RateRecordService;
  let httpMock: HttpTestingController;
  let expectedResult: IRateRecord | IRateRecord[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(RateRecordService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a RateRecord', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const rateRecord = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(rateRecord).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a RateRecord', () => {
      const rateRecord = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(rateRecord).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a RateRecord', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of RateRecord', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a RateRecord', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addRateRecordToCollectionIfMissing', () => {
      it('should add a RateRecord to an empty array', () => {
        const rateRecord: IRateRecord = sampleWithRequiredData;
        expectedResult = service.addRateRecordToCollectionIfMissing([], rateRecord);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(rateRecord);
      });

      it('should not add a RateRecord to an array that contains it', () => {
        const rateRecord: IRateRecord = sampleWithRequiredData;
        const rateRecordCollection: IRateRecord[] = [
          {
            ...rateRecord,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addRateRecordToCollectionIfMissing(rateRecordCollection, rateRecord);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a RateRecord to an array that doesn't contain it", () => {
        const rateRecord: IRateRecord = sampleWithRequiredData;
        const rateRecordCollection: IRateRecord[] = [sampleWithPartialData];
        expectedResult = service.addRateRecordToCollectionIfMissing(rateRecordCollection, rateRecord);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(rateRecord);
      });

      it('should add only unique RateRecord to an array', () => {
        const rateRecordArray: IRateRecord[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const rateRecordCollection: IRateRecord[] = [sampleWithRequiredData];
        expectedResult = service.addRateRecordToCollectionIfMissing(rateRecordCollection, ...rateRecordArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const rateRecord: IRateRecord = sampleWithRequiredData;
        const rateRecord2: IRateRecord = sampleWithPartialData;
        expectedResult = service.addRateRecordToCollectionIfMissing([], rateRecord, rateRecord2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(rateRecord);
        expect(expectedResult).toContain(rateRecord2);
      });

      it('should accept null and undefined values', () => {
        const rateRecord: IRateRecord = sampleWithRequiredData;
        expectedResult = service.addRateRecordToCollectionIfMissing([], null, rateRecord, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(rateRecord);
      });

      it('should return initial array if no RateRecord is added', () => {
        const rateRecordCollection: IRateRecord[] = [sampleWithRequiredData];
        expectedResult = service.addRateRecordToCollectionIfMissing(rateRecordCollection, undefined, null);
        expect(expectedResult).toEqual(rateRecordCollection);
      });
    });

    describe('compareRateRecord', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareRateRecord(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareRateRecord(entity1, entity2);
        const compareResult2 = service.compareRateRecord(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareRateRecord(entity1, entity2);
        const compareResult2 = service.compareRateRecord(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareRateRecord(entity1, entity2);
        const compareResult2 = service.compareRateRecord(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
