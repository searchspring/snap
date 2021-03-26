// TODO: move to toolbox
export const URL = (url: string): URLParserResponse => {
	const [urlWithoutHash, hash] = url.split('#');
	const [base, queryParams] = urlWithoutHash.split('?');
	const params = {
		query:
			queryParams?.split('&').map((entry) => {
				const [key, value] = entry.split('=');
				return {
					key,
					value,
				};
			}) || [],
		hash,
	};
	const urlfunction = () => {
		const queryString = params.query.map((param) => `${param.key}=${param.value}`).join('&');
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
			key: string;
			value: string;
		}[];
		hash: string;
	};
	url: () => string;
}
