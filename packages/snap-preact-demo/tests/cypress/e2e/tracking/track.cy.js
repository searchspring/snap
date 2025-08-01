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
	it('tracked shopper login', () => {
		cy.visit('https://localhost:2222/snap');

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
		cy.visit('https://localhost:2222/snap/category.html?ss_attribution=email:emailTag');

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
		cy.visit('https://localhost:2222/snap/');
		new Cypress.Promise.all([cy.wait(`@beacon2/search/render`), cy.wait(`@beacon2/search/impression`)])
			.then(([render, impression]) => {
				expect(render.response.body).to.have.property('success').to.equal(true);
				const { context: context1, data: data1 } = JSON.parse(render.request.body);
				expect(context1).to.be.an('object');
				expect(data1).to.have.property('results').to.be.an('array');
				cy.get('.ss__result').should('have.length', data1.results.length); // all results are rendered
				expect(data1.results[0]).to.have.property('uid').to.be.a('string');
				expect(data1).to.have.property('merchandising').to.be.an('object');
				expect(data1).to.have.property('pagination').to.be.an('object');
				expect(data1).to.not.have.property('sort');
				expect(data1).to.have.property('q').to.be.a('string');

				expect(impression.response.body).to.have.property('success').to.equal(true);
				const { data: data2, context: context2 } = JSON.parse(impression.request.body);
				expect(data2).to.have.property('results').to.be.an('array').length(4); // first 4 results are visible on the page
				// assert context values are the same as the initial values
				expect(context2).to.be.an('object');
				expect(context2.initiator).to.equal(context1.initiator);
				expect(context2.pageLoadId).to.equal(context1.pageLoadId);
				expect(context2.pageUrl).to.equal(context1.pageUrl);
				expect(context2.sessionId).to.equal(context1.sessionId);
				expect(context2.shopperId).to.equal(context1.shopperId);
				expect(context2.timestamp).not.to.equal(context1.timestamp); // timestamp should be different
				expect(context2.userAgent).to.equal(context1.userAgent);
				expect(context2.userId).to.equal(context1.userId);
				expect(context2.pageLoadId).to.equal(context1.pageLoadId);
				return { context1 }; // return the context values to be used in the next test
			})
			.then(({ context1 }) => {
				// reload page to generate new context
				cy.visit('https://localhost:2222/snap/?differentPageUrl=1');
				cy.waitForBundle().then(() => {
					cy.snapController().then((controller) => {
						const firstResult = controller.store.results.find((result) => result.type === 'product');
						const pagination = controller.store.pagination;
						const merchandising = controller.store.merchandising;
						expect(firstResult).to.exist;
						expect(pagination).to.exist;
						expect(merchandising).to.exist;

						cy.wait(1000);
						// Click on first product
						cy.get(`.ss__result a[href='${firstResult.mappings.core.url}']`).first().click({ force: true });

						cy.wait(`@beacon2/search/clickthrough`).then((clickthrough) => {
							expect(clickthrough.response.body).to.have.property('success').to.equal(true);

							const { context: context3, data: data3 } = JSON.parse(clickthrough.request.body);

							// assert clickthrough data is correct product that was clicked
							expect(data3).to.have.property('results').to.be.an('array').length(1);
							expect(data3.results[0]).to.have.property('uid').to.be.a('string').and.to.equal(firstResult.mappings.core.uid);
							expect(data3.results[0]).to.have.property('sku').to.be.a('string').and.to.equal(firstResult.mappings.core.sku);

							// assert data doesn't have other properties
							expect(JSON.stringify(data3)).to.equal(
								JSON.stringify({
									q: '',
									matchType: 'primary',
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
											type: 'product',
											position: 1,
											uid: firstResult.mappings.core.uid,
											sku: firstResult.mappings.core.sku,
										},
									],
									banners: [],
								})
							);

							// assert context values are different after page reload
							expect(context3).to.be.an('object');
							expect(context3.initiator).to.equal(context1.initiator);
							expect(context3.pageLoadId).to.not.equal(context1.pageLoadId); // pageLoadId should be different
							expect(context3.pageUrl).to.not.equal(context1.pageUrl); // pageUrl should be different
							expect(context3.sessionId).to.equal(context1.sessionId);
							expect(context3.shopperId).to.equal(context1.shopperId);
							expect(context3.timestamp).not.to.equal(context1.timestamp); // timestamp should be different
							expect(context3.userAgent).to.equal(context1.userAgent);
							expect(context3.userId).to.equal(context1.userId);
						});
					});
				});
			});
	});

	it('tracked category render, impression, clickthrough', () => {
		cy.visit('https://localhost:2222/snap/category.html');

		new Cypress.Promise.all([cy.wait(`@beacon2/category/render`), cy.wait(`@beacon2/category/impression`)]).then(([render, impression]) => {
			expect(render.response.body).to.have.property('success').to.equal(true);
			const { context, data } = JSON.parse(render.request.body);
			expect(context).to.be.an('object');
			expect(data).to.have.property('results').to.be.an('array').length.greaterThan(0);
			expect(data).not.to.have.property('q');
			expect(data).to.have.property('bgfilter').to.be.an('array').length.greaterThan(0);

			expect(impression.response.statusCode).to.equal(200);
		});

		// Click on first product
		cy.get('.ss__result a').first().click({ force: true });
		cy.wait(`@beacon2/category/clickthrough`).its('response.statusCode').should('eq', 200);
	});

	it('tracked autocomplete render, impression, clickthrough', () => {
		cy.visit('https://localhost:2222/snap/');
		cy.get('input[name="q"]').type('s');

		new Cypress.Promise.all([cy.wait(`@beacon2/autocomplete/render`), cy.wait(`@beacon2/autocomplete/impression`)]).then(([render, impression]) => {
			expect(render.response.body).to.have.property('success').to.equal(true);
			const { context, data } = JSON.parse(render.request.body);
			expect(context).to.be.an('object');
			expect(data).to.have.property('results').to.be.an('array').length.greaterThan(0);
			expect(data.results[0]).to.have.property('uid').to.be.a('string');
			expect(data).to.have.property('merchandising').to.be.an('object');
			expect(data).to.have.property('pagination').to.be.an('object');
			expect(data).to.not.have.property('sort');

			expect(impression.response.body).to.have.property('success').to.equal(true);
			const { data: data2 } = JSON.parse(impression.request.body);
			expect(data2).to.have.property('results').to.be.an('array').length.greaterThan(0);
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
		cy.visit('https://localhost:2222/snap/product.html');

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
		cy.visit('https://localhost:2222/snap/bundle.html');

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
		cy.visit('https://localhost:2222/snap/product.html');
		cy.wait(`@beacon2/product/pageview`).then(({ request, response }) => {
			expect(response.body).to.have.property('success').to.equal(true);

			const { context, data } = JSON.parse(request.body);
			expect(context).to.be.an('object');
			expect(data).to.have.property('result').to.be.an('object');
			expect(data.result).to.have.property('uid').to.be.a('string');
		});
	});

	it('tracked order transaction', () => {
		cy.visit('https://localhost:2222/snap/order.html');
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
		cy.visit('https://localhost:2222/snap/?dev=0');

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
