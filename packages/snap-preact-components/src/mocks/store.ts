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

export const urlManager = {
	urlState: { id: ['components-pagination--pagination'], viewMode: ['story'] },
	localState: {},
	mergedState: { id: ['components-pagination--pagination'], viewMode: ['story'] },
	omissions: [],
	translator: { config: { queryParameter: 'q' } },
	watcherPool: { callbacks: [null] },
	prevState: {},
	lastUrl: '?id=components-pagination--pagination&viewMode=story',
	link: {
		href: 'nfujeidko',
		onClick: {},
	},
	go: () => {},
};

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

export const paginationFirstPageMock = {
	controller,
	page: 1,
	pageSize: 30,
	totalResults: 1305,
	pageSizeOptions: [
		{ label: 'Show 24', value: 24 },
		{ label: 'Show 48', value: 48 },
		{ label: 'Show 72', value: 72 },
	],
	begin: 1,
	current: {
		controller,
		url: urlManager,
		active: true,
		number: 1,
	},
	first: {
		controller,
		url: urlManager,
		active: true,
		number: 1,
	},
	last: {
		controller,
		url: urlManager,
		active: false,
		number: 44,
	},
	previous: undefined,
	next: {
		controller,
		url: urlManager,
		active: false,
		number: 2,
	},
	end: 30,
	totalPages: 44,
	multiplePages: true,
	getPages: () => {
		return [
			{
				active: true,
				number: 1,
				url: urlManager,
				controller: controller,
			},
			{
				active: false,
				number: 2,
				url: urlManager,
				controller: controller,
			},
			{
				active: false,
				number: 3,
				url: urlManager,
				controller: controller,
			},
			{
				active: false,
				number: 4,
				url: urlManager,
				controller: controller,
			},
			{
				active: false,
				number: 5,
				url: urlManager,
				controller: controller,
			},
		];
	},
};

export const paginationMock = {
	controller,
	page: 5,
	pageSize: 30,
	totalResults: 1305,
	pageSizeOptions: [
		{ label: 'Show 24', value: 24 },
		{ label: 'Show 48', value: 48 },
		{ label: 'Show 72', value: 72 },
	],
	begin: 1,
	current: {
		controller,
		url: urlManager,
		active: true,
		number: 5,
	},
	first: {
		controller,
		url: urlManager,
		active: false,
		number: 1,
	},
	last: {
		controller,
		url: urlManager,
		active: false,
		number: 44,
	},
	previous: {
		controller,
		url: urlManager,
		active: false,
		number: 4,
	},
	next: {
		controller,
		url: urlManager,
		active: false,
		number: 6,
	},
	end: 30,
	totalPages: 44,
	multiplePages: true,
	getPages: () => {
		return [
			{
				active: false,
				number: 3,
				url: urlManager,
				controller: controller,
			},
			{
				active: false,
				number: 4,
				url: urlManager,
				controller: controller,
			},
			{
				active: true,
				number: 5,
				url: urlManager,
				controller: controller,
			},
			{
				active: false,
				number: 6,
				url: urlManager,
				controller: controller,
			},
			{
				active: false,
				number: 7,
				url: urlManager,
				controller: controller,
			},
		];
	},
};
