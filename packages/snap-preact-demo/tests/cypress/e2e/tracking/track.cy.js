describe('Tracking Beacon 2.0', () => {
	beforeEach(() => {
		cy.clearCookies();
		cy.clearAllLocalStorage();
		cy.on('window:before:load', (win) => {
			win.mergeSnapConfig = {
				mode: 'production',
			};
		});
	});

	it('tracked shopper login and context data', () => {
		cy.visit('https://localhost:2222');

		cy.wait(`@beacon2/shopper/login`).then(({ request, response }) => {
			const { context } = JSON.parse(request.body);
			expect(context).to.have.property('shopperId').to.be.a('string');
			expect(context).to.have.property('initiator').to.be.a('string');
			expect(context).to.have.property('pageLoadId').to.be.a('string');
			expect(context).to.have.property('pageUrl').to.be.a('string');
			expect(context).to.have.property('sessionId').to.be.a('string');
			expect(context).to.have.property('timestamp').to.be.a('string');
			expect(context).to.have.property('userId').to.be.a('string');
			expect(context).not.to.have.property('userAgent').to.be.a('string');
			expect(context).not.to.have.property('attribution');
			expect(context).not.to.have.property('currency');
			expect(context).not.to.have.property('dev');

			expect(response.body).to.have.property('success').to.equal(true);
		});
	});

	it('has context data with currency, attribution', () => {
		cy.visit('https://localhost:2222/category.html?ss_attribution=email:emailTag');

		cy.wait(`@beacon2/shopper/login`).then(({ request, response }) => {
			const { context } = JSON.parse(request.body);
			expect(context).to.have.property('shopperId').to.be.a('string');
			expect(context).to.have.property('initiator').to.be.a('string');
			expect(context).to.have.property('pageLoadId').to.be.a('string');
			expect(context).to.have.property('pageUrl').to.be.a('string');
			expect(context).to.have.property('sessionId').to.be.a('string');
			expect(context).to.have.property('timestamp').to.be.a('string');
			expect(context).not.to.have.property('userAgent').to.be.a('string');
			expect(context).to.have.property('userId').to.be.a('string');
			expect(context).to.have.property('attribution').to.be.an('array').length(1);
			expect(context.attribution[0]).to.have.property('type').to.equal('email');
			expect(context.attribution[0]).to.have.property('id').to.equal('emailTag');

			expect(context).to.have.property('currency').to.be.an('object').and.to.have.property('code').to.equal('EUR');

			expect(response.body).to.have.property('success').to.equal(true);
		});
	});

	it('tracked search render, impression, clickthrough', () => {
		cy.visit('https://localhost:2222');
		let initialContext;
		cy.waitForBundle().then(() => {
			cy.snapController().then((controller) => {
				const results = controller.store.results.filter((result) => result.type === 'product');
				expect(results.length).to.be.greaterThan(0);

				cy.wait(`@beacon2/search/render`).then(({ request, response }) => {
					expect(response.body).to.have.property('success').to.equal(true);

					const { context, data } = JSON.parse(request.body);
					expect(context).to.be.an('object');

					// save context values for later assertions
					initialContext = { ...context };

					expect(data).to.have.property('results').to.be.an('array').length(results.length); // all results are rendered
					expect(data.results[0]).to.have.property('uid').to.be.a('string');
					expect(data).to.have.property('merchandising').to.be.an('object');
					expect(data).to.have.property('pagination').to.be.an('object');
					expect(data).to.not.have.property('sort');
					expect(data).to.have.property('q').to.be.a('string');

					cy.wait(`@beacon2/search/impression`).then(({ request, response }) => {
						expect(response.body).to.have.property('success').to.equal(true);

						const { context, data } = JSON.parse(request.body);
						expect(data).to.have.property('results').to.be.an('array').length(4); // first 4 results are visible on the page

						// assert context values are the same as the initial values
						expect(context).to.be.an('object');
						expect(context.initiator).to.equal(initialContext.initiator);
						// expect(context.pageLoadId).to.equal(initialContext.pageLoadId);
						expect(context.pageUrl).to.equal(initialContext.pageUrl);
						expect(context.sessionId).to.equal(initialContext.sessionId);
						expect(context.shopperId).to.equal(initialContext.shopperId);
						expect(context.timestamp).not.to.equal(initialContext.timestamp); // timestamp should be different
						expect(context.userAgent).to.equal(initialContext.userAgent);
						expect(context.userId).to.equal(initialContext.userId);
						expect(context.pageLoadId).to.equal(initialContext.pageLoadId);

						// reload page to generate new context
						cy.visit('https://localhost:2222?differentPageUrl=1');

						cy.waitForBundle().then(() => {
							cy.snapController().then((controller) => {
								const firstResult = controller.store.results.find((result) => result.type === 'product');
								const pagination = controller.store.pagination;
								const merchandising = controller.store.merchandising;
								expect(firstResult).to.exist;
								expect(pagination).to.exist;
								expect(merchandising).to.exist;

								// Click on first product
								cy.get(`.ss__result a[href='${firstResult.mappings.core.url}']`).first().click({ force: true });

								cy.wait(`@beacon2/search/clickthrough`).then(({ request, response }) => {
									expect(response.body).to.have.property('success').to.equal(true);

									const { context, data } = JSON.parse(request.body);

									// assert clickthrough data is correct product that was clicked
									expect(data).to.have.property('results').to.be.an('array').length(1);
									expect(data.results[0]).to.have.property('uid').to.be.a('string').and.to.equal(firstResult.mappings.core.uid);
									expect(data.results[0]).to.have.property('sku').to.be.a('string').and.to.equal(firstResult.mappings.core.sku);

									// assert data doesn't have other properties
									expect(JSON.stringify(data)).to.equal(
										JSON.stringify({
											q: '',
											pagination: {
												totalResults: pagination.totalResults,
												page: pagination.page,
												resultsPerPage: pagination.pageSize,
											},
											merchandising: {
												redirect: merchandising.redirect,
												personalized: merchandising.personalized,
											},
											results: [
												{
													uid: firstResult.mappings.core.uid,
													sku: firstResult.mappings.core.sku,
												},
											],
										})
									);

									// assert context values are different after page reload
									expect(context).to.be.an('object');
									expect(context.initiator).to.equal(initialContext.initiator);
									expect(context.pageLoadId).to.not.equal(initialContext.pageLoadId); // pageLoadId should be different
									expect(context.pageUrl).to.not.equal(initialContext.pageUrl); // pageUrl should be different
									expect(context.sessionId).to.equal(initialContext.sessionId);
									expect(context.shopperId).to.equal(initialContext.shopperId);
									expect(context.timestamp).not.to.equal(initialContext.timestamp); // timestamp should be different
									expect(context.userAgent).to.equal(initialContext.userAgent);
									expect(context.userId).to.equal(initialContext.userId);
								});
							});
						});
					});
				});
			});
		});
	});

	it('tracked category render, impression, clickthrough', () => {
		cy.visit('https://localhost:2222/category.html');

		cy.wait(`@beacon2/category/render`).then(({ request, response }) => {
			expect(response.body).to.have.property('success').to.equal(true);

			const { context, data } = JSON.parse(request.body);
			expect(context).to.be.an('object');
			expect(data).to.have.property('results').to.be.an('array').length.greaterThan(0);
			expect(data).not.to.have.property('q');

			expect(data).to.have.property('bgfilter').to.be.an('array').length.greaterThan(0);
		});

		cy.wait(`@beacon2/category/impression`, { timeout: 10000 }).its('response.statusCode').should('eq', 200);

		// Click on first product
		cy.get('.ss__result a').first().click({ force: true });

		cy.wait(`@beacon2/category/clickthrough`).its('response.statusCode').should('eq', 200);
	});

	it('tracked autocomplete render, impression, clickthrough', () => {
		cy.visit('https://localhost:2222');
		cy.get('input[name="q"]').type('s');

		cy.wait(`@beacon2/autocomplete/render`).then(({ request, response }) => {
			expect(response.body).to.have.property('success').to.equal(true);

			const { context, data } = JSON.parse(request.body);
			expect(context).to.be.an('object');
			expect(data).to.have.property('results').to.be.an('array').length.greaterThan(0);
			expect(data.results[0]).to.have.property('uid').to.be.a('string');
			expect(data).to.have.property('merchandising').to.be.an('object');
			expect(data).to.have.property('pagination').to.be.an('object');
			expect(data).to.not.have.property('sort');
		});

		cy.wait(`@beacon2/autocomplete/impression`, { timeout: 10000 }).then(({ request, response }) => {
			expect(response.body).to.have.property('success').to.equal(true);

			const { data } = JSON.parse(request.body);
			expect(data).to.have.property('results').to.be.an('array').length.greaterThan(0);
		});

		// Click on first product
		cy.get('.ss__autocomplete .ss__result a').first().click({ force: true });

		cy.wait(`@beacon2/autocomplete/clickthrough`).then(({ request, response }) => {
			expect(response.body).to.have.property('success').to.equal(true);

			const { data } = JSON.parse(request.body);
			expect(data).to.have.property('results').to.be.an('array').length(1);
		});
	});

	it('tracked recommendation render, impression, clickthrough', () => {
		cy.visit('https://localhost:2222/product.html');

		cy.scrollTo('bottom'); // Scroll down to trigger render in viewport
		cy.wait(`@beacon2/recommendations/render`).then(({ request, response }) => {
			expect(response.body).to.have.property('success').to.equal(true);

			const { context, data } = JSON.parse(request.body);
			expect(context).to.be.an('object');
			expect(data).to.have.property('results').to.be.an('array').length.greaterThan(0);
			expect(data).to.have.property('tag').to.be.a('string').and.to.not.be.empty;
		});

		cy.wait(2000);
		cy.scrollTo('bottom'); // Scroll down to trigger impressions

		cy.wait(`@beacon2/recommendations/impression`, { timeout: 10000 }).then(({ request, response }) => {
			expect(response.body).to.have.property('success').to.equal(true);

			const { data } = JSON.parse(request.body);
			expect(data).to.have.property('results').to.be.an('array').length.greaterThan(0);
			expect(data).to.have.property('tag').to.be.a('string').and.to.not.be.empty;
		});

		// Click on first product
		cy.get('.ss__recommendation .ss__result a').first().click({ force: true });

		cy.wait(`@beacon2/recommendations/clickthrough`).then(({ request, response }) => {
			expect(response.body).to.have.property('success').to.equal(true);

			const { data } = JSON.parse(request.body);
			expect(data).to.have.property('results').to.be.an('array').length(1);
			expect(data).to.have.property('tag').to.be.a('string').and.to.not.be.empty;
		});
	});

	it('tracked recommendation addToCart', () => {
		cy.visit('https://localhost:2222/bundle.html');

		cy.scrollTo('bottom'); // Scroll down to trigger render in viewport
		cy.wait(`@beacon2/recommendations/render`).its('response.statusCode').should('eq', 200);

		cy.wait(2000);
		cy.scrollTo('bottom'); // Scroll down to trigger impressions

		cy.wait(`@beacon2/recommendations/impression`, { timeout: 10000 }).its('response.statusCode').should('eq', 200);

		cy.get('.ss__recommendation-bundle__wrapper__cta__button').click({ force: true });

		cy.wait(`@beacon2/recommendations/addtocart`).then(({ request, response }) => {
			expect(response.body).to.have.property('success').to.equal(true);

			const { data } = JSON.parse(request.body);
			expect(data).to.have.property('results').to.be.an('array').length.greaterThan(0);
			expect(data.results[0]).to.have.property('uid').to.be.a('string');
			expect(data.results[0]).to.have.property('price').to.be.a('number');
			expect(data.results[0]).to.have.property('qty').to.be.a('number');

			expect(data).to.have.property('tag').to.be.a('string').and.to.not.be.empty;
		});

		// Click on first product
		cy.get('.ss__recommendation-bundle .ss__result a').first().click({ force: true });

		cy.wait(`@beacon2/recommendations/clickthrough`).its('response.statusCode').should('eq', 200);
	});

	it('tracked page view', () => {
		cy.visit('https://localhost:2222/product.html');
		cy.wait(`@beacon2/product/pageview`).then(({ request, response }) => {
			expect(response.body).to.have.property('success').to.equal(true);

			const { context, data } = JSON.parse(request.body);
			expect(context).to.be.an('object');
			expect(data).to.have.property('result').to.be.an('object');
			expect(data.result).to.have.property('uid').to.be.a('string');
		});
	});

	it('tracked order transaction', () => {
		cy.visit('https://localhost:2222/order.html');
		cy.wait(`@beacon2/order/transaction`).then(({ request, response }) => {
			expect(response.body).to.have.property('success').to.equal(true);

			const { context, data } = JSON.parse(request.body);
			expect(context).to.be.an('object');
			expect(data).to.have.property('results').to.be.an('array').length.greaterThan(0);
			expect(data.results[0]).to.have.property('uid').to.be.a('string');
			expect(data.results[0]).to.have.property('price').to.be.a('number');
			expect(data.results[0]).to.have.property('qty').to.be.a('number');

			expect(data).to.have.property('orderId').to.be.a('string').and.to.not.be.empty;
			expect(data).to.have.property('total').to.be.a('number').greaterThan(0);
			expect(data).to.have.property('transactionTotal').to.be.a('number').greaterThan(0);
		});
	});

	it('tracked log snap', () => {
		cy.visit('https://localhost:2222?dev=0');

		cy.snapController().then((controller) => {
			controller.tracker.events.error.snap({ data: { message: 'test' } });
		});

		cy.wait(`@beacon2/log/snap`).then(({ request, response }) => {
			expect(response.body).to.have.property('success').to.equal(true);

			const { context, data } = JSON.parse(request.body);
			expect(context).to.be.an('object');
			expect(data).to.have.property('message').to.be.a('string').to.equal('test');
		});
	});
});
