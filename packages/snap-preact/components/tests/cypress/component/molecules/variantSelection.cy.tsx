import { VariantSelection } from '../../../../src/components/Molecules/VariantSelection';
import { mount } from '@cypress/react';
import { RecommendationStore, VariantSelection as VariantSelectionType } from '@searchspring/snap-store-mobx';
import { UrlManager, QueryStringTranslator, reactLinker } from '@searchspring/snap-url-manager';
import { Tracker } from '@searchspring/snap-tracker';
import { EventManager } from '@searchspring/snap-event-manager';
import { Profiler } from '@searchspring/snap-profiler';
import { Logger } from '@searchspring/snap-logger';
import { Client } from '@searchspring/snap-client';
import { RecommendationController } from '@searchspring/snap-controller';
import json from '../../fixtures/results-bundle.json';
import profile from '../../fixtures/profile-bundle.json';

const globals = { siteId: '8uyt2m' };

const recommendConfig = {
	id: 'search',
	tag: 'bundle',
	globals: {
		products: ['C-AD-W1-1869P'],
	},
	settings: {
		variants: {
			field: 'ss_variants',
		},
	},
};

const urlManager = new UrlManager(new QueryStringTranslator(), reactLinker);
const services = {
	urlManager,
};

const client = new Client(globals, {});

const controller = new RecommendationController(recommendConfig, {
	client: client,
	store: new RecommendationStore(recommendConfig, services),
	urlManager,
	eventManager: new EventManager(),
	profiler: new Profiler(),
	logger: new Logger(),
	tracker: new Tracker(globals, { mode: 'development' }),
});

// const theme = {
// 	components: {
// 		variantSelection: {
// 			className: 'classy',
// 		},
// 	},
// };

let selection: VariantSelectionType;

describe('VariantSelection Component', async () => {
	before(async () => {
		cy.intercept('*recommend*', json);
		cy.intercept('*profile*', profile);
		await controller.search();

		selection = controller.store.results[0].variants?.selections[1]!;
	});

	describe('Dropdown VariantSelection', () => {
		it('renders as dropdown by default', () => {
			mount(<VariantSelection selection={selection} />);
			cy.get('.ss__variant-selection').should('exist');
			cy.get('.ss__variant-selection--dropdown').should('exist');
		});

		it('renders as dropdown with type', () => {
			mount(<VariantSelection selection={selection} type={'dropdown'} />);
			cy.get('.ss__variant-selection').should('exist');
			cy.get('.ss__variant-selection--dropdown').should('exist');

			cy.get('.ss__variant-selection__option').should('not.have.length');

			cy.get('.ss__dropdown__button-wrapper').click();

			cy.wait(100);

			cy.get('.ss__variant-selection__option').should('have.length', selection.values.length);
		});
	});

	describe('List VariantSelection', () => {
		it('renders as list with type', () => {
			mount(<VariantSelection selection={selection} type={'list'} />);
			cy.get('.ss__variant-selection__list').should('exist');
			cy.get('.ss__list__option').should('have.length', selection.values.length);
		});
	});

	describe('swatches VariantSelection', () => {
		it('renders as swatch with type', () => {
			selection = controller.store.results[0].variants?.selections[0]!;
			mount(<VariantSelection selection={selection} type={'swatches'} />);
			cy.get('.ss__variant-selection__swatches').should('exist');
			cy.get('.ss__swatches__carousel__swatch').should('have.length', selection.values.length);
		});
	});
});
