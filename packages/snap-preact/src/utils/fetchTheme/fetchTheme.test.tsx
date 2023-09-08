import { fetchTheme } from './fetchTheme';
import { themeMap } from '../../Templates/themes';
import { PikeTheme, PikeVariables, Theme } from '@searchspring/snap-preact-components';

describe('fetchTheme function', () => {
	let pikeTheme: Theme;

	beforeAll(async () => {
		pikeTheme = await themeMap['pike']();
	});

	it('provides a theme', async () => {
		const theme = await fetchTheme({ name: 'pike', import: themeMap['pike'] });

		expect(theme).toStrictEqual(pikeTheme);
	});

	it('will merge any provided overrides into the theme', async () => {
		const overrides = {
			extras: {
				thing: 'stuff',
			},
		};

		const theme = await fetchTheme({
			name: 'pike',
			import: themeMap['pike'],
			overrides,
		});

		expect(theme).toStrictEqual({ ...pikeTheme, ...overrides });
	});

	it('will merge any provided variables into the theme', async () => {
		const variables: PikeVariables = {
			breakpoints: [100, 200, 300, 400],
			color: {
				primary: 'orange',
				secondary: 'blue',
			},
		};

		const theme = await fetchTheme({
			name: 'pike',
			import: themeMap['pike'],
			variables,
		});

		expect(theme).toStrictEqual({ ...pikeTheme, variables });
	});

	it('will merge any provided variables into overrides and then merge that into the theme', async () => {
		const variables: PikeVariables = {
			breakpoints: [100, 200, 300, 400],
			color: {
				primary: 'pink',
				secondary: 'purple',
			},
		};

		const overrides = {
			extras: {
				thing: 'stuff',
			},
			variables: {
				breakpoints: [500, 600, 700, 800],
				color: {
					primary: 'black',
					secondary: 'green',
				},
			},
		};

		const theme = await fetchTheme({
			name: 'pike',
			import: themeMap['pike'],
			variables,
			overrides,
		});

		expect(theme).toStrictEqual({ ...pikeTheme, variables, extras: { ...overrides.extras } });
	});

	it('will merge arrays of objects', async () => {
		const overrides: Partial<PikeTheme> = {
			responsive: [
				{
					components: {
						autocomplete: {
							hideFacets: true,
						},
					},
				},
				{},
				{},
				{},
			],
		};

		const theme = await fetchTheme({
			name: 'pike',
			import: themeMap['pike'],
			overrides,
		});

		expect(theme).toStrictEqual({ ...pikeTheme, responsive: overrides.responsive });
	});
});
