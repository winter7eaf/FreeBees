import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IHandoff } from '../handoff.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../handoff.test-samples';

import { HandoffService, RestHandoff } from './handoff.service';

const requireRestSample: RestHandoff = {
  ...sampleWithRequiredData,
  startTime: sampleWithRequiredData.startTime?.toJSON(),
  endTime: sampleWithRequiredData.endTime?.toJSON(),
};

describe('Handoff Service', () => {
  let service: HandoffService;
  let httpMock: HttpTestingController;
  let expectedResult: IHandoff | IHandoff[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(HandoffService);
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

    it('should create a Handoff', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const handoff = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(handoff).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Handoff', () => {
      const handoff = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(handoff).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Handoff', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Handoff', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Handoff', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addHandoffToCollectionIfMissing', () => {
      it('should add a Handoff to an empty array', () => {
        const handoff: IHandoff = sampleWithRequiredData;
        expectedResult = service.addHandoffToCollectionIfMissing([], handoff);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(handoff);
      });

      it('should not add a Handoff to an array that contains it', () => {
        const handoff: IHandoff = sampleWithRequiredData;
        const handoffCollection: IHandoff[] = [
          {
            ...handoff,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addHandoffToCollectionIfMissing(handoffCollection, handoff);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Handoff to an array that doesn't contain it", () => {
        const handoff: IHandoff = sampleWithRequiredData;
        const handoffCollection: IHandoff[] = [sampleWithPartialData];
        expectedResult = service.addHandoffToCollectionIfMissing(handoffCollection, handoff);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(handoff);
      });

      it('should add only unique Handoff to an array', () => {
        const handoffArray: IHandoff[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const handoffCollection: IHandoff[] = [sampleWithRequiredData];
        expectedResult = service.addHandoffToCollectionIfMissing(handoffCollection, ...handoffArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const handoff: IHandoff = sampleWithRequiredData;
        const handoff2: IHandoff = sampleWithPartialData;
        expectedResult = service.addHandoffToCollectionIfMissing([], handoff, handoff2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(handoff);
        expect(expectedResult).toContain(handoff2);
      });

      it('should accept null and undefined values', () => {
        const handoff: IHandoff = sampleWithRequiredData;
        expectedResult = service.addHandoffToCollectionIfMissing([], null, handoff, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(handoff);
      });

      it('should return initial array if no Handoff is added', () => {
        const handoffCollection: IHandoff[] = [sampleWithRequiredData];
        expectedResult = service.addHandoffToCollectionIfMissing(handoffCollection, undefined, null);
        expect(expectedResult).toEqual(handoffCollection);
      });
    });

    describe('compareHandoff', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareHandoff(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareHandoff(entity1, entity2);
        const compareResult2 = service.compareHandoff(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareHandoff(entity1, entity2);
        const compareResult2 = service.compareHandoff(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareHandoff(entity1, entity2);
        const compareResult2 = service.compareHandoff(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
