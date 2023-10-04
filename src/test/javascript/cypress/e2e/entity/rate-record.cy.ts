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

describe('RateRecord e2e test', () => {
  const rateRecordPageUrl = '/rate-record';
  const rateRecordPageUrlPattern = new RegExp('/rate-record(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  // const rateRecordSample = {"rateValue":7};

  let rateRecord;
  // let user;
  // let handoff;

  beforeEach(() => {
    cy.login(username, password);
  });

  /* Disabled due to incompatibility
  beforeEach(() => {
    // create an instance at the required relationship entity:
    cy.authenticatedRequest({
      method: 'POST',
      url: '/api/users',
      body: {"login":"Engineer copying Cambridgeshire","firstName":"Nona","lastName":"Hahn"},
    }).then(({ body }) => {
      user = body;
    });
    // create an instance at the required relationship entity:
    cy.authenticatedRequest({
      method: 'POST',
      url: '/api/handoffs',
      body: {"state":"COMPLETED","startTime":"2023-04-25T09:47:11.058Z","endTime":"2023-04-24T14:11:26.992Z"},
    }).then(({ body }) => {
      handoff = body;
    });
  });
   */

  beforeEach(() => {
    cy.intercept('GET', '/api/rate-records+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/rate-records').as('postEntityRequest');
    cy.intercept('DELETE', '/api/rate-records/*').as('deleteEntityRequest');
  });

  /* Disabled due to incompatibility
  beforeEach(() => {
    // Simulate relationships api for better performance and reproducibility.
    cy.intercept('GET', '/api/users', {
      statusCode: 200,
      body: [user],
    });

    cy.intercept('GET', '/api/handoffs', {
      statusCode: 200,
      body: [handoff],
    });

  });
   */

  afterEach(() => {
    if (rateRecord) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/rate-records/${rateRecord.id}`,
      }).then(() => {
        rateRecord = undefined;
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
    if (handoff) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/handoffs/${handoff.id}`,
      }).then(() => {
        handoff = undefined;
      });
    }
  });
   */

  it('RateRecords menu should load RateRecords page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('rate-record');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('RateRecord').should('exist');
    cy.url().should('match', rateRecordPageUrlPattern);
  });

  describe('RateRecord page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(rateRecordPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create RateRecord page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/rate-record/new$'));
        cy.getEntityCreateUpdateHeading('RateRecord');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', rateRecordPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      /* Disabled due to incompatibility
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/rate-records',
          body: {
            ...rateRecordSample,
            rater: user,
            ratee: user,
            handoffRef: handoff,
          },
        }).then(({ body }) => {
          rateRecord = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/rate-records+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [rateRecord],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(rateRecordPageUrl);

        cy.wait('@entitiesRequestInternal');
      });
       */

      beforeEach(function () {
        cy.visit(rateRecordPageUrl);

        cy.wait('@entitiesRequest').then(({ response }) => {
          if (response.body.length === 0) {
            this.skip();
          }
        });
      });

      it('detail button click should load details RateRecord page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('rateRecord');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', rateRecordPageUrlPattern);
      });

      it('edit button click should load edit RateRecord page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('RateRecord');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', rateRecordPageUrlPattern);
      });

      it('edit button click should load edit RateRecord page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('RateRecord');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', rateRecordPageUrlPattern);
      });

      it.skip('last delete button click should delete instance of RateRecord', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('rateRecord').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', rateRecordPageUrlPattern);

        rateRecord = undefined;
      });
    });
  });

  describe('new RateRecord page', () => {
    beforeEach(() => {
      cy.visit(`${rateRecordPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('RateRecord');
    });

    it.skip('should create an instance of RateRecord', () => {
      cy.get(`[data-cy="rateValue"]`).type('3').should('have.value', '3');

      cy.get(`[data-cy="rater"]`).select(1);
      cy.get(`[data-cy="ratee"]`).select(1);
      cy.get(`[data-cy="handoffRef"]`).select(1);

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        rateRecord = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', rateRecordPageUrlPattern);
    });
  });
});
