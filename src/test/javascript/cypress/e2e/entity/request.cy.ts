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

describe('Request e2e test', () => {
  const requestPageUrl = '/request';
  const requestPageUrlPattern = new RegExp('/request(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  // const requestSample = {"type":"REQUEST_TO_GIVE","state":"EXPIRED","sentTime":"2023-04-25T04:46:56.810Z","expiryTime":"2023-04-24T19:52:55.572Z"};

  let request;
  // let user;
  // let item;

  beforeEach(() => {
    cy.login(username, password);
  });

  /* Disabled due to incompatibility
  beforeEach(() => {
    // create an instance at the required relationship entity:
    cy.authenticatedRequest({
      method: 'POST',
      url: '/api/users',
      body: {"login":"feed silver","firstName":"Karl","lastName":"Gulgowski"},
    }).then(({ body }) => {
      user = body;
    });
    // create an instance at the required relationship entity:
    cy.authenticatedRequest({
      method: 'POST',
      url: '/api/items',
      body: {"title":"incubate Toys Rubber","description":"Li4vZmFrZS1kYXRhL2Jsb2IvaGlwc3Rlci50eHQ=","condition":"USED_LIKE_NEW","image":"Li4vZmFrZS1kYXRhL2Jsb2IvaGlwc3Rlci5wbmc=","imageContentType":"unknown","postcode":"N96NJ","uploadTime":"2023-03-09T23:46:25.390Z","givenTime":"2023-03-09T21:49:18.929Z","state":"AVAILABLE"},
    }).then(({ body }) => {
      item = body;
    });
  });
   */

  beforeEach(() => {
    cy.intercept('GET', '/api/requests+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/requests').as('postEntityRequest');
    cy.intercept('DELETE', '/api/requests/*').as('deleteEntityRequest');
  });

  /* Disabled due to incompatibility
  beforeEach(() => {
    // Simulate relationships api for better performance and reproducibility.
    cy.intercept('GET', '/api/users', {
      statusCode: 200,
      body: [user],
    });

    cy.intercept('GET', '/api/items', {
      statusCode: 200,
      body: [item],
    });

  });
   */

  afterEach(() => {
    if (request) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/requests/${request.id}`,
      }).then(() => {
        request = undefined;
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

  it('Requests menu should load Requests page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('request');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Request').should('exist');
    cy.url().should('match', requestPageUrlPattern);
  });

  describe('Request page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(requestPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Request page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/request/new$'));
        cy.getEntityCreateUpdateHeading('Request');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', requestPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      /* Disabled due to incompatibility
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/requests',
          body: {
            ...requestSample,
            requester: user,
            requestee: user,
            item: item,
          },
        }).then(({ body }) => {
          request = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/requests+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [request],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(requestPageUrl);

        cy.wait('@entitiesRequestInternal');
      });
       */

      beforeEach(function () {
        cy.visit(requestPageUrl);

        cy.wait('@entitiesRequest').then(({ response }) => {
          if (response.body.length === 0) {
            this.skip();
          }
        });
      });

      it('detail button click should load details Request page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('request');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', requestPageUrlPattern);
      });

      it('edit button click should load edit Request page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Request');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', requestPageUrlPattern);
      });

      it('edit button click should load edit Request page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Request');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', requestPageUrlPattern);
      });

      it.skip('last delete button click should delete instance of Request', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('request').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', requestPageUrlPattern);

        request = undefined;
      });
    });
  });

  describe('new Request page', () => {
    beforeEach(() => {
      cy.visit(`${requestPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Request');
    });

    it.skip('should create an instance of Request', () => {
      cy.get(`[data-cy="type"]`).select('REQUEST_TO_GIVE');

      cy.get(`[data-cy="state"]`).select('REJECTED');

      cy.get(`[data-cy="sentTime"]`).type('2023-04-24T23:42').blur().should('have.value', '2023-04-24T23:42');

      cy.get(`[data-cy="expiryTime"]`).type('2023-04-24T18:06').blur().should('have.value', '2023-04-24T18:06');

      cy.get(`[data-cy="responseTime"]`).type('2023-04-25T02:17').blur().should('have.value', '2023-04-25T02:17');

      cy.get(`[data-cy="requester"]`).select(1);
      cy.get(`[data-cy="requestee"]`).select(1);
      cy.get(`[data-cy="item"]`).select(1);

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        request = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', requestPageUrlPattern);
    });
  });
});
