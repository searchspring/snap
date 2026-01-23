/*
	proposed file naming conventions

	query.red.yaml

	query.{ actual query }.json
	query.{ actual query }.sort.price.desc.json
	filteredHierarchy.json
*/

import * as fs from 'fs';
import deepmerge from 'deepmerge';
import type { MetaResponseModel, SearchResponseModel, AutocompleteResponseModel } from '@searchspring/snapi-types';

type MockDataConfig = {
	siteId?: string;
	meta?: string;
	search?: string;
	autocomplete?: string;
	trending?: string;
	recommend?: {
		profile?: string;
		results?: string;
	};
};

const defaultConfig: MockDataConfig = {
	siteId: '8uyt2m',
	meta: 'meta',
	search: 'default',
	autocomplete: 'default',
	trending: 'default',
	recommend: {
		profile: 'default',
		results: 'default',
	},
};

export class MockData {
	initialConfig: MockDataConfig;
	config = defaultConfig;

	constructor(config?: MockDataConfig) {
		this.initialConfig = config || defaultConfig;
		this.updateConfig(this.initialConfig);
	}

	updateConfig(config: MockDataConfig): MockData {
		this.config = deepmerge(this.config, config || {});
		return this;
	}

	resetConfig(): MockData {
		this.config = defaultConfig;
		this.updateConfig(this.initialConfig);
		return this;
	}

	meta(file?: string): MetaResponseModel {
		const metaFile = `${__dirname}/meta/${this.config.siteId}/${file || this.config.meta}.json`;
		try {
			return getJSON(metaFile);
		} catch (err) {
			throw `Meta JSON '${metaFile}' not found.`;
		}
	}

	search(file?: string): SearchResponseModel {
		const searchFile = `${__dirname}/search/${this.config.siteId}/${file || this.config.search}.json`;
		try {
			return getJSON(searchFile);
		} catch (err) {
			throw `Search JSON '${searchFile}' not found.`;
		}
	}

	autocomplete(file?: string): AutocompleteResponseModel {
		const autocompleteFile = `${__dirname}/autocomplete/${this.config.siteId}/${file || this.config.autocomplete}.json`;
		try {
			return getJSON(autocompleteFile);
		} catch (err) {
			throw `AC JSON '${autocompleteFile}' not found.`;
		}
	}

	trending(file?: string) {
		const trendingFile = `${__dirname}/trending/${this.config.siteId}/${file || this.config.trending}.json`;
		try {
			return getJSON(trendingFile);
		} catch (err) {
			throw `Trending JSON '${trendingFile}' not found.`;
		}
	}

	searchMeta(file?: string) {
		try {
			return { meta: this.meta(), ...this.search(file) };
		} catch (err) {
			throw `SearchMeta JSON not found: ${err}`;
		}
	}

	autocompleteMeta(file?: string) {
		try {
			return { meta: this.meta(), ...this.autocomplete(file) };
		} catch (err) {
			throw `AutocompleteMeta JSON not found: ${err}`;
		}
	}

	file(path?: string) {
		const dataFile = `${__dirname}/${path}`;
		try {
			return getJSON(dataFile);
		} catch (err) {
			throw `Data file '${dataFile}' not found!`;
		}
	}

	recommend(files?: { profileFile?: string; resultsFile?: string }) {
		const profileFile = `${__dirname}/recommend/profile/${this.config.siteId}/${files?.profileFile || this.config.recommend?.profile}.json`;
		const resultsFile = `${__dirname}/recommend/results/${this.config.siteId}/${files?.resultsFile || this.config.recommend?.results}.json`;
		try {
			return {
				meta: this.meta(),
				profile: getJSON(profileFile).profile,
				results: getJSON(resultsFile)[0].results,
				responseId: getJSON(resultsFile)[0].responseId || 'responseId-mock', // TODO remove fallback
			};
		} catch (err) {
			throw `Recommend JSON not found. Profile: '${profileFile}', Results: '${resultsFile}'`;
		}
	}
}

function getJSON(file: string) {
	const json = fs.readFileSync(file, 'utf8');
	return JSON.parse(json);
}
