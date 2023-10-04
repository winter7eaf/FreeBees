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

describe('Item e2e test', () => {
  const itemPageUrl = '/item';
  const itemPageUrlPattern = new RegExp('/item(\\?.*)?$');
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
    cy.intercept('GET', '/api/items+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/items').as('postEntityRequest');
    cy.intercept('DELETE', '/api/items/*').as('deleteEntityRequest');
  });

  it('should load Items', () => {
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

  it('should load details Item page', function () {
    cy.visit(itemPageUrl);
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        this.skip();
      }
    });
    cy.get(entityDetailsButtonSelector).first().click({ force: true });
    cy.getEntityDetailsHeading('item');
    cy.get(entityDetailsBackButtonSelector).click({ force: true });
    cy.wait('@entitiesRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.url().should('match', itemPageUrlPattern);
  });

  it('should load create Item page', () => {
    cy.visit(itemPageUrl);
    cy.wait('@entitiesRequest');
    cy.get(entityCreateButtonSelector).click({ force: true });
    cy.getEntityCreateUpdateHeading('Item');
    cy.get(entityCreateSaveButtonSelector).should('exist');
    cy.get(entityCreateCancelButtonSelector).click({ force: true });
    cy.wait('@entitiesRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.url().should('match', itemPageUrlPattern);
  });

  it('should load edit Item page', function () {
    cy.visit(itemPageUrl);
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        this.skip();
      }
    });
    cy.get(entityEditButtonSelector).first().click({ force: true });
    cy.getEntityCreateUpdateHeading('Item');
    cy.get(entityCreateSaveButtonSelector).should('exist');
    cy.get(entityCreateCancelButtonSelector).click({ force: true });
    cy.wait('@entitiesRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.url().should('match', itemPageUrlPattern);
  });

  it.skip('should create an instance of Item', () => {
    cy.visit(itemPageUrl);
    cy.get(entityCreateButtonSelector).click({ force: true });
    cy.getEntityCreateUpdateHeading('Item');

    cy.get(`[data-cy="title"]`).type('Burg Cotton').should('have.value', 'Burg Cotton');

    cy.get(`[data-cy="description"]`)
      .type('../fake-data/blob/hipster.txt')
      .invoke('val')
      .should('match', new RegExp('../fake-data/blob/hipster.txt'));

    cy.get(`[data-cy="condition"]`).select('USED_LIKE_NEW');

    cy.get(`[data-cy="postcode"]`).type('M68AB').should('have.value', 'M68AB');

    cy.get(`[data-cy="uploadTime"]`).type('2023-03-10T09:24').should('have.value', '2023-03-10T09:24');

    cy.get(`[data-cy="givenTime"]`).type('2023-03-10T14:42').should('have.value', '2023-03-10T14:42');

    cy.get(`[data-cy="state"]`).select('CANCELLED');

    cy.setFieldSelectToLastOfEntity('giver');

    cy.setFieldSelectToLastOfEntity('receiver');

    cy.setFieldSelectToLastOfEntity('tag');

    cy.get(entityCreateSaveButtonSelector).click({ force: true });
    cy.scrollTo('top', { ensureScrollable: false });
    cy.get(entityCreateSaveButtonSelector).should('not.exist');
    cy.wait('@postEntityRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(201);
    });
    cy.wait('@entitiesRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.url().should('match', itemPageUrlPattern);
  });

  it.skip('should delete last instance of Item', function () {
    cy.visit(itemPageUrl);
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length > 0) {
        cy.get(entityTableSelector).should('have.lengthOf', response.body.length);
        cy.get(entityDeleteButtonSelector).last().click({ force: true });
        cy.getEntityDeleteDialogHeading('item').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click({ force: true });
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', itemPageUrlPattern);
      } else {
        this.skip();
      }
    });
  });
});
