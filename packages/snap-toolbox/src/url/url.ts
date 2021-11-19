export const url = (href: string): URLParserResponse => {
	if (!href) {
		return;
	}
	const [urlWithoutHash, hash] = href.split('#');
	const [base, queryParams] = urlWithoutHash.split('?');
	const params = {
		query: {},
		hash,
	};
	queryParams?.split('&').forEach((entry) => {
		const [key, value] = entry.split('=');
		params.query[key] = value;
	});

	const urlfunction = () => {
		const queryString = Object.keys(params.query)
			.map((key) => `${key}=${params.query[key]}`)
			.join('&');
		return `${base}${queryString ? '?' + queryString : ''}${params.hash ? '#' + params.hash : ''}`;
	};

	return {
		base,
		params,
		url: urlfunction,
	};
};

export interface URLParserResponse {
	base: string;
	params: {
		query: {
			[key: string]: string;
		};
		hash: string;
	};
	url: () => string;
}
