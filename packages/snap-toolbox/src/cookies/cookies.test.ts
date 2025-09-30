import { getFlags } from '../featureFlags/featureFlags';
import { cookies } from './cookies';

Object.defineProperty(global.window.navigator, 'cookieEnabled', {
	writable: true,
	value: true,
});

describe('cookies', () => {
	afterEach(() => {
		// clear all cookies
		document.cookie.split(';').forEach(function (c) {
			document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
		});
	});

	it('should set and get a cookie', () => {
		cookies.set('testCookie', 'testValue');
		expect(cookies.get('testCookie')).toBe('testValue');
	});

	it('should handle special characters in cookie values', () => {
		const specialValue = 'test=value with spaces&special@chars';
		cookies.set('testCookie', specialValue);
		expect(cookies.get('testCookie')).toBe(specialValue);
	});

	it('should unset cookie', () => {
		cookies.set('testCookie', 'testValue');
		cookies.unset('testCookie');
		expect(cookies.get('testCookie')).toBe('');
	});

	it('should unset cookie with domain', () => {
		cookies.set('testCookie', 'testValue', undefined, undefined, 'example.com');
		cookies.unset('testCookie', 'example.com');
		expect(cookies.get('testCookie')).toBe('');
	});

	it('should return empty string for non-existent cookie', () => {
		expect(cookies.get('nonExistentCookie')).toBe('');
	});

	it('should properly URI encode values when setting cookies', () => {
		const valueWithSpecialChars = '?key=value&something=other;stuff=here';
		cookies.set('testCookie', valueWithSpecialChars);
		expect(document.cookie).toContain(encodeURIComponent(valueWithSpecialChars));
	});

	it('should properly URI decode values when getting cookies', () => {
		const valueWithSpecialChars = '?key=value&something=other;stuff=here';
		document.cookie = `testCookie=${encodeURIComponent(valueWithSpecialChars)}`;
		expect(cookies.get('testCookie')).toBe(valueWithSpecialChars);
	});

	it('cant do anything if cookies feature flag is off', () => {
		(global.window as any).navigator.cookieEnabled = false;

		expect(getFlags().cookies()).toEqual(false);

		expect(cookies.get('testCookie')).toBe('');

		expect(() => cookies.set('testCookie', 'testValue')).not.toThrow();
		expect(cookies.get('testCookie')).toBe('');

		expect(() => cookies.unset('testCookie')).not.toThrow();
	});
});
