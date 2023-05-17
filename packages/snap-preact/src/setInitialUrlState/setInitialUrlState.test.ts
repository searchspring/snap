import { setInitialUrlState } from './setInitialUrlState';

describe('setInitialUrlState function', () => {
	it('sets initial foreground filters', () => {
		let initialConfig = {
			state: {
				filter: {
					color_family: ['Blue'],
				},
			},
		};

		const initState = setInitialUrlState(initialConfig, {});

		expect(initState).toStrictEqual(initialConfig.state);
	});

	it('doesnt set initial filters when url state is pre-populated', () => {
		let initialConfig = {
			state: {
				filter: {
					color_family: ['Blue'],
				},
			},
		};

		const populatedUrlState = {
			filter: {
				color_family: 'red',
			},
		};

		const initState = setInitialUrlState(initialConfig, populatedUrlState);

		expect(initState).toStrictEqual({});
	});

	it('default ignore list includes query and tag', () => {
		let initialConfig = {
			state: {
				filter: {
					color_family: ['Blue'],
				},
			},
		};

		const populatedUrlState = {
			query: 'dress',
			tag: 'stuff',
		};

		const initState = setInitialUrlState(initialConfig, populatedUrlState);

		expect(initState).toStrictEqual({ filter: { color_family: ['Blue'] }, query: 'dress', tag: 'stuff' });
	});

	it('can pass in additional ignore list params', () => {
		let initialConfig = {
			state: {
				filter: {
					color_family: ['Blue'],
				},
			},
			ignoreList: ['filter'],
		};

		const populatedUrlState = {
			filter: {
				color_family: 'Red',
			},
		};

		const initState = setInitialUrlState(initialConfig, populatedUrlState);

		expect(initState).toStrictEqual({ filter: { color_family: ['Red', 'Blue'] } });
	});

	it('can set pagination init params', () => {
		let initialConfig = {
			state: {
				page: 3,
				pageSize: 30,
			},
		};

		const initState = setInitialUrlState(initialConfig, {});

		expect(initState).toStrictEqual(initialConfig.state);
	});

	it('can set sorting init params', () => {
		let initialConfig = {
			state: {
				sort: {
					field: 'title',
					direction: 'desc',
				},
			},
		};

		const initState = setInitialUrlState(initialConfig, {});

		expect(initState).toStrictEqual(initialConfig.state);
	});

	it('can set range filter init params', () => {
		let initialConfig = {
			state: {
				filter: {
					price: {
						low: 35,
						high: 108,
					},
				},
			},
		};

		const initState = setInitialUrlState(initialConfig, {});

		expect(initState).toStrictEqual(initialConfig.state);
	});

	it('can set EVERYTHING in init params', () => {
		let initialConfig = {
			state: {
				filter: {
					color_family: ['Red', 'Blue'],
					size: ['Medium'],
				},
				page: 3,
				pageSize: 30,
				sort: {
					field: 'title',
					direction: 'desc',
				},
			},
		};

		const initState = setInitialUrlState(initialConfig, {});

		expect(initState).toEqual(initialConfig.state);
	});
});
