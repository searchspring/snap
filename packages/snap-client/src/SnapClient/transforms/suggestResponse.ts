import { SuggestResponseModel } from '../apis';
export function transformSuggestResponse(response: SuggestResponseModel): any {
	return {
		...transformSuggestResponse.query(response),
		...transformSuggestResponse.correctedQuery(response),
		...transformSuggestResponse.suggested(response),
		...transformSuggestResponse.alternatives(response),
	};
}

transformSuggestResponse.query = (response: SuggestResponseModel) => {
	if (!response?.query) {
		return {};
	}

	return { query: response.query };
};

transformSuggestResponse.correctedQuery = (response: SuggestResponseModel) => {
	if (typeof response != 'object' || !response['corrected-query']) {
		return {};
	}

	return { correctedQuery: response['corrected-query'] };
};

transformSuggestResponse.suggested = (response: SuggestResponseModel) => {
	if (typeof response != 'object' || !response.suggested || typeof response.suggested != 'object') {
		return {};
	}

	return {
		suggested: {
			text: response.suggested?.text,
			type: response.suggested?.type,
			source: response.suggested?.source,
		},
	};
};

transformSuggestResponse.alternatives = (response: SuggestResponseModel) => {
	const alternatives = response?.alternatives || [];

	return {
		alternatives: alternatives.map((alternative) => {
			return {
				text: alternative.text,
			};
		}),
	};
};
