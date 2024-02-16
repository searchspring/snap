import { makeObservable, observable } from 'mobx';

import type { SearchStoreConfig, StoreServices, StoreConfigs } from '../../types';
import type {
	SearchResponseModelResult,
	SearchResponseModelPagination,
	SearchResponseModelMerchandising,
	SearchResponseModelResultMappings,
	SearchResponseModelMerchandisingContentInline,
	SearchResponseModelMerchandisingContentConfig,
	MetaResponseModel,
} from '@searchspring/snapi-types';

export class SearchResultStore extends Array<Product | Banner> {
	static get [Symbol.species](): ArrayConstructor {
		return Array;
	}

	constructor(
		config: StoreConfigs,
		services: StoreServices,
		metaData: MetaResponseModel,
		resultData?: SearchResponseModelResult[],
		paginationData?: SearchResponseModelPagination,
		merchData?: SearchResponseModelMerchandising
	) {
		let results = (resultData || []).map((result) => {
			return new Product(services, result, metaData);
		});

		if (merchData?.content?.inline) {
			const banners = merchData.content.inline
				.sort(function (a, b) {
					return a.config!.position!.index! - b.config!.position!.index!;
				})
				.map((banner) => {
					return new Banner(services, banner);
				});

			if (banners && paginationData?.totalResults) {
				results = addBannersToResults(config, results, banners, paginationData);
			}
		}
		super(...results);
	}
}

export class Banner {
	public type = 'banner';
	public id: string;
	public attributes: Record<string, unknown> = {};
	public mappings: SearchResponseModelResultMappings = {
		core: {},
	};
	public custom = {};
	public config: SearchResponseModelMerchandisingContentConfig;
	public value: string;
	public badges: any;

	constructor(services: StoreServices, banner: SearchResponseModelMerchandisingContentInline) {
		this.id = 'ss-ib-' + banner.config!.position!.index;
		this.config = banner.config!;
		this.value = banner.value!;

		makeObservable(this, {
			id: observable,
			mappings: observable,
			attributes: observable,
		});
	}
}

export type ResultBadge = {
	tag: string;
	label: string;
};

export type MetaBadges = {
	locations: {
		overlay: {
			[position: string]: {
				name: string;
				label: string;
				description: string;
			}[];
		};
		callouts: {
			name: string;
			label: string;
			description: string;
		}[];
	};
	tags: {
		[tag: string]: {
			component: string;
			location: string;
			parameters: {
				color: string;
				colorText: string;
				url: string;
			};
		};
	};
};

export class Product {
	public type = 'product';
	public id: string;
	public attributes: Record<string, unknown> = {};
	public mappings: SearchResponseModelResultMappings = {
		core: {},
	};
	public custom = {};
	public children?: Array<Child> = [];
	public badges: any;

	constructor(services: StoreServices, result: SearchResponseModelResult, metaData: MetaResponseModel) {
		this.id = result.id!;
		this.attributes = result.attributes!;
		this.mappings = result.mappings!;

		this.badges =
			(result as SearchResponseModelResult & { badges: ResultBadge[] }).badges?.map((badge) => {
				const meta = metaData as MetaBadges & { badges: MetaBadges };
				const metaBadgeData = (badge?.tag && meta?.badges?.tags && meta?.badges?.tags[badge.tag]) || {};
				return {
					...badge,
					...metaBadgeData,
				};
			}) || [];

		if (result?.children?.length) {
			this.children = result.children.map((variant, index) => {
				return new Child(services, {
					id: `${result.id}-${index}`,
					...variant,
				});
			});
		}

		makeObservable(this, {
			id: observable,
			attributes: observable,
			custom: observable,
		});

		// must set all subo
		const coreObservables = Object.keys(this.mappings.core!).reduce((map, key) => {
			return {
				...map,
				[key]: observable,
			};
		}, {});

		makeObservable(this.mappings.core!, coreObservables);
	}
}

class Child {
	public type = 'child';
	public id: string;
	public attributes: Record<string, unknown> = {};
	public custom = {};

	constructor(services: StoreServices, result: SearchResponseModelResult) {
		this.id = result.id!;
		this.attributes = result.attributes!;

		makeObservable(this, {
			id: observable,
			attributes: observable,
			custom: observable,
		});
	}
}

function addBannersToResults(config: StoreConfigs, results: Product[], banners: Banner[], paginationData: SearchResponseModelPagination) {
	const productCount = results.length;
	let minIndex = paginationData.pageSize! * (paginationData.page! - 1);
	const maxIndex = minIndex + paginationData.pageSize!;

	if ((config as SearchStoreConfig)?.settings?.infinite) {
		minIndex = 0;
	}

	banners
		.reduce((adding, banner) => {
			const resultCount = productCount + adding.length;

			if (banner.config.position!.index! >= minIndex && (banner.config.position!.index! < maxIndex || resultCount < paginationData.pageSize!)) {
				adding.push(banner);
			}

			return adding;
		}, [] as Banner[])
		.forEach((banner) => {
			const adjustedIndex = banner.config.position!.index! - minIndex;

			results.splice(adjustedIndex, 0, banner);
		});

	return results;
}
