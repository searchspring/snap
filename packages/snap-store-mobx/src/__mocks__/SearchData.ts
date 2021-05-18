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
			siteId: '8uyt2m',
			search: 'default',
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
