const config = {
	url: 'https://localhost:2222/templates',
	selectors: {
		titleElem: '.ss__search-header__title',
	},
};

describe('Theme styling works', () => {
	it('can pass stylescript to theme', () => {
		const obj = {
			customStyles: (theme) => {
				const { variables } = theme;
				return {
					'.ss__result': {
						backgroundColor: 'rgb(128, 0, 128)',
					},
				};
			},
		};

		cy.on('window:before:load', (win) => {
			cy.spy(obj, 'customStyles').as('styleScript');

			win.mergeSnapConfig = {
				theme: {
					extends: 'bocachica',
					style: obj.customStyles,
					variables: {
						breakpoints: { mobile: 767, tablet: 991, desktop: 1299 },
						colors: {
							accent: '#3a23ad',
							primary: '#202223',
							secondary: '#6d7175',
							text: '#222222',
						},
					},
				},
				search: {
					targets: [
						{
							selector: '#searchspring-layout',
							component: 'Search',
						},
					],
				},
			};
		});

		cy.visit('https://localhost:2222/templates/');

		cy.snapController().then(({ store }) => {
			expect(obj.customStyles).to.be.called;
			expect(obj.customStyles).to.be.calledWithMatch();
			cy.get('@styleScript').should('have.been.calledWithMatch', {
				name: 'global',
				variables: {
					breakpoints: { mobile: 767, tablet: 991, desktop: 1299 },
					colors: {
						accent: '#3a23ad',
						primary: '#202223',
						secondary: '#6d7175',
						text: '#222222',
					},
				},
			});

			cy.get('.ss__result').should('have.css', 'backgroundColor', 'rgb(128, 0, 128)');
		});
	});

	it('stylescripts pass custom variables to theme', () => {
		const obj = {
			customStyles: (theme) => {
				const { variables } = theme;
				return {
					'.ss__result': {
						backgroundColor: variables.colors.primary,
					},
				};
			},
		};

		cy.on('window:before:load', (win) => {
			cy.spy(obj, 'customStyles').as('styleScript');

			win.mergeSnapConfig = {
				theme: {
					extends: 'bocachica',
					style: obj.customStyles,
					variables: {
						breakpoints: { mobile: 540, tablet: 767, desktop: 1200 },
						colors: {
							text: 'rgb(22, 22, 255)',
							primary: 'rgb(33, 33, 255)',
							secondary: 'rgb(44, 44, 255)',
							accent: 'rgb(55, 55, 255)',
						},
					},
				},
				search: {
					targets: [
						{
							selector: '#searchspring-layout',
							component: 'Search',
						},
					],
				},
			};
		});

		cy.visit('https://localhost:2222/templates/');

		cy.snapController().then(({ store }) => {
			expect(obj.customStyles).to.be.called;
			expect(obj.customStyles).to.be.calledWithMatch();
			cy.get('@styleScript').should('have.been.calledWithMatch', {
				name: 'global',
				variables: {
					breakpoints: { mobile: 540, tablet: 767, desktop: 1200 },
					colors: {
						text: 'rgb(22, 22, 255)',
						primary: 'rgb(33, 33, 255)',
						secondary: 'rgb(44, 44, 255)',
						accent: 'rgb(55, 55, 255)',
					},
				},
			});

			cy.get('.ss__result').should('have.css', 'backgroundColor', 'rgb(33, 33, 255)');
		});
	});
});
