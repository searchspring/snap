import { UrlManager, QueryStringTranslator, reactLinker } from '@searchspring/snap-url-manager';

const urlManager = new UrlManager(new QueryStringTranslator(), reactLinker);

export const mockSearchController = {
	config: {
		id: 'mockSearchController',
	},
	store: {
		meta: {},
	},
	urlManager: urlManager,
	search: null,
};

export const mockFinderController = {
	config: {
		id: 'mockFinderController',
		url: '',
		fields: [],
	},
	store: {
		meta: {},
	},
	urlManager: urlManager,
	search: null,
};

export const mockAutocompleteController = {
	config: {
		id: 'mockAutocompleteController',
	},
	store: {
		meta: {},
	},
	urlManager: urlManager,
	search: null,
};

export const mockRecommendationController = {
	config: {
		id: 'mockRecommendationController',
	},
	store: {
		meta: {},
	},
	urlManager: urlManager,
	search: null,
};
