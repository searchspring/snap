import { h } from 'preact';
import { render, waitFor } from '@testing-library/preact';
import { Results } from './Results';
import { ResultsLayout as Layout } from '../../../types';
import { Theme, ThemeProvider } from '../../../providers';
import userEvent from '@testing-library/user-event';
import { SearchResultStore } from '@searchspring/snap-store-mobx';
import { UrlManager, UrlTranslator } from '@searchspring/snap-url-manager';

import { MockData } from '@searchspring/snap-shared';

const mockData = new MockData();
const searchResponse = mockData.searchMeta();

const mockResults = new SearchResultStore(
	{ id: 'test' },
	{ urlManager: new UrlManager(new UrlTranslator()) },
	searchResponse.meta,
	searchResponse.results,
	searchResponse.pagination,
	searchResponse.merchandising
);

describe('Results Component', () => {
	const DetailSlot = () => {
		return <div className="detail-slot">details...</div>;
	};

	const theme = {
		components: {
			results: {
				style: {
					backgroundColor: 'red',
				},
			},
			result: {
				detailSlot: [<DetailSlot />],
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

	it('can pass child component props via the theme', () => {
		const clickFunc = jest.fn();
		const theme2 = {
			components: {
				result: {
					onClick: (e: React.MouseEvent<HTMLAnchorElement, Event>) => {
						e.preventDefault();
						clickFunc();
					},
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

		const ThemeDetailSlot = () => {
			return <div className="theme-detail-slot">theme details...</div>;
		};

		const componentTheme = {
			components: {
				results: {
					style: {
						backgroundColor: 'blue',
					},
				},
				result: {
					detailSlot: [<ThemeDetailSlot />],
				},
			},
		};

		const rendered = render(
			<ThemeProvider theme={theme}>
				<Results {...args} theme={componentTheme} />
			</ThemeProvider>
		);

		const resultsElement = rendered.container.querySelector('.ss__results')!;
		const styles = getComputedStyle(resultsElement);
		expect(styles.backgroundColor).toBe(componentTheme.components.results.style.backgroundColor);

		const themeDetailSlots = rendered.container.querySelectorAll('.theme-detail-slot');
		expect(themeDetailSlots).toHaveLength(30);

		const globalDetailSlots = rendered.container.querySelectorAll('.detail-slot');
		expect(globalDetailSlots).toHaveLength(0);
	});

	it('breakpoints override theme prop', async () => {
		// Change the viewport to 1200px.
		global.innerWidth = 1200;

		// Trigger the window resize event.
		global.dispatchEvent(new Event('resize'));

		const ThemeDetailSlot = () => {
			return <div className="theme-detail-slot">theme details...</div>;
		};

		const BreakPointDetailSlot = () => {
			return <div className="breakpoint-detail-slot">breakpoint details...</div>;
		};

		const componentTheme = {
			components: {
				results: {
					style: {
						backgroundColor: 'blue',
					},
				},
				result: {
					detailSlot: [<ThemeDetailSlot />],
				},
			},
		};

		const customBreakpoints = {
			0: {
				columns: 3,
				rows: 2,
			},
			700: {
				columns: 3,
				rows: 3,
				theme: {
					components: {
						results: {
							// TODO: need to support this!
							// style: {
							// 	backgroundColor: 'red',
							// },
						},
						result: {
							detailSlot: [<BreakPointDetailSlot />],
						},
					},
				},
			},
		};

		const args = {
			layout: Layout.GRID,
			results: mockResults,
			breakpoints: customBreakpoints,
			theme: componentTheme,
		};

		const rendered = render(
			<ThemeProvider theme={theme}>
				<Results {...args} />
			</ThemeProvider>
		);

		await waitFor(() => {
			const resultsElement = rendered.container.querySelector('.ss__results')!;

			const styles = getComputedStyle(resultsElement);
			expect(styles.backgroundColor).toBe(componentTheme.components.results.style.backgroundColor);

			const themeDetailSlots = rendered.container.querySelectorAll('.theme-detail-slot');
			expect(themeDetailSlots).toHaveLength(0);

			const globalDetailSlots = rendered.container.querySelectorAll('.detail-slot');
			expect(globalDetailSlots).toHaveLength(0);

			const breakpointDetailSlots = rendered.container.querySelectorAll('.breakpoint-detail-slot');
			expect(breakpointDetailSlots).toHaveLength(9);
		});

		// Change the viewport to 500px.
		global.innerWidth = 500;

		// Trigger the window resize event.
		global.dispatchEvent(new Event('resize'));

		// after resize the detailSlot should go back to using what is in the theme
		await waitFor(() => {
			const resultsElement = rendered.container.querySelector('.ss__results')!;

			const styles = getComputedStyle(resultsElement);
			expect(styles.backgroundColor).toBe(componentTheme.components.results.style.backgroundColor);

			const themeDetailSlots = rendered.container.querySelectorAll('.theme-detail-slot');
			expect(themeDetailSlots).toHaveLength(6);

			const globalDetailSlots = rendered.container.querySelectorAll('.detail-slot');
			expect(globalDetailSlots).toHaveLength(0);

			const breakpointDetailSlots = rendered.container.querySelectorAll('.breakpoint-detail-slot');
			expect(breakpointDetailSlots).toHaveLength(0);
		});
	});
});
