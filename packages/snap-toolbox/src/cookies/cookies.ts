export const cookies: Cookies = {
	set: (name: string, val: string, sameSite?: string, expires?: number): void => {
		sameSite = sameSite || 'Lax';

		let cookie = name + '=' + encodeURIComponent(val) + ';' + 'SameSite=' + sameSite + ';path=/;';

		if (window.location.protocol == 'https:') {
			cookie += 'Secure;';
		}

		if (expires) {
			const d = new Date();
			d.setTime(d.getTime() + expires);
			cookie += 'expires=' + d['toUTCString']() + ';';
		}

		window.document.cookie = cookie;
	},
	get: (name: string): string => {
		name = name + '=';
		const ca = window.document.cookie.split(';');

		for (let i = 0; i < ca.length; i++) {
			let c = ca[i];

			while (c.charAt(0) == ' ') {
				c = c.substring(1);
			}

			if (c.indexOf(name) == 0) {
				return decodeURIComponent(c.substring(name.length, c.length));
			}
		}

		return '';
	},
	unset: (name: string): void => {
		window.document.cookie = name + '=; path=/; Max-Age=-99999999;';
	},
};

interface Cookies {
	set: (name: string, val: string, sameSite: string, expires: number) => void;
	get: (name: string) => string;
	unset: (name: string) => void;
}
