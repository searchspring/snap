import { h } from 'preact';
import { render } from '@testing-library/preact';
import { Results } from './Results';
import { searchResponse } from '../../../mocks/searchResponse';
import { Layout } from '../../../types';
import { ThemeProvider } from '../../../providers/theme';

describe('Results Component', () => {
	const theme = {
		components: {
			results: {
				style: {
					backgroundColor: 'red',
				},
			},
		},
	};
	it('renders grid view', () => {
		const rendered = render(<Results layout={Layout.GRID} results={searchResponse.results} />);
		const resultElement = rendered.getByText(searchResponse.results[0].mappings.core.name);
		expect(resultElement).toBeInTheDocument();

		const results = rendered.container.querySelector('.ss-results');
		const styles = getComputedStyle(results);
		expect(styles['flex-direction']).not.toBe('column');
	});

	it('renders list view', () => {
		const rendered = render(<Results layout={Layout.LIST} results={searchResponse.results} />);
		const resultElement = rendered.getByText(searchResponse.results[0].mappings.core.name);
		expect(resultElement).toBeInTheDocument();

		const results = rendered.container.querySelector('.ss-results');
		const styles = getComputedStyle(results);
		expect(styles['flex-direction']).toBe('column');
	});

	it('renders all', () => {
		const rendered = render(<Results layout={Layout.GRID} results={searchResponse.results} />);
		const results = rendered.container.querySelectorAll('.ss-results__result');
		expect(results.length).toBe(searchResponse.results.length);
	});

	it('is themeable with ThemeProvider', () => {
		const args = {
			layout: Layout.GRID,
			results: searchResponse.results,
		};
		const rendered = render(
			<ThemeProvider theme={theme}>
				<Results {...args} />
			</ThemeProvider>
		);
		const resultsElement = rendered.container.querySelector('.ss-results');
		const styles = getComputedStyle(resultsElement);
		expect(styles.backgroundColor).toBe(theme.components.results.style.backgroundColor);
	});

	it('is themeable with theme prop', () => {
		const args = {
			layout: Layout.GRID,
			results: searchResponse.results,
		};
		const rendered = render(<Results {...args} theme={theme} />);
		const resultsElement = rendered.container.querySelector('.ss-results');
		const styles = getComputedStyle(resultsElement);
		expect(styles.backgroundColor).toBe(theme.components.results.style.backgroundColor);
	});

	it('is themeable with theme prop overrides ThemeProvider', () => {
		const args = {
			layout: Layout.GRID,
			results: searchResponse.results,
		};
		const themeOverride = {
			components: {
				results: {
					style: {
						backgroundColor: 'blue',
					},
				},
			},
		};
		const rendered = render(
			<ThemeProvider theme={theme}>
				<Results {...args} theme={themeOverride} />
			</ThemeProvider>
		);
		const resultsElement = rendered.container.querySelector('.ss-results');
		const styles = getComputedStyle(resultsElement);
		expect(styles.backgroundColor).toBe(themeOverride.components.results.style.backgroundColor);
	});
});
