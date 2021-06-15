import { makeObservable, observable } from 'mobx';

export class ResultStore extends Array {
	static get [Symbol.species](): ArrayConstructor {
		return Array;
	}

	constructor(controller, resultData, paginationData, merchData) {
		let results = (resultData || []).map((result) => {
			return new Product(controller, result);
		});

		// TODO: use setting from controller
		if (merchData?.content?.inline) {
			const banners = merchData.content.inline
				.sort(function (a, b) {
					return a.config.position.index - b.config.position.index;
				})
				.map((banner) => {
					return new Banner(controller, banner);
				});

			if (banners && paginationData?.totalResults) {
				results = addBannersToResults(results, banners, paginationData);
			}
		}

		super(...results);
	}
}

class Banner {
	type = 'banner';
	id: string;
	attributes = {};
	mappings = {
		core: {},
	};
	custom = {};
	config = {};
	value: string;

	constructor(controller, banner) {
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
	attributes = {};
	mappings = {
		core: {},
	};
	custom = {};
	track;

	constructor(controller, result) {
		this.id = result.id;
		this.attributes = result.attributes;
		this.mappings = result.mappings;
		this.track = {
			click: (e) => {
				// product click tracking
				const { intellisuggestData, intellisuggestSignature } = result.attributes;
				const href = e?.target?.href || result.mappings.core?.url || undefined;
				controller.tracker.track.product.click({
					data: {
						intellisuggestData,
						intellisuggestSignature,
						href,
					},
				});
			},
		};

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

function addBannersToResults(results, banners, paginationData) {
	const productCount = results.length;
	const minIndex = paginationData.pageSize * (paginationData.page - 1);
	const maxIndex = minIndex + paginationData.pageSize;

	banners
		.reduce((adding, banner) => {
			const resultCount = productCount + adding.length;

			if (banner.config.position.index >= minIndex && (banner.config.position.index < maxIndex || resultCount < paginationData.pageSize)) {
				adding.push(banner);
			}

			return adding;
		}, [])
		.forEach((banner, index) => {
			let adjustedIndex = banner.config.position.index - minIndex;
			if (adjustedIndex > productCount - 1) {
				adjustedIndex = productCount + index;
			}

			results.splice(adjustedIndex, 0, banner);
		});

	return results;
}
