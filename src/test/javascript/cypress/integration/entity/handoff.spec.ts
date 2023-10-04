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

describe('Handoff e2e test', () => {
  const handoffPageUrl = '/handoff';
  const handoffPageUrlPattern = new RegExp('/handoff(\\?.*)?$');
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
    cy.intercept('GET', '/api/handoffs+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/handoffs').as('postEntityRequest');
    cy.intercept('DELETE', '/api/handoffs/*').as('deleteEntityRequest');
  });

  it('should load Handoffs', () => {
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

  it('should load details Handoff page', function () {
    cy.visit(handoffPageUrl);
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        this.skip();
      }
    });
    cy.get(entityDetailsButtonSelector).first().click({ force: true });
    cy.getEntityDetailsHeading('handoff');
    cy.get(entityDetailsBackButtonSelector).click({ force: true });
    cy.wait('@entitiesRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.url().should('match', handoffPageUrlPattern);
  });

  it('should load create Handoff page', () => {
    cy.visit(handoffPageUrl);
    cy.wait('@entitiesRequest');
    cy.get(entityCreateButtonSelector).click({ force: true });
    cy.getEntityCreateUpdateHeading('Handoff');
    cy.get(entityCreateSaveButtonSelector).should('exist');
    cy.get(entityCreateCancelButtonSelector).click({ force: true });
    cy.wait('@entitiesRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.url().should('match', handoffPageUrlPattern);
  });

  it('should load edit Handoff page', function () {
    cy.visit(handoffPageUrl);
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        this.skip();
      }
    });
    cy.get(entityEditButtonSelector).first().click({ force: true });
    cy.getEntityCreateUpdateHeading('Handoff');
    cy.get(entityCreateSaveButtonSelector).should('exist');
    cy.get(entityCreateCancelButtonSelector).click({ force: true });
    cy.wait('@entitiesRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.url().should('match', handoffPageUrlPattern);
  });

  it.skip('should create an instance of Handoff', () => {
    cy.visit(handoffPageUrl);
    cy.get(entityCreateButtonSelector).click({ force: true });
    cy.getEntityCreateUpdateHeading('Handoff');

    cy.get(`[data-cy="state"]`).select('COMPLETED');

    cy.get(`[data-cy="startTime"]`).type('2023-04-24T16:16').should('have.value', '2023-04-24T16:16');

    cy.get(`[data-cy="endTime"]`).type('2023-04-24T09:27').should('have.value', '2023-04-24T09:27');

    cy.setFieldSelectToLastOfEntity('rateToGiver');

    cy.setFieldSelectToLastOfEntity('rateToReceiver');

    cy.setFieldSelectToLastOfEntity('giver');

    cy.setFieldSelectToLastOfEntity('receiver');

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
    cy.url().should('match', handoffPageUrlPattern);
  });

  it.skip('should delete last instance of Handoff', function () {
    cy.visit(handoffPageUrl);
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length > 0) {
        cy.get(entityTableSelector).should('have.lengthOf', response.body.length);
        cy.get(entityDeleteButtonSelector).last().click({ force: true });
        cy.getEntityDeleteDialogHeading('handoff').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click({ force: true });
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', handoffPageUrlPattern);
      } else {
        this.skip();
      }
    });
  });
});
