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

describe('CharityUser e2e test', () => {
  const charityUserPageUrl = '/charity-user';
  const charityUserPageUrlPattern = new RegExp('/charity-user(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const charityUserSample = {};

  let charityUser;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/charity-users+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/charity-users').as('postEntityRequest');
    cy.intercept('DELETE', '/api/charity-users/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (charityUser) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/charity-users/${charityUser.id}`,
      }).then(() => {
        charityUser = undefined;
      });
    }
  });

  it('CharityUsers menu should load CharityUsers page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('charity-user');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('CharityUser').should('exist');
    cy.url().should('match', charityUserPageUrlPattern);
  });

  describe('CharityUser page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(charityUserPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create CharityUser page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/charity-user/new$'));
        cy.getEntityCreateUpdateHeading('CharityUser');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', charityUserPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/charity-users',
          body: charityUserSample,
        }).then(({ body }) => {
          charityUser = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/charity-users+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [charityUser],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(charityUserPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details CharityUser page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('charityUser');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', charityUserPageUrlPattern);
      });

      it('edit button click should load edit CharityUser page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('CharityUser');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', charityUserPageUrlPattern);
      });

      it('edit button click should load edit CharityUser page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('CharityUser');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', charityUserPageUrlPattern);
      });

      it('last delete button click should delete instance of CharityUser', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('charityUser').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', charityUserPageUrlPattern);

        charityUser = undefined;
      });
    });
  });

  describe('new CharityUser page', () => {
    beforeEach(() => {
      cy.visit(`${charityUserPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('CharityUser');
    });

    it('should create an instance of CharityUser', () => {
      cy.get(`[data-cy="charityName"]`).type('EXE ADP').should('have.value', 'EXE ADP');

      cy.get(`[data-cy="description"]`)
        .type('../fake-data/blob/hipster.txt')
        .invoke('val')
        .should('match', new RegExp('../fake-data/blob/hipster.txt'));

      cy.get(`[data-cy="logoURL"]`).type('Centers').should('have.value', 'Centers');

      cy.get(`[data-cy="website"]`).type('Island partnerships Nevada').should('have.value', 'Island partnerships Nevada');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        charityUser = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', charityUserPageUrlPattern);
    });
  });
});
