import { Client } from './Client';

describe('SNAP Client', () => {
	it('requires a siteId during construction', () => {
		expect(() => {
			// @ts-ignore
			new Client();
		}).toThrow();

		expect(() => {
			// @ts-ignore
			new Client({});
		}).toThrow();

		expect(() => {
			new Client({ siteId: '' });
		}).toThrow();

		expect(() => {
			new Client({ siteId: '8uyt2m' });
		}).not.toThrow();
	});

	it('always prefetch meta', (done) => {
		const client = new Client({ siteId: '8uyt2m' });

		setTimeout(() => {
			try {
				expect(client.meta).toBeDefined();
				done();
			} catch (err) {
				done(err);
			}
		});
	});

	// TODO: test with mock data - must mock fetch
});
