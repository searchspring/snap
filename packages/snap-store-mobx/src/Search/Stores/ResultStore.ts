import { makeObservable, observable } from 'mobx';

import type { SearchStoreConfig, AutocompleteStoreConfig, StoreServices } from '../../types';
import type {
	SearchResponseModelResult,
	SearchResponseModelPagination,
	SearchResponseModelMerchandising,
	SearchResponseModelResultMappings,
	SearchResponseModelMerchandisingContentInline,
	SearchResponseModelMerchandisingContentConfig,
} from '@searchspring/snapi-types';

export class ResultStore extends Array {
	static get [Symbol.species](): ArrayConstructor {
		return Array;
	}

	constructor(
		config: SearchStoreConfig | AutocompleteStoreConfig,
		services: StoreServices,
		resultData: SearchResponseModelResult[],
		paginationData?: SearchResponseModelPagination,
		merchData?: SearchResponseModelMerchandising
	) {
		let results = (resultData || []).map((result) => {
			return new Product(services, result);
		});

		if (merchData?.content?.inline) {
			const banners = merchData.content.inline
				.sort(function (a, b) {
					return a.config.position.index - b.config.position.index;
				})
				.map((banner) => {
					return new Banner(services, banner);
				});

			if (banners && paginationData?.totalResults) {
				results = addBannersToResults(config, results, banners, paginationData);
			}
		}
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		super(...results);
	}
}

class Banner {
	type = 'banner';
	id: string;
	attributes: Record<string, unknown> = {};
	mappings: SearchResponseModelResultMappings = {
		core: {},
	};
	custom = {};
	config: SearchResponseModelMerchandisingContentConfig;
	value: string;

	constructor(services: StoreServices, banner: SearchResponseModelMerchandisingContentInline) {
		this.id = 'ss-ib-' + banner.config.position.index;
		this.config = banner.config;
		this.value = banner.value;

		makeObservable(this, {
			id: observable,
			mappings: observable,
			attributes: observable,
		});
	}
}

class Product {
	type = 'product';
	id: string;
	attributes: Record<string, unknown> = {};
	mappings: SearchResponseModelResultMappings = {
		core: {},
	};
	custom = {};
	children?: Array<Child> = [];

	constructor(services: StoreServices, result: SearchResponseModelResult) {
		this.id = result.id;
		this.attributes = result.attributes;
		this.mappings = result.mappings;

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
		const coreObservables = Object.keys(result.mappings.core).reduce((map, key) => {
			return {
				...map,
				[key]: observable,
			};
		}, {});

		makeObservable(this.mappings.core, coreObservables);
	}
}

class Child {
	type = 'child';
	id: string;
	attributes: Record<string, unknown> = {};
	custom = {};

	constructor(services: StoreServices, result: SearchResponseModelResult) {
		this.id = result.id;
		this.attributes = result.attributes;

		makeObservable(this, {
			id: observable,
			attributes: observable,
			custom: observable,
		});
	}
}

function addBannersToResults(config: SearchStoreConfig, results: Product[], banners: Banner[], paginationData: SearchResponseModelPagination) {
	const productCount = results.length;
	let minIndex = paginationData.pageSize * (paginationData.page - 1);
	const maxIndex = minIndex + paginationData.pageSize;

	if (config?.settings?.infinite) {
		minIndex = 0;
	}

	banners
		.reduce((adding, banner) => {
			const resultCount = productCount + adding.length;

			if (banner.config.position.index >= minIndex && (banner.config.position.index < maxIndex || resultCount < paginationData.pageSize)) {
				adding.push(banner);
			}

			return adding;
		}, [] as Banner[])
		.forEach((banner, index) => {
			let adjustedIndex = banner.config.position.index - minIndex;
			if (adjustedIndex > productCount - 1) {
				adjustedIndex = productCount + index;
			}

			results.splice(adjustedIndex, 0, banner);
		});

	return results;
}
