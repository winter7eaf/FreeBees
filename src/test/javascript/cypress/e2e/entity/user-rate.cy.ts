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

describe('UserRate e2e test', () => {
  const userRatePageUrl = '/user-rate';
  const userRatePageUrlPattern = new RegExp('/user-rate(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  // const userRateSample = {"rateAsGiver":6,"rateAsReceiver":3};

  let userRate;
  // let user;

  beforeEach(() => {
    cy.login(username, password);
  });

  /* Disabled due to incompatibility
  beforeEach(() => {
    // create an instance at the required relationship entity:
    cy.authenticatedRequest({
      method: 'POST',
      url: '/api/users',
      body: {"login":"morph program","firstName":"Theodora","lastName":"Hackett"},
    }).then(({ body }) => {
      user = body;
    });
  });
   */

  beforeEach(() => {
    cy.intercept('GET', '/api/user-rates+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/user-rates').as('postEntityRequest');
    cy.intercept('DELETE', '/api/user-rates/*').as('deleteEntityRequest');
  });

  /* Disabled due to incompatibility
  beforeEach(() => {
    // Simulate relationships api for better performance and reproducibility.
    cy.intercept('GET', '/api/users', {
      statusCode: 200,
      body: [user],
    });

  });
   */

  afterEach(() => {
    if (userRate) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/user-rates/${userRate.id}`,
      }).then(() => {
        userRate = undefined;
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
  });
   */

  it('UserRates menu should load UserRates page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('user-rate');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('UserRate').should('exist');
    cy.url().should('match', userRatePageUrlPattern);
  });

  describe('UserRate page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(userRatePageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create UserRate page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/user-rate/new$'));
        cy.getEntityCreateUpdateHeading('UserRate');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', userRatePageUrlPattern);
      });
    });

    describe('with existing value', () => {
      /* Disabled due to incompatibility
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/user-rates',
          body: {
            ...userRateSample,
            user: user,
          },
        }).then(({ body }) => {
          userRate = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/user-rates+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [userRate],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(userRatePageUrl);

        cy.wait('@entitiesRequestInternal');
      });
       */

      beforeEach(function () {
        cy.visit(userRatePageUrl);

        cy.wait('@entitiesRequest').then(({ response }) => {
          if (response.body.length === 0) {
            this.skip();
          }
        });
      });

      it('detail button click should load details UserRate page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('userRate');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', userRatePageUrlPattern);
      });

      it('edit button click should load edit UserRate page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('UserRate');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', userRatePageUrlPattern);
      });

      it('edit button click should load edit UserRate page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('UserRate');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', userRatePageUrlPattern);
      });

      it.skip('last delete button click should delete instance of UserRate', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('userRate').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', userRatePageUrlPattern);

        userRate = undefined;
      });
    });
  });

  describe('new UserRate page', () => {
    beforeEach(() => {
      cy.visit(`${userRatePageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('UserRate');
    });

    it.skip('should create an instance of UserRate', () => {
      cy.get(`[data-cy="rateAsGiver"]`).type('9').should('have.value', '9');

      cy.get(`[data-cy="rateAsReceiver"]`).type('5').should('have.value', '5');

      cy.get(`[data-cy="user"]`).select(1);

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        userRate = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', userRatePageUrlPattern);
    });
  });
});
