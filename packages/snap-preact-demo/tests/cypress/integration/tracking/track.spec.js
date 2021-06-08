import { BeaconType, BeaconCategory } from '@searchspring/snap-tracker';

describe('Tracking', () => {
	it('tracked shopper login', () => {
		cy.visit('http://localhost:4444');

		const shopperId = '123456';
		cy.get('#login').click();
		cy.get('#login-modal').find('input').type(shopperId);
		cy.get('#login-modal').find('button').click();

		cy.wait('@beacon').should((interception) => {
			expect(interception.state).to.equal('Complete');
			expect(interception.request.method).to.equal('POST');
			expect(interception.request.body.category).to.equal(BeaconCategory.PERSONALIZATION);
			expect(interception.request.body.type).to.equal(BeaconType.LOGIN);
			expect(interception.request.body.event).to.be.an('object');
			expect(interception.request.body.context).to.be.an('object').include.key('shopperId');
			expect(interception.request.body.context.shopperId).to.equal(shopperId);
		});
	});
	it('tracked product click', () => {
		cy.visit('http://localhost:4444');

		cy.snapStore().then((store) => {
			expect(store).to.haveOwnProperty('pagination');
			expect(store.pagination.totalResults).to.be.greaterThan(0);

			cy.get(`.ss__result:first`).should('exist').trigger('mousedown');

			cy.wait('@beacon').should((interception) => {
				expect(interception.state).to.equal('Complete');
				expect(interception.request.method).to.equal('POST');
				expect(interception.request.body.category).to.equal(BeaconCategory.INTERACTION);
				expect(interception.request.body.type).to.equal(BeaconType.CLICK);
				expect(interception.request.body.event).to.be.an('object').include.all.keys('intellisuggestData', 'intellisuggestSignature');
				expect(interception.request.body.event.intellisuggestData).to.equal(store.results[0].attributes.intellisuggestData);
				expect(interception.request.body.event.intellisuggestSignature).to.equal(store.results[0].attributes.intellisuggestSignature);
			});

			cy.wait('@track').should((interception) => {
				expect(interception.state).to.equal('Complete');
				expect(interception.request.method).to.equal('GET');
				const urlParams = interception.request.url
					.split('track.json?')[1]
					.split('&')
					.map((urlPair) => {
						const [key, value] = urlPair.split('=');
						return { key, value };
					});
				const d = urlParams.filter((param) => param.key === 'd')[0].value;
				const s = urlParams.filter((param) => param.key === 's')[0].value;
				expect(d).to.equal(store.results[0].attributes.intellisuggestData);
				expect(s).to.equal(store.results[0].attributes.intellisuggestSignature);
			});
		});
	});
	it('tracked product view', () => {
		cy.visit('http://localhost:4444/product.html');

		cy.wait('@beacon').should((interception) => {
			expect(interception.state).to.equal('Complete');
			expect(interception.request.method).to.equal('POST');
			expect(interception.request.body.category).to.equal(BeaconCategory.PAGEVIEW);
			expect(interception.request.body.type).to.equal(BeaconType.PRODUCT);
			expect(interception.request.body.event).to.be.an('object').include.all.keys('sku');
			expect(interception.request.body.event.sku).to.equal('C-AD-W1-1869P'); // sku is hardcoded on /product.html
		});

		cy.wait('@pixel').should((interception) => {
			expect(interception.state).to.equal('Complete');
			expect(interception.request.method).to.equal('GET');
			const urlParams = interception.request.url
				.split('is.gif?')[1]
				.split('&')
				.map((urlPair) => {
					const [key, value] = urlPair.split('=');
					return { key, value };
				});
			const sku = urlParams.filter((param) => param.key === 'sku')[0].value;
			expect(sku).to.equal('C-AD-W1-1869P');
		});
	});

	it('tracked cart view', () => {
		cy.visit('http://localhost:4444/cart.html');

		cy.wait('@beacon').should((interception) => {
			expect(interception.state).to.equal('Complete');
			expect(interception.request.method).to.equal('POST');
			expect(interception.request.body.category).to.equal(BeaconCategory.CARTVIEW);
			expect(interception.request.body.type).to.equal(BeaconType.CART);
			expect(interception.request.body.event).to.be.an('array').to.have.length(2); // 2 cart items hardcoded in /cart.html
			expect(interception.request.body.event[0]).to.be.an('object').include.all.keys(['sku', 'qty', 'price']);
			expect(interception.request.body.event[1]).to.be.an('object').include.all.keys(['sku', 'qty', 'price']);
		});

		cy.wait('@pixel').should((interception) => {
			expect(interception.state).to.equal('Complete');
			expect(interception.request.method).to.equal('GET');
			const urlParams = interception.request.url
				.split('is.gif?')[1]
				.split('&')
				.map((urlPair) => {
					const [key, value] = urlPair.split('=');
					return { key, value };
				});
			const a = urlParams.filter((param) => param.key === 'a')[0].value;
			expect(a).to.equal('basket');
			const items = urlParams.filter((param) => param.key === 'item');
			expect(items).to.have.length(2);
			expect(items[0].value).to.equal('C-BP-G7-B1469;1;22;');
			expect(items[1].value).to.equal('C-VJ-P2-32007;1;39;');
		});
	});

	it('tracked order transaction', () => {
		cy.visit('http://localhost:4444/order.html');

		cy.wait('@beacon').should((interception) => {
			expect(interception.state).to.equal('Complete');
			expect(interception.request.method).to.equal('POST');
			expect(interception.request.body.category).to.equal(BeaconCategory.ORDERVIEW);
			expect(interception.request.body.type).to.equal(BeaconType.ORDER);
			expect(interception.request.body.event).to.be.an('object').include.all.keys(['items']);
			expect(interception.request.body.event.items).to.be.an('array').to.have.length(2); // 2 order items hardcoded in /order.html
			expect(interception.request.body.event.items[0]).to.be.an('object').include.all.keys(['sku', 'qty', 'price']);
			expect(interception.request.body.event.items[1]).to.be.an('object').include.all.keys(['sku', 'qty', 'price']);
		});

		cy.wait('@pixel').should((interception) => {
			expect(interception.state).to.equal('Complete');
			expect(interception.request.method).to.equal('GET');
			const urlParams = interception.request.url
				.split('is.gif?')[1]
				.split('&')
				.map((urlPair) => {
					const [key, value] = urlPair.split('=');
					return { key, value };
				});
			const a = urlParams.filter((param) => param.key === 'a')[0].value;
			expect(a).to.equal('sale');
			const items = urlParams.filter((param) => param.key === 'item');
			expect(items).to.have.length(2);
			expect(items[0].value).to.equal('C-BP-G7-B1469;1;22;');
			expect(items[1].value).to.equal('C-VJ-P2-32007;1;39;');
		});
	});
});
