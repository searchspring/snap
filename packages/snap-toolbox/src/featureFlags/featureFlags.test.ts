import { getFlags } from './featureFlags';

// window mocking

Object.defineProperty(global.window, 'localStorage', {
	writable: true,
	value: {
		getItem: jest.fn(),
		setItem: jest.fn(),
		removeItem: jest.fn(),
		clear: jest.fn(),
	},
});

Object.defineProperty(global.window.navigator, 'cookieEnabled', {
	writable: true,
	value: true,
});

Object.defineProperty(global.window.navigator, 'doNotTrack', {
	writable: true,
	value: false,
});

describe('feature flags', () => {
	describe('request cors headers', () => {
		it('is enabled for IE 10 and up', () => {
			expect(getFlags('Mozilla/5.0 (Windows NT 6.1; Trident/7.0; rv:11.0) like Gecko').cors()).toEqual(true);
			expect(getFlags('Mozilla/5.0 (Windows NT 6.2; Trident/7.0; rv:11.0) like Gecko').cors()).toEqual(true);
			expect(getFlags('Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko').cors()).toEqual(true);
			expect(getFlags('Mozilla/5.0 (Windows NT 10.0; Trident/7.0; rv:11.0) like Gecko').cors()).toEqual(true);
			expect(getFlags('Mozilla/5.0 (Windows NT 10.0; Trident/7.0; rv:11.0) like Gecko').cors()).toEqual(true);
			expect(getFlags('Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2)').cors()).toEqual(true);
		});

		it('is disabled for IE 9 and below', () => {
			expect(getFlags('Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 5.1; Trident/4.0)').cors()).toEqual(false);
			expect(getFlags('Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0; WOW64; Trident/4.0;)').cors()).toEqual(false);
			expect(getFlags('Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; Trident/4.0)`').cors()).toEqual(false);
			expect(getFlags('Mozilla/4.0 (compatible; MSIE 9.0; Windows NT 6.0)').cors()).toEqual(false);
			expect(getFlags('Mozilla/4.0 (compatible; MSIE 9.0; Windows NT 6.1)').cors()).toEqual(false);
		});

		it('is enabled for other browsers', () => {
			expect(getFlags('any other browser').cors()).toEqual(true);
			expect(getFlags('that you can think of').cors()).toEqual(true);
			expect(getFlags('BeCaUSe We ** \\ 17 CaN 1').cors()).toEqual(true);
		});
	});

	describe('cookies', () => {
		it('is true when cookies are enabled', () => {
			(global.window as any).navigator.cookieEnabled = true;
			expect(getFlags('user agent not considered').cookies()).toEqual(true);
		});

		it('is false when cookies are disabled', () => {
			(global.window as any).navigator.cookieEnabled = false;
			expect(getFlags('user agent not considered').cookies()).toEqual(false);
		});

		it('is false when doNotTrack is set', () => {
			(global.window as any).navigator.cookieEnabled = true;
			(global.window as any).navigator.doNotTrack = true;
			expect(getFlags('user agent not considered').cookies()).toEqual(false);
		});
	});

	describe('storage', () => {
		it('is true when storage is enabled', () => {
			expect(getFlags('user agent not considered').storage()).toEqual(true);
		});

		it('is false when storage is disabled', () => {
			(global.window as any).localStorage = undefined;
			expect(getFlags('user agent not considered').storage()).toEqual(false);
		});
	});
});
