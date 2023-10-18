import { transformRecommendationFiltersPost } from './recommendationFiltersPost';

describe('transformRecommendationFiltersPost', () => {
	it('transformRecommendationFiltersPost works as expected', async () => {
		const filters = [
			{ type: 'value' as const, field: 'color', value: 'blue' },
			{ type: 'value' as const, field: 'color', value: 'red' },
			{ type: 'value' as const, field: 'color', value: 'green' },
			{ type: 'range' as const, field: 'price', value: { high: 20, low: 0 } },
		];

		const tranformedFilters = transformRecommendationFiltersPost(filters);
		expect(tranformedFilters).toStrictEqual([
			{ field: 'color', type: '=', values: ['blue', 'red', 'green'] },
			{ field: 'price', type: '>=', values: [0] },
			{ field: 'price', type: '<=', values: [20] },
		]);
	});

	it('transformRecommendationFiltersPost works with single high or low range value', async () => {
		const filterHigh = [{ type: 'range' as const, field: 'price', value: { high: 20 } }];
		const filterLow = [{ type: 'range' as const, field: 'price', value: { low: 0 } }];

		const tranformedFilterHigh = transformRecommendationFiltersPost(filterHigh);
		expect(tranformedFilterHigh).toStrictEqual([{ field: 'price', type: '<=', values: [20] }]);

		const tranformedFilterLow = transformRecommendationFiltersPost(filterLow);
		expect(tranformedFilterLow).toStrictEqual([{ field: 'price', type: '>=', values: [0] }]);
	});
});
