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

describe('Item e2e test', () => {
  const itemPageUrl = '/item';
  const itemPageUrlPattern = new RegExp('/item(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  // const itemSample = {"title":"Solutions program","description":"Li4vZmFrZS1kYXRhL2Jsb2IvaGlwc3Rlci50eHQ=","condition":"USED_LIKE_NEW","image":"Li4vZmFrZS1kYXRhL2Jsb2IvaGlwc3Rlci5wbmc=","imageContentType":"unknown","postcode":"S44 2UX","uploadTime":"2023-03-09T20:28:08.263Z","state":"CANCELLED"};

  let item;
  // let user;
  // let itemImage;

  beforeEach(() => {
    cy.login(username, password);
  });

  /* Disabled due to incompatibility
  beforeEach(() => {
    // create an instance at the required relationship entity:
    cy.authenticatedRequest({
      method: 'POST',
      url: '/api/users',
      body: {"login":"strategize Intelligent Towels","firstName":"Jimmie","lastName":"Zboncak"},
    }).then(({ body }) => {
      user = body;
    });
    // create an instance at the required relationship entity:
    cy.authenticatedRequest({
      method: 'POST',
      url: '/api/item-images',
      body: {"image":"Li4vZmFrZS1kYXRhL2Jsb2IvaGlwc3Rlci5wbmc=","imageContentType":"unknown"},
    }).then(({ body }) => {
      itemImage = body;
    });
  });
   */

  beforeEach(() => {
    cy.intercept('GET', '/api/items+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/items').as('postEntityRequest');
    cy.intercept('DELETE', '/api/items/*').as('deleteEntityRequest');
  });

  /* Disabled due to incompatibility
  beforeEach(() => {
    // Simulate relationships api for better performance and reproducibility.
    cy.intercept('GET', '/api/users', {
      statusCode: 200,
      body: [user],
    });

    cy.intercept('GET', '/api/tags', {
      statusCode: 200,
      body: [],
    });

    cy.intercept('GET', '/api/item-images', {
      statusCode: 200,
      body: [itemImage],
    });

    cy.intercept('GET', '/api/requests', {
      statusCode: 200,
      body: [],
    });

    cy.intercept('GET', '/api/handoffs', {
      statusCode: 200,
      body: [],
    });

  });
   */

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

  /* Disabled due to incompatibility
  afterEach(() => {
    if (user) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/users/${user.id}`,
      }).then(() => {
        user = undefined;
      });
    }
    if (itemImage) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/item-images/${itemImage.id}`,
      }).then(() => {
        itemImage = undefined;
      });
    }
  });
   */

  it('Items menu should load Items page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('item');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Item').should('exist');
    cy.url().should('match', itemPageUrlPattern);
  });

  describe('Item page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(itemPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Item page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/item/new$'));
        cy.getEntityCreateUpdateHeading('Item');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', itemPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      /* Disabled due to incompatibility
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/items',
          body: {
            ...itemSample,
            giver: user,
            image: itemImage,
          },
        }).then(({ body }) => {
          item = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/items+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [item],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(itemPageUrl);

        cy.wait('@entitiesRequestInternal');
      });
       */

      beforeEach(function () {
        cy.visit(itemPageUrl);

        cy.wait('@entitiesRequest').then(({ response }) => {
          if (response.body.length === 0) {
            this.skip();
          }
        });
      });

      it('detail button click should load details Item page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('item');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', itemPageUrlPattern);
      });

      it('edit button click should load edit Item page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Item');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', itemPageUrlPattern);
      });

      it('edit button click should load edit Item page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Item');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', itemPageUrlPattern);
      });

      it.skip('last delete button click should delete instance of Item', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('item').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', itemPageUrlPattern);

        item = undefined;
      });
    });
  });

  describe('new Item page', () => {
    beforeEach(() => {
      cy.visit(`${itemPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Item');
    });

    it.skip('should create an instance of Item', () => {
      cy.get(`[data-cy="title"]`).type('program').should('have.value', 'program');

      cy.get(`[data-cy="description"]`)
        .type('../fake-data/blob/hipster.txt')
        .invoke('val')
        .should('match', new RegExp('../fake-data/blob/hipster.txt'));

      cy.get(`[data-cy="condition"]`).select('NEW');

      cy.setFieldImageAsBytesOfEntity('image', 'integration-test.png', 'image/png');

      cy.get(`[data-cy="postcode"]`).type('P752JQ').should('have.value', 'P752JQ');

      cy.get(`[data-cy="uploadTime"]`).type('2023-03-09T17:55').blur().should('have.value', '2023-03-09T17:55');

      cy.get(`[data-cy="givenTime"]`).type('2023-03-10T10:36').blur().should('have.value', '2023-03-10T10:36');

      cy.get(`[data-cy="state"]`).select('AVAILABLE');

      cy.get(`[data-cy="giver"]`).select(1);
      cy.get(`[data-cy="image"]`).select([0]);

      // since cypress clicks submit too fast before the blob fields are validated
      cy.wait(200); // eslint-disable-line cypress/no-unnecessary-waiting
      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        item = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', itemPageUrlPattern);
    });
  });
});
