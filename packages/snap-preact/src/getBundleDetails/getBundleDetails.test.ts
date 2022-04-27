import { getBundleDetails } from './getBundleDetails';

const xhrMock: Partial<XMLHttpRequest> = {
	DONE: 4,
	open: jest.fn(),
	send: jest.fn(),
	setRequestHeader: jest.fn(),
	status: 200,
	readyState: 4,
};

jest.spyOn(window, 'XMLHttpRequest').mockImplementation(() => xhrMock as XMLHttpRequest);

describe('getBundleDetails function', () => {
	beforeAll(() => {
		const modifiedDate = '07 Jan 2022 22:42:39 GMT';
		xhrMock.getResponseHeader = jest.fn(() => {
			// return "Last-Modified" date
			return `Fri, ${modifiedDate}`;
		});
	});

	afterAll(() => jest.clearAllMocks);

	it('fetches bundle details from requested bundle URL', () => {
		const url = 'https://snapui.searchspring.io/siteId/next/bundle.js';

		const fetchPromise = getBundleDetails(url).then((details) => {
			expect(details.lastModified).toBe('07 Jan 2022 22:42:39 GMT');
			expect(details.url).toBe(url);
		});

		expect(xhrMock.open).toBeCalledWith('HEAD', url, true);
		(xhrMock.onreadystatechange as EventListener)(new Event(''));

		return fetchPromise;
	});

	it('rejects when bundle is not found', async () => {
		const url = 'https://snapui.searchspring.io/siteId/dne/bundle.js';
		// @ts-ignore
		xhrMock.status = 403;

		const fetchPromise = getBundleDetails(url);

		expect(xhrMock.open).toBeCalledWith('HEAD', url, true);
		(xhrMock.onreadystatechange as EventListener)(new Event(''));

		try {
			await fetchPromise;
		} catch (e) {
			expect(e).toStrictEqual({ description: 'Incorrect branch name or branch no longer exists.', message: 'Branch not found!' });
		}
	});
});
