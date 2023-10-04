import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICharityUser } from '../charity-user.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../charity-user.test-samples';

import { CharityUserService } from './charity-user.service';

const requireRestSample: ICharityUser = {
  ...sampleWithRequiredData,
};

describe('CharityUser Service', () => {
  let service: CharityUserService;
  let httpMock: HttpTestingController;
  let expectedResult: ICharityUser | ICharityUser[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CharityUserService);
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

    it('should create a CharityUser', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const charityUser = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(charityUser).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a CharityUser', () => {
      const charityUser = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(charityUser).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a CharityUser', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of CharityUser', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a CharityUser', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addCharityUserToCollectionIfMissing', () => {
      it('should add a CharityUser to an empty array', () => {
        const charityUser: ICharityUser = sampleWithRequiredData;
        expectedResult = service.addCharityUserToCollectionIfMissing([], charityUser);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(charityUser);
      });

      it('should not add a CharityUser to an array that contains it', () => {
        const charityUser: ICharityUser = sampleWithRequiredData;
        const charityUserCollection: ICharityUser[] = [
          {
            ...charityUser,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addCharityUserToCollectionIfMissing(charityUserCollection, charityUser);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a CharityUser to an array that doesn't contain it", () => {
        const charityUser: ICharityUser = sampleWithRequiredData;
        const charityUserCollection: ICharityUser[] = [sampleWithPartialData];
        expectedResult = service.addCharityUserToCollectionIfMissing(charityUserCollection, charityUser);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(charityUser);
      });

      it('should add only unique CharityUser to an array', () => {
        const charityUserArray: ICharityUser[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const charityUserCollection: ICharityUser[] = [sampleWithRequiredData];
        expectedResult = service.addCharityUserToCollectionIfMissing(charityUserCollection, ...charityUserArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const charityUser: ICharityUser = sampleWithRequiredData;
        const charityUser2: ICharityUser = sampleWithPartialData;
        expectedResult = service.addCharityUserToCollectionIfMissing([], charityUser, charityUser2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(charityUser);
        expect(expectedResult).toContain(charityUser2);
      });

      it('should accept null and undefined values', () => {
        const charityUser: ICharityUser = sampleWithRequiredData;
        expectedResult = service.addCharityUserToCollectionIfMissing([], null, charityUser, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(charityUser);
      });

      it('should return initial array if no CharityUser is added', () => {
        const charityUserCollection: ICharityUser[] = [sampleWithRequiredData];
        expectedResult = service.addCharityUserToCollectionIfMissing(charityUserCollection, undefined, null);
        expect(expectedResult).toEqual(charityUserCollection);
      });
    });

    describe('compareCharityUser', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareCharityUser(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareCharityUser(entity1, entity2);
        const compareResult2 = service.compareCharityUser(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareCharityUser(entity1, entity2);
        const compareResult2 = service.compareCharityUser(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareCharityUser(entity1, entity2);
        const compareResult2 = service.compareCharityUser(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
