import { BeaconType, BeaconCategory } from '@searchspring/snap-tracker';

describe('Tracking', () => {
	beforeEach(() => {
		cy.on('window:before:load', (win) => {
			win.mergeSnapConfig = {
				mode: 'production',
			};
		});
	});
	it('tracked shopper login', () => {
		cy.visit('https://localhost:2222');

		cy.waitForBundle().then((searchspring) => {
			expect(searchspring).to.exist;
		});

		// wait for first login event
		cy.wait(`@${BeaconType.LOGIN}`).then(() => {
			// initial init will send a login event for the shopper due to integration script variables
			const shopperId = 'snaptest';
			cy.get('#login').click();
			cy.get('#login-modal').find('input').type(shopperId);
			cy.get('#login-modal').find('button').click();

			// test of new login using modal and tracker function
			cy.wait(`@${BeaconType.LOGIN}`).should((interception) => {
				expect(interception.state).to.equal('Complete');
				expect(interception.response.body).to.have.property('success').to.equal(true);

				const beacon = interception.request.body.filter((event) => event.type === BeaconType.LOGIN)[0];
				expect(beacon.category).to.equal(BeaconCategory.PERSONALIZATION);
				expect(beacon.type).to.equal(BeaconType.LOGIN);
				expect(beacon.event).to.be.an('object').include.key('shopperId').include.key('userId');
				expect(beacon.context).to.be.an('object').include.key('shopperId');
				expect(beacon.context.shopperId).to.equal(shopperId);
			});
		});
	});

	it('tracked product click', () => {
		cy.snapController().then(({ store }) => {
			expect(store).to.haveOwnProperty('pagination');
			expect(store.pagination.totalResults).to.be.greaterThan(0);

			cy.get(`.ss__result:first`).should('exist').trigger('click');

			cy.wait(`@${BeaconType.CLICK}`).should((interception) => {
				expect(interception.state).to.equal('Complete');
				expect(interception.response.body).to.have.property('success').to.equal(true);

				const beacon = interception.request.body.filter((event) => event.type === BeaconType.CLICK)[0];

				expect(beacon.category).to.equal(BeaconCategory.INTERACTION);
				expect(beacon.type).to.equal(BeaconType.CLICK);
				expect(beacon.event).to.be.an('object').include.all.keys('intellisuggestData', 'intellisuggestSignature');
				expect(beacon.event.intellisuggestData).to.equal(store.results[0].attributes.intellisuggestData);
				expect(beacon.event.intellisuggestSignature).to.equal(store.results[0].attributes.intellisuggestSignature);
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
		cy.visit('https://localhost:2222/product.html');

		cy.snapController().then(({ store }) => {
			cy.wait(`@${BeaconType.PRODUCT}`).should((interception) => {
				expect(interception.state).to.equal('Complete');
				expect(interception.response.body).to.have.property('success').to.equal(true);

				const beacon = interception.request.body.filter((event) => event.type === BeaconType.PRODUCT)[0];

				expect(beacon.category).to.equal(BeaconCategory.PAGEVIEW);

				expect(beacon.event).to.be.an('object').to.include.all.keys(['sku']);
				expect(beacon.event.id).to.equal('182146');
				expect(beacon.event.sku).to.equal('C-AD-W1-1869P');
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
	});

	it('tracked cart view', () => {
		cy.visit('https://localhost:2222/cart.html');
		cy.snapController().then(({ store }) => {
			cy.wait(`@${BeaconType.CART}`).should((interception) => {
				expect(interception.state).to.equal('Complete');
				expect(interception.response.body).to.have.property('success').to.equal(true);

				const beacon = interception.request.body.filter((event) => event.type === BeaconType.CART)[0];

				expect(beacon.category).to.equal(BeaconCategory.CARTVIEW);

				expect(beacon.event).to.have.property('items');
				expect(beacon.event.items).to.be.an('array').to.have.length(2);

				expect(beacon.event.items[0]).to.be.an('object').include.all.keys(['id', 'sku', 'qty', 'price']);
				expect(beacon.event.items[1]).to.be.an('object').include.all.keys(['id', 'sku', 'qty', 'price']);
				expect(beacon.event.items[0]).to.deep.equal({
					id: '182146',
					sku: 'C-AD-W1-1869P',
					qty: '1',
					price: '48',
				});
				expect(beacon.event.items[1]).to.deep.equal({
					id: '174287',
					sku: 'C-AD-Y5-814MD',
					qty: '1',
					price: '36',
				});
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
				expect(items[0].value).to.equal('C-AD-W1-1869P;1;48;');
				expect(items[1].value).to.equal('C-AD-Y5-814MD;1;36;');
			});
		});
	});

	it('tracked order transaction', () => {
		cy.visit('https://localhost:2222/order.html');
		cy.snapController().then(({ store }) => {
			cy.wait(`@${BeaconType.ORDER}`).should((interception) => {
				expect(interception.state).to.equal('Complete');
				expect(interception.response.body).to.have.property('success').to.equal(true);

				const beacon = interception.request.body.filter((event) => event.type === BeaconType.ORDER)[0];
				expect(beacon.category).to.equal(BeaconCategory.ORDERVIEW);

				expect(beacon.event).to.have.property('items');
				expect(beacon.event.items).to.be.an('array').to.have.length(2);

				expect(beacon.event.items[0]).to.be.an('object').include.all.keys(['id', 'sku', 'qty', 'price']);
				expect(beacon.event.items[1]).to.be.an('object').include.all.keys(['id', 'sku', 'qty', 'price']);

				expect(beacon.event.items[0]).to.deep.equal({
					id: '99688',
					sku: 'C-BP-G7-B1469',
					qty: '1',
					price: '22',
				});
				expect(beacon.event.items[1]).to.deep.equal({
					id: '181655',
					sku: 'C-VJ-P2-32007',
					qty: '1',
					price: '39',
				});
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

	it('tracked all recommendation interaction events', () => {
		cy.visit('https://localhost:2222/product.html');

		cy.snapController('recommend_similar_0').then(({ store }) => {
			expect(store).to.haveOwnProperty('results');
			expect(store.results).to.have.length.above(0);

			cy.wait(`@${BeaconType.PROFILE_RENDER}`).should((interception) => {
				expect(interception.state).to.equal('Complete');
				expect(interception.response.body).to.have.property('success').to.equal(true);

				const profileRenderBeacon = interception.request.body.filter((event) => event.type === BeaconType.PROFILE_RENDER)[0];
				expect(profileRenderBeacon.category).to.equal(BeaconCategory.RECOMMENDATIONS);

				expect(profileRenderBeacon.event).to.have.property('context');
				expect(profileRenderBeacon.event.context).to.be.an('object').include.all.keys(['placement', 'tag', 'type']);
				expect(profileRenderBeacon.event).to.have.property('profile');
				expect(profileRenderBeacon.event.profile).to.be.an('object').include.all.keys(['placement', 'tag', 'templateId', 'threshold', 'seed']);
				expect(profileRenderBeacon.id).to.be.an('string');

				const productRenderBeacons = interception.request.body.filter((event) => event.type === BeaconType.PROFILE_PRODUCT_RENDER);
				expect(productRenderBeacons).to.have.length(store.results.length);
				productRenderBeacons.forEach((productRenderBeacon) => {
					expect(productRenderBeacon.category).to.equal(BeaconCategory.RECOMMENDATIONS);
					expect(productRenderBeacon.type).to.equal(BeaconType.PROFILE_PRODUCT_RENDER);

					expect(productRenderBeacon.id).to.be.an('string');
					expect(productRenderBeacon.event).to.have.property('context');
					expect(productRenderBeacon.event.context).to.be.an('object').include.all.keys(['placement', 'tag', 'type']);
					expect(productRenderBeacon.event).to.have.property('product');
					expect(productRenderBeacon.event.product).to.be.an('object').include.all.keys(['id', 'mappings', 'seed']);
					expect(productRenderBeacon.event.product.mappings).to.be.an('object').include.all.keys(['core']);
					expect(productRenderBeacon.event.product.mappings.core)
						.to.be.an('object')
						// .include.all.keys(['brand', 'imageUrl', 'msrp', 'name', 'popularity', 'price', 'sku', 'thumbnailImageUrl', 'uid', 'url']);
						.include.all.keys(['uid']);
					expect(productRenderBeacon.pid).to.equal(profileRenderBeacon.id);
				});
			});

			// scroll down
			cy.get('.ss__recommendation:first').scrollIntoView();

			let profileImpressionBeacon, productImpressionBeacons;

			cy.wait(`@${BeaconType.PROFILE_IMPRESSION}`).should((interception) => {
				expect(interception.state).to.equal('Complete');
				expect(interception.response.body).to.have.property('success').to.equal(true);

				profileImpressionBeacon = interception.request.body.filter((event) => event.type === BeaconType.PROFILE_IMPRESSION)[0];
				productImpressionBeacons = interception.request.body.filter((event) => event.type === BeaconType.PROFILE_PRODUCT_IMPRESSION);

				expect(profileImpressionBeacon.category).to.equal(BeaconCategory.RECOMMENDATIONS);

				expect(profileImpressionBeacon.event).to.have.property('context');
				expect(profileImpressionBeacon.event.context).to.be.an('object').include.all.keys(['placement', 'tag', 'type']);
				expect(profileImpressionBeacon.event).to.have.property('profile');
				expect(profileImpressionBeacon.event.profile).to.be.an('object').include.all.keys(['placement', 'tag', 'templateId', 'threshold', 'seed']);
				expect(profileImpressionBeacon.id).to.be.an('string');
			});

			let visibleSlides;
			cy.get('.ss__recommendation:first .swiper-slide')
				.filter(':visible')
				.then((slides) => {
					visibleSlides = slides.length;
					expect(productImpressionBeacons).to.have.length(visibleSlides);

					productImpressionBeacons.forEach((productImpressionBeacon) => {
						expect(productImpressionBeacon.category).to.equal(BeaconCategory.RECOMMENDATIONS);
						expect(productImpressionBeacon.type).to.equal(BeaconType.PROFILE_PRODUCT_IMPRESSION);

						expect(productImpressionBeacon.id).to.be.an('string');
						expect(productImpressionBeacon.event).to.have.property('context');
						expect(productImpressionBeacon.event.context).to.be.an('object').include.all.keys(['placement', 'tag', 'type']);
						expect(productImpressionBeacon.event).to.have.property('product');
						expect(productImpressionBeacon.event.product).to.be.an('object').include.all.keys(['id', 'mappings', 'seed']);
						expect(productImpressionBeacon.event.product.mappings).to.be.an('object').include.all.keys(['core']);
						expect(productImpressionBeacon.event.product.mappings.core)
							.to.be.an('object')
							// .include.all.keys(['brand', 'imageUrl', 'msrp', 'name', 'popularity', 'price', 'sku', 'thumbnailImageUrl', 'uid', 'url']);
							.include.all.keys(['uid']);
						expect(productImpressionBeacon.pid).to.equal(profileImpressionBeacon.id);
					});
				});

			// click next button and assert new profile product impressions
			cy.get('.ss__recommendation:first .ss__carousel__next').should('exist').trigger('click');

			cy.wait(`@${BeaconType.PROFILE_CLICK}`).should((interception) => {
				expect(interception.state).to.equal('Complete');
				expect(interception.response.body).to.have.property('success').to.equal(true);

				const profileClickBeacon = interception.request.body.filter((event) => event.type === BeaconType.PROFILE_CLICK)[0];
				expect(profileClickBeacon.category).to.equal(BeaconCategory.RECOMMENDATIONS);

				expect(profileClickBeacon.event).to.have.property('context');
				expect(profileClickBeacon.event.context).to.be.an('object').include.all.keys(['placement', 'tag', 'type']);
				expect(profileClickBeacon.event).to.have.property('profile');
				expect(profileClickBeacon.event.profile).to.be.an('object').include.all.keys(['placement', 'tag', 'templateId', 'threshold', 'seed']);
				expect(profileClickBeacon.id).to.be.an('string');

				const productImpressionBeacons = interception.request.body.filter((event) => event.type === BeaconType.PROFILE_PRODUCT_IMPRESSION);
				expect(productImpressionBeacons).to.have.length(visibleSlides);
				productImpressionBeacons.forEach((productImpressionBeacon) => {
					expect(productImpressionBeacon.category).to.equal(BeaconCategory.RECOMMENDATIONS);
					expect(productImpressionBeacon.type).to.equal(BeaconType.PROFILE_PRODUCT_IMPRESSION);

					expect(productImpressionBeacon.id).to.be.an('string');
					expect(productImpressionBeacon.event).to.have.property('context');
					expect(productImpressionBeacon.event.context).to.be.an('object').include.all.keys(['placement', 'tag', 'type']);
					expect(productImpressionBeacon.event).to.have.property('product');
					expect(productImpressionBeacon.event.product).to.be.an('object').include.all.keys(['id', 'mappings', 'seed']);
					expect(productImpressionBeacon.event.product.mappings).to.be.an('object').include.all.keys(['core']);
					expect(productImpressionBeacon.event.product.mappings.core)
						.to.be.an('object')
						// .include.all.keys(['brand', 'imageUrl', 'msrp', 'name', 'popularity', 'price', 'sku', 'thumbnailImageUrl', 'uid', 'url']);
						.include.all.keys(['uid']);
					expect(productImpressionBeacon.pid).to.equal(profileImpressionBeacon.id);
				});
			});

			// click on result
			cy.get('.ss__recommendation:first .ss__result')
				.filter(':visible:first')
				.should('exist')
				.find('.ss__result__details__pricing')
				.should('exist')
				.click();

			cy.wait(`@${BeaconType.PROFILE_PRODUCT_CLICK}`).should((interception) => {
				expect(interception.state).to.equal('Complete');
				expect(interception.response.body).to.have.property('success').to.equal(true);

				const profileClickBeacon = interception.request.body.filter((event) => event.type === BeaconType.PROFILE_CLICK)[0];
				expect(profileClickBeacon.id).to.be.an('string');

				const profileProductClickBeacons = interception.request.body.filter((event) => event.type === BeaconType.PROFILE_PRODUCT_CLICK)[0];

				expect(profileProductClickBeacons.category).to.equal(BeaconCategory.RECOMMENDATIONS);
				expect(profileProductClickBeacons.type).to.equal(BeaconType.PROFILE_PRODUCT_CLICK);
				expect(profileProductClickBeacons.id).to.be.an('string');
				expect(profileProductClickBeacons.event).to.have.property('context');
				expect(profileProductClickBeacons.event.context).to.be.an('object').include.all.keys(['placement', 'tag', 'type']);
				expect(profileProductClickBeacons.event).to.have.property('product');
				expect(profileProductClickBeacons.event.product).to.be.an('object').include.all.keys(['id', 'mappings', 'seed']);
				expect(profileProductClickBeacons.event.product.mappings).to.be.an('object').include.all.keys(['core']);
				expect(profileProductClickBeacons.event.product.mappings.core)
					.to.be.an('object')
					// .include.all.keys(['brand', 'imageUrl', 'msrp', 'name', 'popularity', 'price', 'sku', 'thumbnailImageUrl', 'uid', 'url']);
					.include.all.keys(['uid']);
				expect(profileProductClickBeacons.pid).to.equal(profileClickBeacon.id);
			});
		});
	});
});
