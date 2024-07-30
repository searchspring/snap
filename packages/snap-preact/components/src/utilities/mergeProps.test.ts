import { sortSelectors, filterSelectors } from './mergeProps';

describe('mergeProps', () => {
	describe('sortSelectors function', () => {
		it('orders strings by spaces', () => {
			const expected = [
				'search',
				'search toolbar',
				'search toolbar.top',
				'search toolbar.bottom',
				'search toolbar perPage',
				'search toolbar.top perPage',
				'search toolbar.bottom perPage',
				'search toolbar perPage.named',
				'search toolbar.top perPage.named',
			];
			const data = [
				'search toolbar.top perPage',
				'search toolbar perPage',
				'search toolbar.top perPage.named',
				'search toolbar perPage.named',
				'search',
				'search toolbar',
				'search toolbar.top',
				'search toolbar.bottom',
				'search toolbar.bottom perPage',
			];
			expect(data.sort(sortSelectors)).toEqual(expected);
		});
	});
	describe('filterSelectors function', () => {
		it('removes selectors not within the treePath', () => {
			const treePath = `search toolbar.top pagination icon.next`;

			const selectors = {
				pagination: {},
				icon: {},
				'icon.next': {},
				'pagination icon': {},
				'pagination icon.next': {},
				'toolbar.top icon.next': {},
				'search toolbar.top icon thing': {},
				'carousel icon.next': {},
				'facet icon': {},
				'search toolbar pagination icon': {},
				'search toolbar pagination icon.next': {},
				'search toolbar.top pagination icon': {},
				'search toolbar.top pagination icon.next': {},
				'search toolbar.top pagination dne icon.next': {},
				'search dne toolbar.top pagination icon.next': {},
			};
			const expected = [
				'icon',
				'icon.next',
				'pagination icon',
				'pagination icon.next',
				'toolbar.top icon.next',
				'search toolbar pagination icon',
				'search toolbar pagination icon.next',
				'search toolbar.top pagination icon',
				'search toolbar.top pagination icon.next',
			];

			expect(filterSelectors(selectors, treePath)).toEqual(expected);
		});
	});
});
