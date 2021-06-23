import { makeObservable, observable } from 'mobx';

export class ResultStore extends Array {
	static get [Symbol.species](): ArrayConstructor {
		return Array;
	}

	constructor(services, resultData, paginationData?, merchData?) {
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

	constructor(services, banner) {
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

	constructor(services, result) {
		this.id = result.id;
		this.attributes = result.attributes;
		this.mappings = result.mappings;

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
