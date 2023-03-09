import { setInitialUrlState } from './setInitialUrlState';

describe('setInitialUrlState function', () => {
	it('sets initial foreground filters', () => {
		let initialConfig = {
			filters: [
				{
					field: 'color_family',
					value: 'Blue',
					type: 'value',
					background: false,
				},
			],
		};

		const initState = setInitialUrlState(initialConfig, {});

		expect(initState).toStrictEqual({ filter: { color_family: ['Blue'] } });
	});

	it('doesnt set initial filters when url state is pre-populated', () => {
		let initialConfig = {
			filters: [
				{
					field: 'color_family',
					value: 'Blue',
					type: 'value',
					background: false,
				},
			],
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
			filters: [
				{
					field: 'color_family',
					value: 'Blue',
					type: 'value',
					background: false,
				},
			],
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
			filters: [
				{
					field: 'color_family',
					value: 'Blue',
					type: 'value',
					background: false,
				},
			],
			ignoreList: 'filter',
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
			pagination: {
				page: 3,
				pageSize: 20,
			},
		};

		const initState = setInitialUrlState(initialConfig, {});

		expect(initState).toStrictEqual({ page: 3, pageSize: 20 });
	});

	it('can set sorting init params', () => {
		let initialConfig = {
			sorts: [
				{
					field: 'title',
					direction: 'desc',
				},
			],
		};

		const initState = setInitialUrlState(initialConfig, {});

		expect(initState).toStrictEqual({ sort: { direction: 'desc', field: 'title' } });
	});

	it('can set range filter init params', () => {
		let initialConfig = {
			filters: [
				{
					field: 'price',
					value: {
						low: 35,
						high: 108,
					},
					type: 'range',
					background: false,
				},
			],
		};

		const initState = setInitialUrlState(initialConfig, {});

		expect(initState).toStrictEqual({
			filter: {
				price: {
					high: [108],
					low: [35],
				},
			},
		});
	});
});
