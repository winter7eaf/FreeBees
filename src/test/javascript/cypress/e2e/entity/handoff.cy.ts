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

describe('Handoff e2e test', () => {
  const handoffPageUrl = '/handoff';
  const handoffPageUrlPattern = new RegExp('/handoff(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  // const handoffSample = {"state":"COMPLETED","startTime":"2023-04-24T14:23:41.634Z"};

  let handoff;
  // let rateRecord;
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
      url: '/api/rate-records',
      body: {"rateValue":4},
    }).then(({ body }) => {
      rateRecord = body;
    });
    // create an instance at the required relationship entity:
    cy.authenticatedRequest({
      method: 'POST',
      url: '/api/users',
      body: {"login":"Convertible","firstName":"Nikolas","lastName":"Braun"},
    }).then(({ body }) => {
      user = body;
    });
    // create an instance at the required relationship entity:
    cy.authenticatedRequest({
      method: 'POST',
      url: '/api/items',
      body: {"title":"end-to-end Greenland","description":"Li4vZmFrZS1kYXRhL2Jsb2IvaGlwc3Rlci50eHQ=","condition":"NEW","image":"Li4vZmFrZS1kYXRhL2Jsb2IvaGlwc3Rlci5wbmc=","imageContentType":"unknown","postcode":"B31 3PF","uploadTime":"2023-03-09T17:40:55.503Z","givenTime":"2023-03-10T02:45:52.027Z","state":"CANCELLED"},
    }).then(({ body }) => {
      item = body;
    });
  });
   */

  beforeEach(() => {
    cy.intercept('GET', '/api/handoffs+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/handoffs').as('postEntityRequest');
    cy.intercept('DELETE', '/api/handoffs/*').as('deleteEntityRequest');
  });

  /* Disabled due to incompatibility
  beforeEach(() => {
    // Simulate relationships api for better performance and reproducibility.
    cy.intercept('GET', '/api/rate-records', {
      statusCode: 200,
      body: [rateRecord],
    });

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
    if (handoff) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/handoffs/${handoff.id}`,
      }).then(() => {
        handoff = undefined;
      });
    }
  });

  /* Disabled due to incompatibility
  afterEach(() => {
    if (rateRecord) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/rate-records/${rateRecord.id}`,
      }).then(() => {
        rateRecord = undefined;
      });
    }
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

  it('Handoffs menu should load Handoffs page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('handoff');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Handoff').should('exist');
    cy.url().should('match', handoffPageUrlPattern);
  });

  describe('Handoff page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(handoffPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Handoff page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/handoff/new$'));
        cy.getEntityCreateUpdateHeading('Handoff');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', handoffPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      /* Disabled due to incompatibility
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/handoffs',
          body: {
            ...handoffSample,
            rateToGiver: rateRecord,
            rateToReceiver: rateRecord,
            giver: user,
            receiver: user,
            item: item,
          },
        }).then(({ body }) => {
          handoff = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/handoffs+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [handoff],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(handoffPageUrl);

        cy.wait('@entitiesRequestInternal');
      });
       */

      beforeEach(function () {
        cy.visit(handoffPageUrl);

        cy.wait('@entitiesRequest').then(({ response }) => {
          if (response.body.length === 0) {
            this.skip();
          }
        });
      });

      it('detail button click should load details Handoff page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('handoff');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', handoffPageUrlPattern);
      });

      it('edit button click should load edit Handoff page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Handoff');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', handoffPageUrlPattern);
      });

      it('edit button click should load edit Handoff page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Handoff');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', handoffPageUrlPattern);
      });

      it.skip('last delete button click should delete instance of Handoff', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('handoff').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', handoffPageUrlPattern);

        handoff = undefined;
      });
    });
  });

  describe('new Handoff page', () => {
    beforeEach(() => {
      cy.visit(`${handoffPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Handoff');
    });

    it.skip('should create an instance of Handoff', () => {
      cy.get(`[data-cy="state"]`).select('COMPLETED');

      cy.get(`[data-cy="startTime"]`).type('2023-04-24T23:04').blur().should('have.value', '2023-04-24T23:04');

      cy.get(`[data-cy="endTime"]`).type('2023-04-25T13:41').blur().should('have.value', '2023-04-25T13:41');

      cy.get(`[data-cy="rateToGiver"]`).select(1);
      cy.get(`[data-cy="rateToReceiver"]`).select(1);
      cy.get(`[data-cy="giver"]`).select(1);
      cy.get(`[data-cy="receiver"]`).select(1);
      cy.get(`[data-cy="item"]`).select(1);

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        handoff = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', handoffPageUrlPattern);
    });
  });
});
