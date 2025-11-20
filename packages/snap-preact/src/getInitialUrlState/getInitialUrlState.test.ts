import { getInitialUrlState } from './getInitialUrlState';
import { UrlManager, UrlTranslator } from '@searchspring/snap-url-manager';
import { InitialUrlConfig } from '../types';

describe('getInitialUrlState function', () => {
	it('creates a urlManager with no state if no parameters are specified', () => {
		const initialConfig = {
			parameters: {},
		};

		const urlManager = new UrlManager(new UrlTranslator());
		const initState = getInitialUrlState(initialConfig, urlManager);

		expect(initState.state).toStrictEqual({});
	});

	it('creates a urlManager with initial state specified', () => {
		const initialConfig = {
			parameters: {
				filter: {
					state: {
						color_family: ['Blue'],
					},
				},
			},
		};

		const urlManager = new UrlManager(new UrlTranslator());
		const initState = getInitialUrlState(initialConfig, urlManager);

		expect(initState.state).toStrictEqual({
			filter: initialConfig.parameters.filter.state,
		});
	});

	it('does not set initial state properties when there are existing non-ignored state parameters', () => {
		const initialConfig = {
			parameters: {
				filter: {
					state: {
						color_family: ['Blue'],
					},
				},
			},
		};

		const populatedUrlState = {
			filter: {
				color_family: ['Red'],
			},
		};

		const urlManager = new UrlManager(new UrlTranslator(), undefined, undefined, populatedUrlState);
		const initState = getInitialUrlState(initialConfig, urlManager);

		expect(initState.state).toStrictEqual(populatedUrlState);
	});

	it('does set initial state properties when there are existing ignored state parameters and will preserve them', () => {
		const initialConfig = {
			parameters: {
				filter: {
					state: {
						color_family: ['Blue'],
					},
				},
			},
		};

		const populatedUrlState = {
			query: 'dress',
			tag: 'stuff',
		};

		const urlManager = new UrlManager(new UrlTranslator(), undefined, undefined, populatedUrlState);
		const initState = getInitialUrlState(initialConfig, urlManager);

		expect(initState.state).toStrictEqual({
			filter: initialConfig.parameters.filter.state,
			...populatedUrlState,
		});
	});

	it('will not use initial state when current state contains non-default ignoreParmeters', () => {
		const initialConfig = {
			parameters: {
				filter: {
					state: {
						color_family: ['Blue'],
					},
				},
			},
		};

		const populatedUrlState = {
			query: 'dress',
			page: 3,
		};

		const urlManager = new UrlManager(new UrlTranslator(), undefined, undefined, populatedUrlState);
		const initState = getInitialUrlState(initialConfig, urlManager);

		expect(initState.state).toStrictEqual({ ...populatedUrlState });
	});

	it('will use not initial state configured to not use default ignoreParmeters and not specifying any additional ignoreParameters', () => {
		const initialConfig: InitialUrlConfig = {
			settings: {
				useDefaultIgnoreParameters: false,
			},
			parameters: {
				filter: {
					state: {
						color_family: ['Blue'],
					},
				},
			},
		};

		const populatedUrlState = {
			query: 'dress',
			page: 3,
		};

		const urlManager = new UrlManager(new UrlTranslator(), undefined, undefined, populatedUrlState);
		const initState = getInitialUrlState(initialConfig, urlManager);

		expect(initState.state).toStrictEqual({ ...populatedUrlState });
	});

	it('will use initial state when not using default ignoreParmeters while specifying additional ignoreParameters', () => {
		const initialConfig: InitialUrlConfig = {
			settings: {
				useDefaultIgnoreParameters: false,
			},
			parameters: {
				filter: {
					ignoreParameters: ['query', 'page'],
					state: {
						color_family: ['Blue'],
					},
				},
			},
		};

		const populatedUrlState = {
			query: 'dress',
			page: 3,
		};

		const urlManager = new UrlManager(new UrlTranslator(), undefined, undefined, populatedUrlState);
		const initState = getInitialUrlState(initialConfig, urlManager);

		expect(initState.state).toStrictEqual({
			filter: initialConfig.parameters.filter!.state,
			...populatedUrlState,
		});
	});

	it('will use initial state when not using default globalIgnoreParmeters while specifying additional ignoreParameters', () => {
		const initialConfig: InitialUrlConfig = {
			parameters: {
				filter: {
					useGlobalIgnoreParameters: false,
					ignoreParameters: ['query', 'page'],
					state: {
						color_family: ['Blue'],
					},
				},
			},
		};

		const populatedUrlState = {
			query: 'dress',
			page: 3,
		};

		const urlManager = new UrlManager(new UrlTranslator(), undefined, undefined, populatedUrlState);
		const initState = getInitialUrlState(initialConfig, urlManager);

		expect(initState.state).toStrictEqual({
			filter: initialConfig.parameters.filter!.state,
			...populatedUrlState,
		});
	});

	it('will NOT use initial state when not using default globalIgnoreParmeters and NOT specifying additional ignoreParameters', () => {
		const initialConfig: InitialUrlConfig = {
			parameters: {
				filter: {
					useGlobalIgnoreParameters: false,
					state: {
						color_family: ['Blue'],
					},
				},
			},
		};

		const populatedUrlState = {
			query: 'dress',
			page: 3,
		};

		const urlManager = new UrlManager(new UrlTranslator(), undefined, undefined, populatedUrlState);
		const initState = getInitialUrlState(initialConfig, urlManager);

		expect(initState.state).toStrictEqual(populatedUrlState);
	});

	it('will by default merge parameters', () => {
		const initialConfig: InitialUrlConfig = {
			settings: {
				ignoreParameters: ['filter'],
			},
			parameters: {
				filter: {
					state: {
						color_family: ['Blue'],
					},
				},
			},
		};

		const populatedUrlState = {
			filter: {
				color_family: ['Red'],
			},
		};

		const urlManager = new UrlManager(new UrlTranslator(), undefined, undefined, populatedUrlState);
		const initState = getInitialUrlState(initialConfig, urlManager);

		expect(initState.state).toStrictEqual({ filter: { color_family: ['Red', 'Blue'] } });
	});

	it(`can 'set' instead of 'merge' parameters when using the action parameter configuration`, () => {
		const initialConfig: InitialUrlConfig = {
			parameters: {
				filter: {
					ignoreParameters: ['filter'],
					action: 'set',
					state: {
						color_family: ['Blue'],
					},
				},
			},
		};

		const populatedUrlState = {
			filter: {
				color_family: ['Red'],
			},
		};

		const urlManager = new UrlManager(new UrlTranslator(), undefined, undefined, populatedUrlState);
		const initState = getInitialUrlState(initialConfig, urlManager);

		expect(initState.state).toStrictEqual({
			filter: initialConfig.parameters.filter!.state,
		});
	});

	it('will use initial pagination state properties', () => {
		const initialConfig = {
			parameters: {
				page: {
					state: 3,
				},
				pageSize: {
					state: 30,
				},
			},
		};

		const urlManager = new UrlManager(new UrlTranslator());
		const initState = getInitialUrlState(initialConfig, urlManager);

		expect(initState.state).toStrictEqual({
			page: initialConfig.parameters.page.state,
			pageSize: initialConfig.parameters.pageSize.state,
		});
	});

	it('will use initial sorting state properties', () => {
		const initialConfig = {
			parameters: {
				sort: {
					state: {
						field: 'title',
						direction: 'desc',
					},
				},
			},
		};

		const urlManager = new UrlManager(new UrlTranslator());
		const initState = getInitialUrlState(initialConfig, urlManager);

		expect(initState.state).toStrictEqual({
			sort: initialConfig.parameters.sort.state,
		});
	});

	it('will use initial filter range state properties', () => {
		const initialConfig = {
			parameters: {
				filter: {
					state: {
						price: [
							{
								low: 35,
								high: 108,
							},
						],
					},
				},
			},
		};

		const urlManager = new UrlManager(new UrlTranslator());
		const initState = getInitialUrlState(initialConfig, urlManager);

		expect(initState.state).toStrictEqual({
			filter: initialConfig.parameters.filter.state,
		});
	});

	it('will use initial filter range state properties and merge existing ones', () => {
		const initialConfig = {
			settings: {
				ignoreParameters: ['filter'],
			},
			parameters: {
				filter: {
					state: {
						rating: [
							{
								low: 3,
								high: 4,
							},
						],
					},
				},
			},
		};

		const populatedUrlState = {
			filter: {
				rating: [
					{
						low: 4,
						high: 5,
					},
				],
			},
		};

		const urlManager = new UrlManager(new UrlTranslator(), undefined, undefined, populatedUrlState);
		const initState = getInitialUrlState(initialConfig, urlManager);

		expect(initState.state).toStrictEqual({
			filter: {
				rating: populatedUrlState.filter.rating.concat(initialConfig.parameters.filter.state.rating),
			},
		});
	});

	it('will use several initial parameters at once (including custom ones)', () => {
		const initialConfig = {
			parameters: {
				query: {
					state: 'dress',
				},
				filter: {
					state: {
						color_family: ['Red', 'Blue'],
						size: ['Medium'],
					},
				},
				page: {
					state: 3,
				},
				pageSize: {
					state: 30,
				},
				sort: {
					state: {
						field: 'title',
						direction: 'desc',
					},
				},
				type: {
					state: 'products',
				},
			},
		};

		const urlManager = new UrlManager(new UrlTranslator());
		const initState = getInitialUrlState(initialConfig, urlManager);

		expect(initState.state).toStrictEqual({
			query: initialConfig.parameters.query.state,
			filter: initialConfig.parameters.filter.state,
			page: initialConfig.parameters.page.state,
			pageSize: initialConfig.parameters.pageSize.state,
			sort: initialConfig.parameters.sort.state,
			type: initialConfig.parameters.type.state,
		});
	});
});
