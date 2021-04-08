// TODO: possibly move this into the toolbox as other repos also use this same class

import * as fs from 'fs';

type Settings = {
	siteId?: string;
	search?: string;
};

export class SearchData {
	meta;
	autocomplete;
	sorting;
	facets;
	filters;
	results;
	merchandising;
	search;
	pagination;

	constructor(settings?: Settings) {
		const config = {
			siteId: 'ga9kq2',
			search: 'defaultNoQuery',
			...settings,
		};

		const dir = `${__dirname}/data/${config.siteId}`;
		const metaFile = `${dir}/meta.json`;

		try {
			const metaJSON = fs.readFileSync(metaFile, 'utf8');
			this.meta = JSON.parse(metaJSON);
		} catch (err) {
			throw 'Meta JSON not found.';
		}

		const searchFile = `${dir}/searches/${config.search}.json`;
		// console.warn("searchFile", config.search)
		try {
			const searchJSON = fs.readFileSync(searchFile, 'utf8');
			const search = JSON.parse(searchJSON);
			Object.keys(search).forEach((key) => {
				this[key] = search[key];
			});
		} catch (err) {
			throw 'Search JSON not found.';
		}
	}
}
