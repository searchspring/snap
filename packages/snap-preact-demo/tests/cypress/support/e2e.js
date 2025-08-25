// ***********************************************
// Custom Snap Cypress Configuration
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************

// Import commands.js using ES2015 syntax:
import './commands';
import './custom';
import { ignoredErrors } from './custom';

import { BeaconType } from '@searchspring/snap-tracker';

// ignore 3rd party uncaught exceptions - but not bundle exceptions
Cypress.on('uncaught:exception', (err) => {
	if (ignoredErrors?.length) {
		for (let i = 0; i < ignoredErrors.length; i++) {
			const checkFor = new RegExp(ignoredErrors[i].replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
			if (err.stack.match(checkFor)) {
				return false;
			}
		}
	}

	if (err.stack.match(/\/\/localhost:\d+\/bundle\./)) {
		return true;
	}

	return false;
});

beforeEach(() => {
	cy.intercept('GET', /.*searchspring.io\/api\/search\/autocomplete.json/).as('autocomplete');
	cy.intercept('GET', /.*searchspring.io\/api\/search\/search.json/).as('search');
	cy.intercept('POST', /beacon.searchspring.io\/beacon\/v2\/.*\/shopper\/login/, { success: true }).as('beacon2/shopper/login');
	cy.intercept('POST', /beacon.searchspring.io\/beacon\/v2\/.*\/autocomplete\/render/, { success: true }).as('beacon2/autocomplete/render');
	cy.intercept('POST', /beacon.searchspring.io\/beacon\/v2\/.*\/autocomplete\/impression/, { success: true }).as('beacon2/autocomplete/impression');
	cy.intercept('POST', /beacon.searchspring.io\/beacon\/v2\/.*\/autocomplete\/addtocart/, { success: true }).as('beacon2/autocomplete/addtocart');
	cy.intercept('POST', /beacon.searchspring.io\/beacon\/v2\/.*\/autocomplete\/clickthrough/, { success: true }).as(
		'beacon2/autocomplete/clickthrough'
	);
	cy.intercept('POST', /beacon.searchspring.io\/beacon\/v2\/.*\/autocomplete\/redirect/, { success: true }).as('beacon2/autocomplete/redirect');
	cy.intercept('POST', /beacon.searchspring.io\/beacon\/v2\/.*\/search\/render/, { success: true }).as('beacon2/search/render');
	cy.intercept('POST', /beacon.searchspring.io\/beacon\/v2\/.*\/search\/impression/, { success: true }).as('beacon2/search/impression');
	cy.intercept('POST', /beacon.searchspring.io\/beacon\/v2\/.*\/search\/addtocart/, { success: true }).as('beacon2/search/addtocart');
	cy.intercept('POST', /beacon.searchspring.io\/beacon\/v2\/.*\/search\/clickthrough/, { success: true }).as('beacon2/search/clickthrough');
	cy.intercept('POST', /beacon.searchspring.io\/beacon\/v2\/.*\/search\/redirect/, { success: true }).as('beacon2/search/redirect');
	cy.intercept('POST', /beacon.searchspring.io\/beacon\/v2\/.*\/category\/render/, { success: true }).as('beacon2/category/render');
	cy.intercept('POST', /beacon.searchspring.io\/beacon\/v2\/.*\/category\/impression/, { success: true }).as('beacon2/category/impression');
	cy.intercept('POST', /beacon.searchspring.io\/beacon\/v2\/.*\/category\/addtocart/, { success: true }).as('beacon2/category/addtocart');
	cy.intercept('POST', /beacon.searchspring.io\/beacon\/v2\/.*\/category\/clickthrough/, { success: true }).as('beacon2/category/clickthrough');
	cy.intercept('POST', /beacon.searchspring.io\/beacon\/v2\/.*\/recommendations\/render/, { success: true }).as('beacon2/recommendations/render');
	cy.intercept('POST', /beacon.searchspring.io\/beacon\/v2\/.*\/recommendations\/impression/, { success: true }).as(
		'beacon2/recommendations/impression'
	);
	cy.intercept('POST', /beacon.searchspring.io\/beacon\/v2\/.*\/recommendations\/addtocart/, { success: true }).as(
		'beacon2/recommendations/addtocart'
	);
	cy.intercept('POST', /beacon.searchspring.io\/beacon\/v2\/.*\/recommendations\/clickthrough/, { success: true }).as(
		'beacon2/recommendations/clickthrough'
	);
	cy.intercept('POST', /beacon.searchspring.io\/beacon\/v2\/.*\/product\/pageview/, { success: true }).as('beacon2/product/pageview');
	cy.intercept('POST', /beacon.searchspring.io\/beacon\/v2\/.*\/cart\/add/, { success: true }).as('beacon2/cart/add');
	cy.intercept('POST', /beacon.searchspring.io\/beacon\/v2\/.*\/cart\/remove/, { success: true }).as('beacon2/cart/remove');
	cy.intercept('POST', /beacon.searchspring.io\/beacon\/v2\/.*\/order\/transaction/, { success: true }).as('beacon2/order/transaction');
	cy.intercept('POST', /beacon.searchspring.io\/beacon\/v2\/.*\/log\/snap/, { success: true }).as('beacon2/log/snap');
});
