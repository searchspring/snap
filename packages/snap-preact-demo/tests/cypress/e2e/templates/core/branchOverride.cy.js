describe('Branch Override Functionality', () => {
	it('adds snap bundle to search page', () => {
		cy.visit('https://localhost:2222/templates/?searchspring-preview=override');

		cy.on('uncaught:exception', (err, runnable) => {
			// expected error due to branch override throwing
			return false;
		});

		// expect injected div from 'override' branch to be on the page
		cy.get('#override').should('exist');

		// expect override pop up to not be an error
		cy.get('.ss__branch-override').should('exist').should('not.have.class', 'ss__branch-override--error');

		// should have branch name in container
		cy.get('.ss__branch-override__bottom__left').should('contain.text', 'override');
	});

	it('can remove an override that has been applied', () => {
		// click the remove button
		cy.get('.ss__branch-override__top__button').click({ force: true });

		cy.waitForBundle().then(() => {
			cy.window().then((window) => {
				expect(window.searchspring).to.exist;
			});
		});

		cy.snapController().then(({ store }) => {
			expect(typeof store).to.equal('object');
		});

		// expect override pop up to be an error
		cy.get('.ss__branch-override').should('not.exist');
	});

	it('breaks when using a non existant branch', () => {
		cy.on('uncaught:exception', (err, runnable) => {
			// expected error due to branch override throwing
			return false;
		});

		// cy.on('uncaught:exception', (err, runnable) => false);
		cy.visit('https://localhost:2222/snap/?searchspring-preview=nope');

		// expect injected div from 'override' branch to not be on the page
		cy.get('#override').should('not.exist');

		// expect override pop up to be an error
		cy.get('.ss__branch-override').should('exist').should('have.class', 'ss__branch-override--error');
	});

	it('can remove an override that has an error', () => {
		// click the remove button
		cy.get('.ss__branch-override__top__button').click({ force: true });

		cy.waitForBundle().then(() => {
			cy.window().then((window) => {
				expect(window.searchspring).to.exist;
			});
		});

		cy.snapController().then(({ store }) => {
			expect(typeof store).to.equal('object');
		});

		// expect override pop up to be an error
		cy.get('.ss__branch-override').should('not.exist');
	});
});
