import { UrlManager, UrlTranslator } from '@searchspring/snap-url-manager';
import { MockData } from '@searchspring/snap-shared';

import { SearchBadgeStore } from './SearchBadgeStore';
import type { Product } from './SearchResultStore';

const services = {
	urlManager: new UrlManager(new UrlTranslator()),
};

const mockData = new MockData();

describe('Sorting Store', () => {
	beforeEach(() => {
		expect.hasAssertions();
	});

	it('can construct', () => {
		const searchData = mockData.searchMeta();
		//  @ts-ignore - badges missing from MetaResponseModel
		const badgeStore = new SearchBadgeStore(searchData.meta);
		//  @ts-ignore - private property
		expect(badgeStore.meta).toStrictEqual(searchData.meta);
	});

	it('can get callout badge', () => {
		const searchData = mockData.searchMeta();
		const meta = searchData.meta as any;

		const badgeStore = new SearchBadgeStore(meta);

		const calloutTag = Object.keys(meta.badges.tags || {}).find((tag) => {
			return meta.badges.tags[tag].location === 'callout';
		})!;
		expect(calloutTag).toBeDefined();

		const index = searchData.results!.findIndex((result: any) => result?.badges?.find((badge: any) => badge.tag === calloutTag))!;
		expect(index).toBeGreaterThanOrEqual(0);

		// mock a SearchResultStore
		const result = {
			...searchData.results![index],
			badges: [
				{
					...(searchData.results![index] as any).badges[0],
					...(searchData.meta as any).badges.tags[calloutTag],
				},
			],
		} as Product;

		expect(result.badges[0]).toHaveProperty('tag');
		expect(result.badges[0]).toHaveProperty('label');
		expect(result.badges[0]).toHaveProperty('location');
		expect(result.badges[0]).toHaveProperty('component');
		expect(result.badges[0]).toHaveProperty('parameters');

		const badge = badgeStore.getCalloutBadge(result, 'callout')!;

		expect(badge).toBeDefined();
		expect(badge.tag).toBe(calloutTag);
		expect(badge.location).toBe('callout');
	});

	it('can get overlay badge', () => {
		const searchData = mockData.searchMeta();
		const meta = searchData.meta as any;

		const badgeStore = new SearchBadgeStore(meta);

		let overlayTag = '';
		const index = searchData.results!.findIndex((result: any) => {
			const tag = result.badges?.[0]?.tag;
			if (!tag) return false;
			const metaTag = meta.badges.tags[tag];
			const location = metaTag.location;

			const hasOverlayBadge =
				meta.badges.locations.overlay.left.find((overlayLocation: any) => overlayLocation.name === location) ||
				meta.badges.locations.overlay.right.find((overlayLocation: any) => overlayLocation.name === location);

			if (hasOverlayBadge) {
				overlayTag = tag;
				return true;
			}
		});
		expect(index).toBeGreaterThanOrEqual(0);
		expect(overlayTag.length).toBeGreaterThan(0);

		// mock a SearchResultStore
		const result = {
			...searchData.results![index],
			badges: [
				{
					...(searchData.results![index] as any).badges[0],
					...(searchData.meta as any).badges.tags[overlayTag],
				},
			],
		} as Product;

		expect(result.badges[0]).toHaveProperty('tag');
		expect(result.badges[0]).toHaveProperty('label');
		expect(result.badges[0]).toHaveProperty('location');
		expect(result.badges[0]).toHaveProperty('component');
		expect(result.badges[0]).toHaveProperty('parameters');

		const badges = badgeStore.getOverlayBadges(result)!;

		expect(badges).toBeDefined();
		expect(badges.length).toBeGreaterThan(0);
		expect(badges[0].tag).toBe(overlayTag);
	});
});
