import { transformRecommendationFiltersGet } from './recommendationFiltersGet';

describe('transformRecommendationFiltersGet', () => {
	it('transformRecommendationFiltersGet works', async () => {
		const filters = [
			{ type: 'value' as const, field: 'color', value: 'blue' },
			{ type: 'value' as const, field: 'color', value: 'red' },
			{ type: 'value' as const, field: 'color', value: 'green' },
			{ type: 'range' as const, field: 'price', value: { high: 20, low: 0 } },
		];
		const tranformedFilters = transformRecommendationFiltersGet(filters);
		expect(tranformedFilters).toStrictEqual({ 'filter.color': ['blue', 'red', 'green'], 'filter.price.high': [20], 'filter.price.low': [0] });
	});

	it('transformRecommendationFiltersGet works with single high or low range value', async () => {
		const filterHigh = [{ type: 'range' as const, field: 'price', value: { high: 20 } }];
		const filterLow = [
			//also works with 0
			{ type: 'range' as const, field: 'price', value: { low: 0 } },
		];

		const tranformedFilterHigh = transformRecommendationFiltersGet(filterHigh);
		expect(tranformedFilterHigh).toStrictEqual({ 'filter.price.high': [20] });

		const tranformedFilterLow = transformRecommendationFiltersGet(filterLow);
		expect(tranformedFilterLow).toStrictEqual({ 'filter.price.low': [0] });
	});
});
