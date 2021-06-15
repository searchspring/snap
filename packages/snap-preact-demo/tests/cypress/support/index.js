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

	cy.intercept(/.*searchspring.io\/api\/search\/search/).as('search');
	cy.intercept(/.*searchspring.io\/api\/search\/autocomplete/).as('autocomplete');
	cy.intercept(/.*searchspring.io\/api\/meta\/meta/).as('meta');
	cy.intercept(/.*beacon.searchspring.io\/beacon/).as('beacon');
	cy.intercept(/.*a.searchspring.io\/api\/track\/track.json/).as('track');
	cy.intercept(/.*d3cgm8py10hi0z.cloudfront.net\/is.gif/).as('pixel');
});
