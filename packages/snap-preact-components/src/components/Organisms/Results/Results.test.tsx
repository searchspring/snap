import { h } from 'preact';
import { render, waitFor } from '@testing-library/preact';
import { Results } from './Results';
import { Layout } from '../../../types';
import { ThemeProvider } from '../../../providers';
import userEvent from '@testing-library/user-event';
import type { SearchResultStore } from '@searchspring/snap-store-mobx';

import { MockData } from '@searchspring/snap-shared';
import { SearchResponseModel } from '@searchspring/snapi-types';

const mockData = new MockData();
const searchResponse: SearchResponseModel = mockData.search();

const mockResults = searchResponse.results as SearchResultStore;

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
		const rendered = render(<Results layout={Layout.GRID} results={mockResults} />);
		const resultElement = rendered.getByText(mockResults[0].mappings.core?.name!);
		expect(resultElement).toBeInTheDocument();

		const results = rendered.container.querySelector('.ss__result')!;
		const styles = getComputedStyle(results);
		expect(styles['flex-direction' as keyof CSSStyleDeclaration]).toBe('column');
	});

	it('renders list view', () => {
		const rendered = render(<Results layout={Layout.LIST} results={mockResults} />);
		const resultElement = rendered.getByText(mockResults[0].mappings.core?.name!);
		expect(resultElement).toBeInTheDocument();

		const result = rendered.container.querySelector('.ss__result')!;
		const resultStyles = getComputedStyle(result);
		expect(resultStyles['flex-direction' as keyof CSSStyleDeclaration]).toBe('row');

		const results = rendered.container.querySelector('.ss__results')!;
		const resultsStyles = getComputedStyle(results);
		expect(resultsStyles['grid-template-columns' as keyof CSSStyleDeclaration]).toBe('repeat(1, 1fr)');
	});

	it('renders all', () => {
		const rendered = render(<Results layout={Layout.GRID} results={mockResults} />);
		const results = rendered.container.querySelectorAll('.ss__results__result');
		expect(results.length).toBe(mockResults.length);
	});

	it('renders correct number of products when passing rows and columns', () => {
		const args = {
			rows: 2,
			columns: 3,
		};

		const rendered = render(<Results layout={Layout.GRID} results={mockResults} {...args} />);
		const results = rendered.container.querySelectorAll('.ss__result');
		expect(results.length).toBe(args.columns * args.rows);
	});

	it('renders custom rows and gapsize', () => {
		const args = {
			columns: 6,
			gapSize: '40px',
		};

		const rendered = render(<Results layout={Layout.GRID} results={mockResults} {...args} />);
		const resultsElement = rendered.container.querySelector('.ss__results')!;
		const resultsElementStyles = getComputedStyle(resultsElement);

		expect(resultsElementStyles.gridTemplateColumns).toBe(`repeat(${args.columns}, 1fr)`);

		const result = rendered.container.querySelector('.ss__result')!;

		expect(result).toBeInTheDocument();
		const resultStyles = getComputedStyle(result);
		expect(resultStyles.marginRight).toBe(args.gapSize);
		expect(resultStyles.marginBottom).toBe(args.gapSize);
	});

	it('can use breakpoints', async () => {
		const customBreakpoints = {
			0: {
				layout: Layout.GRID,
			},
			700: {
				layout: Layout.LIST,
			},
		};

		const args = {
			breakpoints: customBreakpoints,
		};
		const rendered = render(<Results results={mockResults} {...args} />);
		const resultsElement = rendered.container.querySelector('.ss__results');

		expect(resultsElement).toBeInTheDocument();
		expect(resultsElement).toHaveClass('ss__results-list');

		// Change the viewport to 500px.
		global.innerWidth = 500;

		// Trigger the window resize event.
		global.dispatchEvent(new Event('resize'));

		// to deal with render delay
		await waitFor(() => {
			expect(resultsElement).toHaveClass('ss__results-grid');
		});
	});

	it('renders with classname', () => {
		const className = 'classy';
		const rendered = render(<Results results={mockResults} className={className} />);

		const resultsElement = rendered.container.querySelector('.ss__results');
		expect(resultsElement).toBeInTheDocument();
		expect(resultsElement).toHaveClass(className);
	});

	it('can disable styles', () => {
		const rendered = render(<Results results={mockResults} disableStyles />);

		const resultsElement = rendered.container.querySelector('.ss__results');

		expect(resultsElement?.classList).toHaveLength(2);
	});

	it('is themeable with ThemeProvider', () => {
		const args = {
			layout: Layout.GRID,
			results: mockResults,
		};
		const rendered = render(
			<ThemeProvider theme={theme}>
				<Results {...args} />
			</ThemeProvider>
		);
		const resultsElement = rendered.container.querySelector('.ss__results')!;
		const styles = getComputedStyle(resultsElement);
		expect(styles.backgroundColor).toBe(theme.components.results.style.backgroundColor);
	});

	it('is themeable with theme prop', () => {
		const args = {
			layout: Layout.GRID,
			results: mockResults,
		};
		const rendered = render(<Results {...args} theme={theme} />);
		const resultsElement = rendered.container.querySelector('.ss__results')!;
		const styles = getComputedStyle(resultsElement);
		expect(styles.backgroundColor).toBe(theme.components.results.style.backgroundColor);
	});

	it('is themeable with theme prop overrides ThemeProvider', () => {
		const args = {
			layout: Layout.GRID,
			results: mockResults,
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
		const resultsElement = rendered.container.querySelector('.ss__results')!;
		const styles = getComputedStyle(resultsElement);
		expect(styles.backgroundColor).toBe(themeOverride.components.results.style.backgroundColor);
	});

	it('can pass child component props via the theme', () => {
		const clickFunc = jest.fn();
		const theme2 = {
			components: {
				result: {
					onClick: clickFunc,
				},
			},
		};

		const args = {
			layout: Layout.GRID,
			results: mockResults,
		};
		const rendered = render(
			<ThemeProvider theme={theme2}>
				<Results {...args} />
			</ThemeProvider>
		);
		expect(clickFunc).not.toHaveBeenCalled();

		const resultElement = rendered.container.querySelector('.ss__results .ss__result a')!;
		userEvent.click(resultElement);

		expect(clickFunc).toHaveBeenCalled();
	});
});
