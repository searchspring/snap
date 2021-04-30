import { SnapClient } from './SnapClient';

describe('SNAP Client', () => {
	it('requires a siteId during construction', () => {
		expect(() => {
			// @ts-ignore
			new SnapClient();
		}).toThrow();

		expect(() => {
			// @ts-ignore
			new SnapClient({});
		}).toThrow();

		expect(() => {
			new SnapClient({ siteId: '' });
		}).toThrow();

		expect(() => {
			new SnapClient({ siteId: 'scmq7n' }, { meta: { prefetch: false } });
		}).not.toThrow();
	});

	it('does not prefetch meta when option is not set', (done) => {
		const client = new SnapClient({ siteId: 'scmq7n' }, { meta: { prefetch: false } });

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
