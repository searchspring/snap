import { transformSuggestResponse } from './suggestResponse';

const mockQuery = 'yellw';

const mockCorrectedQuery = 'yellow';

const mockSuggested: {
	text: string;
	type: string;
	completed?: [];
	source: string;
} = {
	text: 'yellow',
	type: 'exact',
	completed: [],
	source: 'popular-query',
};

const mockAlternatives = [
	{
		popularity: 430,
		text: 'yellow top',
	},
	{
		popularity: 143,
		text: 'yellow tops',
	},
	{
		popularity: 79,
		text: 'yellow maxi',
	},
];

const mockResponse = {
	query: mockQuery,
	'corrected-query': mockCorrectedQuery,
	suggested: mockSuggested,
	alternatives: mockAlternatives,
};

describe('suggest response transformer', () => {
	it('calls all relevant transforms', () => {
		const query = jest.spyOn(transformSuggestResponse, 'query');
		const correctedQuery = jest.spyOn(transformSuggestResponse, 'correctedQuery');
		const suggested = jest.spyOn(transformSuggestResponse, 'suggested');
		const alternatives = jest.spyOn(transformSuggestResponse, 'alternatives');

		const suggestResponse = transformSuggestResponse(mockResponse);

		expect(query).toHaveBeenCalled();
		expect(correctedQuery).toHaveBeenCalled();
		expect(suggested).toHaveBeenCalled();
		expect(alternatives).toHaveBeenCalled();

		expect(query.mock.calls[0][0]).toEqual(mockResponse);
		expect(correctedQuery.mock.calls[0][0]).toEqual(mockResponse);
		expect(suggested.mock.calls[0][0]).toEqual(mockResponse);
		expect(alternatives.mock.calls[0][0]).toEqual(mockResponse);

		expect(typeof query.mock.results[0].value).toEqual('object');
		expect(typeof correctedQuery.mock.results[0].value).toEqual('object');
		expect(typeof suggested.mock.results[0].value).toEqual('object');
		expect(typeof alternatives.mock.results[0].value).toEqual('object');

		query.mockRestore();
		correctedQuery.mockRestore();
		suggested.mockRestore();
		alternatives.mockRestore();
	});
});

describe('suggest response transformer query', () => {
	it('does not transform the query at all', () => {
		const mockQueryResponse = {
			query: mockQuery,
		};

		const response = transformSuggestResponse.query(mockQueryResponse);

		expect(response).toEqual(mockQueryResponse);
	});

	it('still returns object if passed undefined', () => {
		// @ts-ignore
		expect(typeof transformSuggestResponse.query()).toEqual('object');
		// @ts-ignore
		expect(typeof transformSuggestResponse.query({})).toEqual('object');
	});
});

describe('suggest response transformer corrected-query', () => {
	it('renames corrected-query property', () => {
		const response = transformSuggestResponse.correctedQuery({
			query: mockQuery,
			'corrected-query': 'yellow',
		});

		expect(response).toEqual({ correctedQuery: 'yellow' });
	});

	it('still returns object if passed undefined', () => {
		// @ts-ignore
		expect(typeof transformSuggestResponse.correctedQuery()).toEqual('object');
		// @ts-ignore
		expect(typeof transformSuggestResponse.correctedQuery({})).toEqual('object');
	});
});

describe('suggest response transformer suggested', () => {
	it("removes the 'completed' property", () => {
		const mockSuggestedResponse = {
			query: mockQuery,
			suggested: mockSuggested,
		};

		const response = transformSuggestResponse.suggested(mockSuggestedResponse);

		const transformedResponse = {
			suggested: mockSuggested,
		};
		delete transformedResponse?.suggested?.completed;

		expect(response).toEqual(transformedResponse);
	});

	it('returns object with null values if passed undefined', () => {
		// @ts-ignore
		expect(transformSuggestResponse.suggested()).toEqual({ suggested: undefined });
		// @ts-ignore
		expect(transformSuggestResponse.suggested({})).toEqual({ suggested: undefined });
	});
});

describe('suggest response transformer alternatives', () => {
	it("removes the 'popularity' property", () => {
		const mockAlternativesResponse = {
			query: mockQuery,
			alternatives: mockAlternatives,
		};

		const response = transformSuggestResponse.alternatives(mockAlternativesResponse);

		const transformedResponse = mockAlternatives.map((alternative) => {
			return {
				text: alternative.text,
			};
		});

		expect(response.alternatives).toEqual(transformedResponse);
	});

	it('returns empty array if passed undefined', () => {
		// @ts-ignore
		expect(transformSuggestResponse.alternatives().alternatives).toEqual([]);
		// @ts-ignore
		expect(transformSuggestResponse.alternatives({}).alternatives).toEqual([]);
	});
});
