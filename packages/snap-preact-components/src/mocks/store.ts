import { UrlManager, QueryStringTranslator, reactLinker } from '@searchspring/snap-url-manager';

export const controller = {
	config: { id: 'search', settings: { redirects: { enabled: false } } },
	client: {},
	store: 'store',
	urlManager: {
		urlState: { id: ['components-pagination--pagination'], viewMode: ['story'] },
		localState: {},
		mergedState: { id: ['components-pagination--pagination'], viewMode: ['story'] },
		omissions: [],
		translator: { config: { queryParameter: 'q' } },
		watcherPool: { callbacks: [null] },
		prevState: {},
		lastUrl: '?id=components-pagination--pagination&viewMode=story',
	},
	eventManager: { events: { beforeSearch: { functions: [null] }, afterSearch: { functions: [null] } } },
	profiler: { namespace: 'search', profiles: [] },
};

const urlManager = new UrlManager(new QueryStringTranslator(), reactLinker);

// export const urlManager = {
// 	globalState:{},
// 	without:{},
// 	getTranslatorUrl:{},
// 	refresh:{},
// 	state:{},
// 	unpackPathAndState:{},
// 	set:{},
// 	merge: {},
// 	remove: {},
// 	reset: {},
// 	withConfig: {},
// 	withGlobals: {},
// 	getTranslatorConfig: {},
// 	href: {},
// 	detach: {},
// 	subscribe: {},
// 	urlState: { id: ['components-pagination--pagination'], viewMode: ['story'] },
// 	localState: {},
// 	mergedState: { id: ['components-pagination--pagination'], viewMode: ['story'] },
// 	omissions: [],
// 	translator: { config: { queryParameter: 'q' } },
// 	watcherPool: { callbacks: [null] },
// 	prevState: {},
// 	lastUrl: '?id=components-pagination--pagination&viewMode=story',
// 	link: {
// 		href: 'nfujeidko',
// 		onClick: {},
// 	},
// 	go: () => {},

// };

export const sorting = {
	controller,
	current: {
		direction: 'desc',
		field: 'sales_rank',
		label: 'Most Popular',
		type: 'field',
		url: urlManager,
	},
	options: [
		{
			direction: 'desc',
			field: 'sales_rank',
			label: 'Most Popular',
			type: 'field',
			url: urlManager,
		},
		{
			direction: 'asc',
			field: 'title',
			label: 'Name (A - Z)',
			type: 'field',
			url: urlManager,
		},
		{
			direction: 'asc',
			field: 'title',
			label: 'Name (Z - A)',
			type: 'field',
			url: urlManager,
		},
		{
			direction: 'desc',
			field: 'price',
			label: 'Price ($$$ - $)',
			type: 'field',
			url: urlManager,
		},
		{
			direction: 'asc',
			field: 'price',
			label: 'Price ($ - $$$)',
			type: 'field',
			url: urlManager,
		},
	],
};

export const filters = [
	{
		facet: {
			field: 'size',
			label: 'Size',
		},
		label: 'Size: 7',
		url: {},
		value: {
			value: '7',
			label: '7',
		},
	},
	{
		facet: {
			field: 'size',
			label: 'Size',
		},
		label: 'Size: 7.5',
		url: {},
		value: {
			value: '7.5',
			label: '7.5',
		},
	},
	{
		facet: {
			field: 'color',
			label: 'Color',
		},
		label: 'Color: Blue',
		url: {},
		value: {
			value: 'Blue',
			label: 'Blue',
		},
	},
];

// export const paginationFirstPageMock: PaginationStore = {
// 	controller,
// 	page: 1,
// 	pageSize: 30,
// 	totalResults: 1305,
// 	pageSizeOptions: [
// 		{ label: 'Show 24', value: 24 },
// 		{ label: 'Show 48', value: 48 },
// 		{ label: 'Show 72', value: 72 },
// 	],
// 	begin: 1,
// 	current: {
// 		url: urlManager,
// 		active: true,
// 		number: 1,
// 		key: '1',
// 		services: {
// 			urlManager: urlManager
// 		},
// 	},
// 	first: {
// 		url: urlManager,
// 		active: true,
// 		number: 1,
// 		key: '1',
// 		services: {
// 			urlManager: urlManager
// 		},
// 	},
// 	last: {
// 		url: urlManager,
// 		active: false,
// 		number: 44,
// 		key: '44',
// 		services: {
// 			urlManager: urlManager
// 		},
// 	},
// 	next: {
// 		url: urlManager,
// 		active: false,
// 		number: 2,
// 		key: '2',
// 		services: {
// 			urlManager: urlManager
// 		},
// 	},
// 	end: 30,
// 	totalPages: 44,
// 	multiplePages: true,
// 	setPageSize: (num: number) => {
// 		if (num) {
// 			return urlManager.remove('page').set('pageSize', num).go();
// 		}
// 	},

