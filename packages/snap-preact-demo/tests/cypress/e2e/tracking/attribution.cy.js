import { BeaconType, BeaconCategory } from '@searchspring/snap-tracker';

describe('Attribution Tracking', () => {
	beforeEach(() => {
		cy.clearCookies();

		cy.on('window:before:load', (win) => {
			win.mergeSnapConfig = {
				mode: 'production',
			};
		});

		cy.wait(1000);
	});

	it('tracked product view with correct unencoded attribution', () => {
		cy.visit('https://localhost:2222/product.html?ss_attribution=email:test1EmailTag');

		cy.snapController().then(() => {
			cy.wait(1000);
			cy.wait(`@${BeaconType.PRODUCT}`).should((interception) => {
				expect(interception.state).to.equal('Complete');
				// expect(interception.response.body).to.have.property('success').to.equal(true);

				const beacon = interception.request.body.filter((event) => event.type === BeaconType.PRODUCT)[0];

				expect(beacon.category).to.equal(BeaconCategory.PAGEVIEW);

				expect(beacon.event).to.be.an('object').to.include.all.keys(['sku']);
				expect(beacon.event.uid).to.equal('182146');
				expect(beacon.event.sku).to.equal('C-AD-W1-1869P');

				// check for attribution
				expect(beacon.context).to.be.an('object').to.include.all.keys(['attribution']);
				expect(beacon.context.attribution).to.be.an('object').to.include.all.keys(['type', 'id']);
				expect(beacon.context.attribution.type).to.equal('email');
				expect(beacon.context.attribution.id).to.equal('test1EmailTag');
			});
		});
	});

	it('tracked product view with correct encoded attribution', () => {
		cy.wait(1000);
		cy.visit('https://localhost:2222/product.html?ss_attribution=email%3Atest2EmailTag');

		cy.snapController().then(() => {
			cy.wait(`@${BeaconType.PRODUCT}`).should((interception) => {
				expect(interception.state).to.equal('Complete');
				// expect(interception.response.body).to.have.property('success').to.equal(true);

				const beacon = interception.request.body.filter((event) => event.type === BeaconType.PRODUCT)[0];

				expect(beacon.category).to.equal(BeaconCategory.PAGEVIEW);

				expect(beacon.event).to.be.an('object').to.include.all.keys(['sku']);
				expect(beacon.event.uid).to.equal('182146');
				expect(beacon.event.sku).to.equal('C-AD-W1-1869P');

				// check for attribution
				expect(beacon.context).to.be.an('object').to.include.all.keys(['attribution']);
				expect(beacon.context.attribution).to.be.an('object').to.include.all.keys(['type', 'id']);
				expect(beacon.context.attribution.type).to.equal('email');
				expect(beacon.context.attribution.id).to.equal('test2EmailTag');
			});
		});
	});
});
