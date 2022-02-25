export function getFlags(userAgent = ''): FeatureFlags {
	userAgent = (userAgent || (window.navigator || {}).userAgent || '').toLowerCase();

	const isIE = (function () {
		let ieVersion: number | boolean;

		return function isIE() {
			if (ieVersion === undefined) {
				const version = (userAgent.match(/(msie|trident\/7.0; rv:) ?([0-9]{1,2})\./) || [])[2];

				ieVersion = version ? Number(version) : false;
			}

			return ieVersion;
		};
	})();

	return {
		cors: function () {
			return !isIE() || isIE() >= 10;
		},
		cookies: function () {
			return window.navigator && window.navigator.cookieEnabled && !('doNotTrack' in window.navigator && window.navigator.doNotTrack === '1');
		},
		storage: function () {
			const test = 'ss-test';

			try {
				window.localStorage.setItem(test, test);
				window.localStorage.removeItem(test);

				return true;
			} catch (e) {
				return false;
			}
		},
	};
}

interface FeatureFlags {
	cors: () => boolean;
	cookies: () => boolean;
	storage: () => boolean;
}

const flags = getFlags();
export const featureFlags = {
	cors: flags.cors(),
	cookies: flags.cookies(),
	storage: flags.storage(),
};