// 	getPages: (min:number | undefined, max: number | undefined) => {
// 		return [
// 			{
// 				active: true,
// 				number: 1,
// 				url: urlManager,
// 				key: '1',
// 				services: {
// 					urlManager: urlManager
// 				}
// 			},
// 			{
// 				active: false,
// 				number: 2,
// 				url: urlManager,
// 				key: '2',
// 				services: {
// 					urlManager: urlManager
// 				}
// 			},
// 			{
// 				active: false,
// 				number: 3,
// 				url: urlManager,
// 				key: '3',
// 				services: {
// 					urlManager: urlManager
// 				}
// 			},
// 			{
// 				active: false,
// 				number: 4,
// 				url: urlManager,
// 				key: '4',
// 				services: {
// 					urlManager: urlManager
// 				}
// 			},
// 			{
// 				active: false,
// 				number: 5,
// 				url: urlManager,
// 				key: '5',
// 				services: {
// 					urlManager: urlManager
// 				}
// 			},
// 		];
// 	},
// };

// export const paginationMock: PaginationStore = {
// 	services: {
// 		urlManager: urlManager
// 	},
// 	defaultPageSize: 30,
// 	infinite: false,
// 	controllerConfig: controller.config,

// 	page: 5,
// 	pageSize: 30,
// 	totalResults: 1305,
// 	pageSizeOptions: [
// 		{ label: 'Show 24', value: 24 },
// 		{ label: 'Show 48', value: 48 },
// 		{ label: 'Show 72', value: 72 },
// 	],
// 	begin: 1,
// 	current: {
// 		url: urlManager,
// 		active: true,
// 		number: 5,
// 		key: '5',
// 		services: {
// 			urlManager: urlManager
// 		}
// 	},
// 	first: {
// 		url: urlManager,
// 		active: false,
// 		number: 1,
// 		key: '1',
// 		services: {
// 			urlManager: urlManager
// 		}
// 	},
// 	last: {
// 		url: urlManager,
// 		active: false,
// 		number: 44,
// 		key: '44',
// 		services: {
// 			urlManager: urlManager
// 		}
// 	},
// 	previous: {
// 		url: urlManager,
// 		active: false,
// 		number: 4,
// 		key: '4',
// 		services: {
// 			urlManager: urlManager
// 		}
// 	},
// 	next: {
// 		url: urlManager,
// 		active: false,
// 		number: 6,
// 		key: '6',
// 		services: {
// 			urlManager: urlManager
// 		}
// 	},
// 	end: 30,
// 	totalPages: 44,
// 	multiplePages: true,
// 	setPageSize: (num: number) => {
// 		if (num) {
// 			return urlManager.remove('page').set('pageSize', num).go();
// 		}
// 	},
// 	getPages: (min:number | undefined, max: number | undefined) => {
// 		return [
// 			{
// 				active: false,
// 				number: 3,
// 				url: urlManager,
// 				key: '3',
// 				services: {
// 					urlManager: urlManager
// 				}
// 			},
// 			{
// 				active: false,
// 				number: 4,
// 				url: urlManager,
// 				key: '4',
// 				services: {
// 						urlManager: urlManager
// 				}
// 			},
// 			{
// 				active: true,
// 				number: 5,
// 				url: urlManager,
// 				key: '5',
// 				services: {
// 					urlManager: urlManager
// 				}
// 			},
// 			{
// 				active: false,
// 				number: 6,
// 				url: urlManager,
// 				key: '6',
// 				services: {
// 					urlManager: urlManager
// 				}
// 			},
// 			{
// 				active: false,
// 				number: 7,
// 				url: urlManager,
// 				key: '7',
// 				services: {
// 					urlManager: urlManager
// 				}
// 			},
// 		];
// 	},
// };
