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
			new Client({ siteId: '8uyt2m' }, { meta: { prefetch: false } });
		}).not.toThrow();
	});

	it('does not prefetch meta when option is not set', (done) => {
		const client = new Client({ siteId: '8uyt2m' }, { meta: { prefetch: false } });

		setTimeout(() => {
			try {
				expect(client.meta).toBeUndefined();
				done();
			} catch (err) {
				done(err);
			}
		});
	});

	// TODO: test with mock data - must mock fetch
});
