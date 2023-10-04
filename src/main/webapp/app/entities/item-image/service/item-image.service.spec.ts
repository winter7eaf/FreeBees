import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IItemImage } from '../item-image.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../item-image.test-samples';

import { ItemImageService } from './item-image.service';

const requireRestSample: IItemImage = {
  ...sampleWithRequiredData,
};

describe('ItemImage Service', () => {
  let service: ItemImageService;
  let httpMock: HttpTestingController;
  let expectedResult: IItemImage | IItemImage[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ItemImageService);
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

    it('should create a ItemImage', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const itemImage = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(itemImage).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ItemImage', () => {
      const itemImage = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(itemImage).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ItemImage', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ItemImage', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ItemImage', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addItemImageToCollectionIfMissing', () => {
      it('should add a ItemImage to an empty array', () => {
        const itemImage: IItemImage = sampleWithRequiredData;
        expectedResult = service.addItemImageToCollectionIfMissing([], itemImage);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(itemImage);
      });

      it('should not add a ItemImage to an array that contains it', () => {
        const itemImage: IItemImage = sampleWithRequiredData;
        const itemImageCollection: IItemImage[] = [
          {
            ...itemImage,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addItemImageToCollectionIfMissing(itemImageCollection, itemImage);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ItemImage to an array that doesn't contain it", () => {
        const itemImage: IItemImage = sampleWithRequiredData;
        const itemImageCollection: IItemImage[] = [sampleWithPartialData];
        expectedResult = service.addItemImageToCollectionIfMissing(itemImageCollection, itemImage);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(itemImage);
      });

      it('should add only unique ItemImage to an array', () => {
        const itemImageArray: IItemImage[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const itemImageCollection: IItemImage[] = [sampleWithRequiredData];
        expectedResult = service.addItemImageToCollectionIfMissing(itemImageCollection, ...itemImageArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const itemImage: IItemImage = sampleWithRequiredData;
        const itemImage2: IItemImage = sampleWithPartialData;
        expectedResult = service.addItemImageToCollectionIfMissing([], itemImage, itemImage2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(itemImage);
        expect(expectedResult).toContain(itemImage2);
      });

      it('should accept null and undefined values', () => {
        const itemImage: IItemImage = sampleWithRequiredData;
        expectedResult = service.addItemImageToCollectionIfMissing([], null, itemImage, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(itemImage);
      });

      it('should return initial array if no ItemImage is added', () => {
        const itemImageCollection: IItemImage[] = [sampleWithRequiredData];
        expectedResult = service.addItemImageToCollectionIfMissing(itemImageCollection, undefined, null);
        expect(expectedResult).toEqual(itemImageCollection);
      });
    });

    describe('compareItemImage', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareItemImage(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareItemImage(entity1, entity2);
        const compareResult2 = service.compareItemImage(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareItemImage(entity1, entity2);
        const compareResult2 = service.compareItemImage(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareItemImage(entity1, entity2);
        const compareResult2 = service.compareItemImage(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
