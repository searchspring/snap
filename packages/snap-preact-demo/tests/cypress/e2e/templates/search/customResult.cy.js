const config = {
	url: 'https://localhost:2222/templates',
	selectors: {
		search: {
			selector: '#searchspring-layout',
			// selector of the wrapping element. Expects child element to contain <a>
			search: `.ss__search`,
			result: '.ss__result',
			customResult: '.ss__custom-result',
		},
	},
};

describe('Custom Result Compnent', () => {
	beforeEach(() => {
		cy.on('window:before:load', (win) => {
			win.mergeSnapConfig = {
				search: {
					targets: [
						{
							selector: '#searchspring-layout',
							component: 'Search',
							resultComponent: 'CustomResult',
						},
					],
				},
			};
		});

		cy.visit('https://localhost:2222/templates/');
	});

	it('renders with custom result component', () => {
		cy.snapController().then(({ store }) => {
			cy.get(config?.selectors?.search.selector).should('exist');
			cy.get(config?.selectors?.search.result).should('not.exist');
			cy.get(`${config?.selectors?.search.selector} ${config?.selectors?.search.search} ${config?.selectors?.search.customResult}`)
				.should('exist')
				.should('have.length', store.results.length);
		});
	});

	it('can click on a result and go to that page', function () {
		cy.document().then((doc) => {
			cy.snapController().then(({ store }) => {
				cy.get(config?.selectors?.search.customResult).should('exist');
				let url = doc.querySelector(`${config?.selectors?.search.customResult} a`).attributes?.href?.value;
				cy.get(`${config?.selectors?.search.customResult} a`)
					.first()
					.click()
					.then(() => {
						cy.location('pathname').should('include', url);
					});
			});
		});
	});
});
