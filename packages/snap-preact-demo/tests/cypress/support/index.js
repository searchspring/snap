// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

beforeEach(() => {
	// make references to requests available
	cy.intercept('searchspring.io/api/v1/search').as('search');
	cy.intercept('searchspring.io/api/v1/autocomplete').as('autocomplete');
	cy.intercept('searchspring.io/api/v1/meta').as('meta');
});
