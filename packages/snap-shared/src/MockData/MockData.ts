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
		try {
			const metaFile = `${__dirname}/meta/${this.config.siteId}/${file || this.config.meta}.json`;
			return getJSON(metaFile);
		} catch (err) {
			throw 'Meta JSON not found.';
		}
	}

	search(file?: string): SearchResponseModel {
		try {
			const searchFile = `${__dirname}/search/${this.config.siteId}/${file || this.config.search}.json`;
			return getJSON(searchFile);
		} catch (err) {
			throw 'Search JSON not found.';
		}
	}

	autocomplete(file?: string): AutocompleteResponseModel {
		try {
			const autocompleteFile = `${__dirname}/autocomplete/${this.config.siteId}/${file || this.config.autocomplete}.json`;
			return getJSON(autocompleteFile);
		} catch (err) {
			throw 'AC JSON not found.';
		}
	}

	trending(file?: string) {
		try {
			const trendingFile = `${__dirname}/trending/${this.config.siteId}/${file || this.config.trending}.json`;
			return getJSON(trendingFile);
		} catch (err) {
			throw 'Trending JSON not found.';
		}
	}

	searchMeta(file?: string) {
		try {
			return { meta: this.meta(), ...this.search(file) };
		} catch (err) {
			throw 'Search JSON not found.';
		}
	}

	autocompleteMeta(file?: string) {
		try {
			return { meta: this.meta(), ...this.autocomplete(file) };
		} catch (err) {
			throw 'Search JSON not found.';
		}
	}

	recommend(files?: { profileFile?: string; resultsFile?: string }) {
		try {
			const profileFile = `${__dirname}/recommend/profile/${this.config.siteId}/${files?.profileFile || this.config.recommend?.profile}.json`;
			const resultsFile = `${__dirname}/recommend/results/${this.config.siteId}/${files?.resultsFile || this.config.recommend?.results}.json`;
			return {
				profile: getJSON(profileFile).profile,
				results: getJSON(resultsFile)[0].results,
			};
		} catch (err) {
			throw 'Search JSON not found.';
		}
	}
}

function getJSON(file: string) {
	const json = fs.readFileSync(file, 'utf8');
	return JSON.parse(json);
}
