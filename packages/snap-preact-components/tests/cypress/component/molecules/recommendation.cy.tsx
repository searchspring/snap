import 'whatwg-fetch';
import { h } from 'preact';

import { RecommendationStore } from '@searchspring/snap-store-mobx';
import { UrlManager, QueryStringTranslator, reactLinker } from '@searchspring/snap-url-manager';
import { Tracker } from '@searchspring/snap-tracker';
import { EventManager } from '@searchspring/snap-event-manager';
import { Profiler } from '@searchspring/snap-profiler';
import { Logger } from '@searchspring/snap-logger';
import { Client } from '@searchspring/snap-client';
import { RecommendationController } from '@searchspring/snap-controller';
import json from '../../fixtures/recommend-results-default.json';
import profile from '../../fixtures/profile-default.json';
import { Recommendation } from '../../../../src/components/Organisms/Recommendation';
import { mount } from '@cypress/react';
import { ThemeProvider } from '../../../../src/providers';

const globals = { siteId: '8uyt2m' };

const recommendConfig = {
	id: 'search',
	tag: 'trending',
};

const urlManager = new UrlManager(new QueryStringTranslator(), reactLinker);
const services = {
	urlManager,
};

const theme = {
	components: {
		recommendation: {
			prevButton: 'Global Theme Prev',
			nextButton: 'Global Theme Next',
		},
	},
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

describe('Recommendation Component', async () => {
	before(async () => {
		cy.spy(controller.tracker.events.recommendations, 'render').as('render');
		cy.spy(controller.track.product, 'impression').as('impression');
		cy.intercept('*recommend*', json);
		cy.intercept('*profile*', profile);
		await controller.search();
	});

	it('tracks as expected', () => {
		expect(controller.store.loaded).to.be.true;
		expect(controller.store.results.length).to.be.greaterThan(0);

		mount(
			<Recommendation controller={controller} speed={0} lazyRender={{ enabled: false }}>
				{controller.store.results.map((result, idx) => (
					<div className={'findMe'} key={idx}>
						<div className="result">{result.mappings.core?.name}</div>
					</div>
				))}
			</Recommendation>
		);
		cy.get('.ss__recommendation').should('exist');
		cy.get('.ss__recommendation .findMe .result').should('have.length', controller.store.results.length);
		// should be called 20 times (one for each result rendered)
		cy.get('@render').its('callCount').should('eq', 20);
		cy.wait(3000);
		cy.get('@impression').its('callCount').should('eq', 5);
	});

	it('renders with results', () => {
		mount(
			<Recommendation title="hi" controller={controller}>
				{controller.store.results.map((result, idx) => (
					<div className="result" key={idx}>
						{result.mappings.core?.name}
					</div>
				))}
			</Recommendation>
		);
		cy.get('.ss__recommendation').should('exist');
		cy.get('.ss__carousel__prev').should('exist');
		cy.get('.ss__carousel__next').should('exist');
		cy.get('.swiper-slide:not(.swiper-slide-duplicate) .result').should('have.length', 20);
	});

	it('doesnt render with no results', () => {
		mount(
			<Recommendation title="hi" controller={controller} results={[]}>
				{controller.store.results.map((result, idx) => (
					<div className="result" key={idx}>
						{result.mappings.core?.name}
					</div>
				))}
			</Recommendation>
		);

		cy.get('.ss__recommendation').should('not.exist');
		cy.get('.ss__recommendation .ss__recommendation__title').should('not.exist');
	});

	it('can disable styling', () => {
		mount(
			<Recommendation controller={controller} disableStyles>
				{controller.store.results.map((result, idx) => (
					<div className="result" key={idx}>
						{result.mappings.core?.name}
					</div>
				))}
			</Recommendation>
		);

		cy.get('.ss__recommendation').should('exist');
		cy.get('.ss__recommendation').should('satisfy', ($el) => {
			const classList = Array.from($el[0].classList);
			return classList.length == 1;
		});
	});

	it('renders with classname', () => {
		const className = 'classy';

		mount(
			<Recommendation controller={controller} className={className}>
				{controller.store.results.map((result, idx) => (
					<div className="result" key={idx}>
						{result.mappings.core?.name}
					</div>
				))}
			</Recommendation>
		);

		cy.get('.ss__recommendation').should('exist');
		cy.get('.ss__recommendation').should('have.class', className);
	});

	it('is themeable with ThemeProvider', () => {
		mount(
			<ThemeProvider theme={theme}>
				<Recommendation controller={controller}>
					{controller.store.results.map((result, idx) => (
						<div className="findMe" key={idx}>
							{result.mappings.core?.name}
						</div>
					))}
				</Recommendation>
			</ThemeProvider>
		);

		cy.get('.ss__recommendation').should('exist');
		cy.get('.findMe').should('exist');

		const prev = cy.get('.ss__carousel__prev');
		prev.should('exist');
		prev.should('have.text', theme.components.recommendation.prevButton);

		const next = cy.get('.ss__carousel__next');
		next.should('exist');
		next.should('have.text', theme.components.recommendation.nextButton);
	});

	it('is themeable with theme prop', () => {
		mount(
			<Recommendation controller={controller} theme={theme}>
				{controller.store.results.map((result, idx) => (
					<div className="findMe" key={idx}>
						{result.mappings.core?.name}
					</div>
				))}
			</Recommendation>
		);

		cy.get('.ss__recommendation').should('exist');
		cy.get('.findMe').should('exist');

		const prev = cy.get('.ss__carousel__prev');
		prev.should('exist');
		prev.should('have.text', theme.components.recommendation.prevButton);

		const next = cy.get('.ss__carousel__next');
		next.should('exist');
		next.should('have.text', theme.components.recommendation.nextButton);
	});

	it('is themeable with theme prop overrides ThemeProvider', () => {
		const themeOverride = {
			components: {
				recommendation: {
					prevButton: 'Prev Button Yo',
					nextButton: 'Next Button Yo',
				},
			},
		};

		mount(
			<ThemeProvider theme={theme}>
				<Recommendation controller={controller} theme={themeOverride}>
					{controller.store.results.map((result, idx) => (
						<div className="findMe" key={idx}>
							{result.mappings.core?.name}
						</div>
					))}
				</Recommendation>
			</ThemeProvider>
		);

		cy.get('.ss__recommendation').should('exist');
		cy.get('.findMe').should('exist');

		const prev = cy.get('.ss__carousel__prev');
		prev.should('exist');
		prev.should('have.text', themeOverride.components.recommendation.prevButton);
		prev.should('not.have.text', theme.components.recommendation.prevButton);

		const next = cy.get('.ss__carousel__next');
		next.should('exist');
		next.should('have.text', themeOverride.components.recommendation.nextButton);
		next.should('not.have.text', theme.components.recommendation.nextButton);
	});

	it('breakpoints override theme prop', () => {
		// Change the viewport to 1200px.
		cy.viewport(1200, 750);

		const ThemeDetailSlot = () => {
			return <div className="theme-detail-slot">theme details...</div>;
		};

		const BreakPointDetailSlot = () => {
			return <div className="breakpoint-detail-slot">breakpoint details...</div>;
		};

		const componentTheme = {
			components: {
				result: {
					detailSlot: [<ThemeDetailSlot />],
				},
			},
		};

		const customBreakpoints = {
			0: {},
			700: {
				theme: {
					components: {
						result: {
							detailSlot: [<BreakPointDetailSlot />],
						},
					},
				},
			},
		};

		mount(<Recommendation controller={controller} breakpoints={customBreakpoints} theme={componentTheme} />);

		cy.get('.theme-detail-slot').should('have.length', 0);
		cy.get('.breakpoint-detail-slot').should('have.length', 20);

		// Change the viewport to 500px.
		cy.viewport(500, 750);

		cy.get('.theme-detail-slot').should('have.length', 20);
		cy.get('.breakpoint-detail-slot').should('have.length', 0);

		// reset the viewport to 1200px.
		cy.viewport(1200, 750);
	});
});
