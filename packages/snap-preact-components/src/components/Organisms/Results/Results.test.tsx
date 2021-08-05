import { h } from 'preact';
import { render } from '@testing-library/preact';
import { Results } from './Results';
import { searchResponse } from '../../../mocks/searchResponse';
import { Layout } from '../../../types';
import { ThemeProvider } from '../../../providers';

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

		const results = rendered.container.querySelector('.ss__result');
		const styles = getComputedStyle(results);
		expect(styles['flex-direction']).toBe('column');
	});

	it('renders list view', () => {
		const rendered = render(<Results layout={Layout.LIST} results={searchResponse.results} />);
		const resultElement = rendered.getByText(searchResponse.results[0].mappings.core.name);
		expect(resultElement).toBeInTheDocument();

		const result = rendered.container.querySelector('.ss__result');
		const resultStyles = getComputedStyle(result);
		expect(resultStyles['flex-direction']).toBe('row');

		const results = rendered.container.querySelector('.ss__results');
		const resultsStyles = getComputedStyle(results);
		expect(resultsStyles['grid-template-columns']).toBe('repeat(1, 1fr)');
	});

	it('renders all', () => {
		const rendered = render(<Results layout={Layout.GRID} results={searchResponse.results} />);
		const results = rendered.container.querySelectorAll('.ss__results__result');
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
		const resultsElement = rendered.container.querySelector('.ss__results');
		const styles = getComputedStyle(resultsElement);
		expect(styles.backgroundColor).toBe(theme.components.results.style.backgroundColor);
	});

	it('is themeable with theme prop', () => {
		const args = {
			layout: Layout.GRID,
			results: searchResponse.results,
		};
		const rendered = render(<Results {...args} theme={theme} />);
		const resultsElement = rendered.container.querySelector('.ss__results');
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
		const resultsElement = rendered.container.querySelector('.ss__results');
		const styles = getComputedStyle(resultsElement);
		expect(styles.backgroundColor).toBe(themeOverride.components.results.style.backgroundColor);
	});
});
