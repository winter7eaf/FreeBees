import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IUserRate } from '../user-rate.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../user-rate.test-samples';

import { UserRateService } from './user-rate.service';

const requireRestSample: IUserRate = {
  ...sampleWithRequiredData,
};

describe('UserRate Service', () => {
  let service: UserRateService;
  let httpMock: HttpTestingController;
  let expectedResult: IUserRate | IUserRate[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(UserRateService);
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

    it('should create a UserRate', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const userRate = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(userRate).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a UserRate', () => {
      const userRate = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(userRate).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a UserRate', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of UserRate', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a UserRate', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addUserRateToCollectionIfMissing', () => {
      it('should add a UserRate to an empty array', () => {
        const userRate: IUserRate = sampleWithRequiredData;
        expectedResult = service.addUserRateToCollectionIfMissing([], userRate);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(userRate);
      });

      it('should not add a UserRate to an array that contains it', () => {
        const userRate: IUserRate = sampleWithRequiredData;
        const userRateCollection: IUserRate[] = [
          {
            ...userRate,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addUserRateToCollectionIfMissing(userRateCollection, userRate);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a UserRate to an array that doesn't contain it", () => {
        const userRate: IUserRate = sampleWithRequiredData;
        const userRateCollection: IUserRate[] = [sampleWithPartialData];
        expectedResult = service.addUserRateToCollectionIfMissing(userRateCollection, userRate);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(userRate);
      });

      it('should add only unique UserRate to an array', () => {
        const userRateArray: IUserRate[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const userRateCollection: IUserRate[] = [sampleWithRequiredData];
        expectedResult = service.addUserRateToCollectionIfMissing(userRateCollection, ...userRateArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const userRate: IUserRate = sampleWithRequiredData;
        const userRate2: IUserRate = sampleWithPartialData;
        expectedResult = service.addUserRateToCollectionIfMissing([], userRate, userRate2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(userRate);
        expect(expectedResult).toContain(userRate2);
      });

      it('should accept null and undefined values', () => {
        const userRate: IUserRate = sampleWithRequiredData;
        expectedResult = service.addUserRateToCollectionIfMissing([], null, userRate, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(userRate);
      });

      it('should return initial array if no UserRate is added', () => {
        const userRateCollection: IUserRate[] = [sampleWithRequiredData];
        expectedResult = service.addUserRateToCollectionIfMissing(userRateCollection, undefined, null);
        expect(expectedResult).toEqual(userRateCollection);
      });
    });

    describe('compareUserRate', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareUserRate(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareUserRate(entity1, entity2);
        const compareResult2 = service.compareUserRate(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareUserRate(entity1, entity2);
        const compareResult2 = service.compareUserRate(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareUserRate(entity1, entity2);
        const compareResult2 = service.compareUserRate(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
