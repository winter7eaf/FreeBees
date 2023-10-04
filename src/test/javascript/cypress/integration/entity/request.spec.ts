import { entityItemSelector } from '../../support/commands';
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
  const username = Cypress.env('E2E_USERNAME') ?? 'admin';
  const password = Cypress.env('E2E_PASSWORD') ?? 'admin';

  before(() => {
    cy.window().then(win => {
      win.sessionStorage.clear();
    });
    cy.visit('');
    cy.login(username, password);
    cy.get(entityItemSelector).should('exist');
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/requests+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/requests').as('postEntityRequest');
    cy.intercept('DELETE', '/api/requests/*').as('deleteEntityRequest');
  });

  it('should load Requests', () => {
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

  it('should load details Request page', function () {
    cy.visit(requestPageUrl);
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        this.skip();
      }
    });
    cy.get(entityDetailsButtonSelector).first().click({ force: true });
    cy.getEntityDetailsHeading('request');
    cy.get(entityDetailsBackButtonSelector).click({ force: true });
    cy.wait('@entitiesRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.url().should('match', requestPageUrlPattern);
  });

  it('should load create Request page', () => {
    cy.visit(requestPageUrl);
    cy.wait('@entitiesRequest');
    cy.get(entityCreateButtonSelector).click({ force: true });
    cy.getEntityCreateUpdateHeading('Request');
    cy.get(entityCreateSaveButtonSelector).should('exist');
    cy.get(entityCreateCancelButtonSelector).click({ force: true });
    cy.wait('@entitiesRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.url().should('match', requestPageUrlPattern);
  });

  it('should load edit Request page', function () {
    cy.visit(requestPageUrl);
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        this.skip();
      }
    });
    cy.get(entityEditButtonSelector).first().click({ force: true });
    cy.getEntityCreateUpdateHeading('Request');
    cy.get(entityCreateSaveButtonSelector).should('exist');
    cy.get(entityCreateCancelButtonSelector).click({ force: true });
    cy.wait('@entitiesRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.url().should('match', requestPageUrlPattern);
  });

  it.skip('should create an instance of Request', () => {
    cy.visit(requestPageUrl);
    cy.get(entityCreateButtonSelector).click({ force: true });
    cy.getEntityCreateUpdateHeading('Request');

    cy.get(`[data-cy="type"]`).select('REQUEST_TO_GIVE');

    cy.get(`[data-cy="state"]`).select('REJECTED');

    cy.get(`[data-cy="sentTime"]`).type('2023-04-23T19:49').should('have.value', '2023-04-23T19:49');

    cy.get(`[data-cy="expiryTime"]`).type('2023-04-24T08:07').should('have.value', '2023-04-24T08:07');

    cy.get(`[data-cy="responseTime"]`).type('2023-04-24T13:49').should('have.value', '2023-04-24T13:49');

    cy.setFieldSelectToLastOfEntity('requester');

    cy.setFieldSelectToLastOfEntity('requestee');

    cy.setFieldSelectToLastOfEntity('item');

    cy.get(entityCreateSaveButtonSelector).click({ force: true });
    cy.scrollTo('top', { ensureScrollable: false });
    cy.get(entityCreateSaveButtonSelector).should('not.exist');
    cy.wait('@postEntityRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(201);
    });
    cy.wait('@entitiesRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.url().should('match', requestPageUrlPattern);
  });

  it.skip('should delete last instance of Request', function () {
    cy.visit(requestPageUrl);
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length > 0) {
        cy.get(entityTableSelector).should('have.lengthOf', response.body.length);
        cy.get(entityDeleteButtonSelector).last().click({ force: true });
        cy.getEntityDeleteDialogHeading('request').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click({ force: true });
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', requestPageUrlPattern);
      } else {
        this.skip();
      }
    });
  });
});
