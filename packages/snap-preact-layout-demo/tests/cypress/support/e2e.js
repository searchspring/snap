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
	// make references to requests available

	cy.intercept(/.*searchspring.io\/api\/search\/autocomplete.json/).as('autocomplete');
	cy.intercept(/.*searchspring.io\/api\/search\/search.json/).as('search');
	cy.intercept(/.*a.searchspring.io\/api\/track\/track.json/).as('track');
	cy.intercept(/.*d3cgm8py10hi0z.cloudfront.net\/is.gif/).as('pixel');
	Object.keys(BeaconType).forEach((type) => {
		cy.intercept(/.*beacon.searchspring.io\/beacon/, (req) => setAliasForBeaconType(BeaconType[type], req));
	});
});

function setAliasForBeaconType(type, req) {
	if (!Array.isArray(req.body)) {
		req.body = [req.body];
	}

	req.body.forEach((event) => {
		if (event.type == type) {
			req.alias = type;
		}
	});
}
