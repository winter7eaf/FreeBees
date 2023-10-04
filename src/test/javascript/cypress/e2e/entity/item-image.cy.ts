import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityCreateCancelButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('ItemImage e2e test', () => {
  const itemImagePageUrl = '/item-image';
  const itemImagePageUrlPattern = new RegExp('/item-image(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  // const itemImageSample = {"image":"Li4vZmFrZS1kYXRhL2Jsb2IvaGlwc3Rlci5wbmc=","imageContentType":"unknown"};

  let itemImage;
  // let item;

  beforeEach(() => {
    cy.login(username, password);
  });

  /* Disabled due to incompatibility
  beforeEach(() => {
    // create an instance at the required relationship entity:
    cy.authenticatedRequest({
      method: 'POST',
      url: '/api/items',
      body: {"title":"Human Car Senior","description":"Li4vZmFrZS1kYXRhL2Jsb2IvaGlwc3Rlci50eHQ=","condition":"USED_ACCEPTABLE","image":"Li4vZmFrZS1kYXRhL2Jsb2IvaGlwc3Rlci5wbmc=","imageContentType":"unknown","postcode":"GIR 0AA","uploadTime":"2023-03-10T05:13:00.079Z","givenTime":"2023-03-09T19:20:30.767Z","state":"GIVEN"},
    }).then(({ body }) => {
      item = body;
    });
  });
   */

  beforeEach(() => {
    cy.intercept('GET', '/api/item-images+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/item-images').as('postEntityRequest');
    cy.intercept('DELETE', '/api/item-images/*').as('deleteEntityRequest');
  });

  /* Disabled due to incompatibility
  beforeEach(() => {
    // Simulate relationships api for better performance and reproducibility.
    cy.intercept('GET', '/api/items', {
      statusCode: 200,
      body: [item],
    });

  });
   */

  afterEach(() => {
    if (itemImage) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/item-images/${itemImage.id}`,
      }).then(() => {
        itemImage = undefined;
      });
    }
  });

  /* Disabled due to incompatibility
  afterEach(() => {
    if (item) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/items/${item.id}`,
      }).then(() => {
        item = undefined;
      });
    }
  });
   */

  it('ItemImages menu should load ItemImages page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('item-image');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('ItemImage').should('exist');
    cy.url().should('match', itemImagePageUrlPattern);
  });

  describe('ItemImage page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(itemImagePageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create ItemImage page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/item-image/new$'));
        cy.getEntityCreateUpdateHeading('ItemImage');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', itemImagePageUrlPattern);
      });
    });

    describe('with existing value', () => {
      /* Disabled due to incompatibility
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/item-images',
          body: {
            ...itemImageSample,
            item: item,
          },
        }).then(({ body }) => {
          itemImage = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/item-images+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [itemImage],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(itemImagePageUrl);

        cy.wait('@entitiesRequestInternal');
      });
       */

      beforeEach(function () {
        cy.visit(itemImagePageUrl);

        cy.wait('@entitiesRequest').then(({ response }) => {
          if (response.body.length === 0) {
            this.skip();
          }
        });
      });

      it('detail button click should load details ItemImage page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('itemImage');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', itemImagePageUrlPattern);
      });

      it('edit button click should load edit ItemImage page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('ItemImage');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', itemImagePageUrlPattern);
      });

      it('edit button click should load edit ItemImage page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('ItemImage');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', itemImagePageUrlPattern);
      });

      it.skip('last delete button click should delete instance of ItemImage', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('itemImage').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', itemImagePageUrlPattern);

        itemImage = undefined;
      });
    });
  });

  describe('new ItemImage page', () => {
    beforeEach(() => {
      cy.visit(`${itemImagePageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('ItemImage');
    });

    it.skip('should create an instance of ItemImage', () => {
      cy.setFieldImageAsBytesOfEntity('image', 'integration-test.png', 'image/png');

      cy.get(`[data-cy="item"]`).select(1);

      // since cypress clicks submit too fast before the blob fields are validated
      cy.wait(200); // eslint-disable-line cypress/no-unnecessary-waiting
      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        itemImage = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', itemImagePageUrlPattern);
    });
  });
});
