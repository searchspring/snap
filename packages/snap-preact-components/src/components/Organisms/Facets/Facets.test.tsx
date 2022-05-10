import { h } from 'preact';
import { render } from '@testing-library/preact';
import { Facets } from './Facets';
import { searchResponse } from '../../../mocks/searchResponse';
import { ThemeProvider } from '../../../providers';
import userEvent from '@testing-library/user-event';

describe('Facets Component', () => {
	it('renders', () => {
		const args = {
			facets: searchResponse.facets,
		};
		const rendered = render(<Facets {...args} />);
		const facetsElement = rendered.container.querySelector('.ss__facets');
		expect(facetsElement).toBeInTheDocument();
	});

	it('has all facets', () => {
		const args = {
			facets: searchResponse.facets,
		};
		const rendered = render(<Facets {...args} />);
		const facetsElement = rendered.container.querySelector('.ss__facets');
		const count = facetsElement!.querySelectorAll('.ss__facet').length;
		expect(count).toBe(args.facets.length);
	});

	it('has limited facets with limit prop', () => {
		const args = {
			facets: searchResponse.facets,
			limit: 2,
		};
		const rendered = render(<Facets {...args} />);
		const facetsElement = rendered.container.querySelector('.ss__facets');
		const count = facetsElement!.querySelectorAll('.ss__facet').length;
		expect(count).toBeLessThanOrEqual(args.facets.length);
		expect(count).toBe(args.limit);
	});

	it('renders with classname', () => {
		const args = {
			facets: searchResponse.facets,
			className: 'classy',
		};

		const rendered = render(<Facets {...args} />);

		const facetsElement = rendered.container.querySelector('.ss__facets');
		expect(facetsElement).toHaveClass(args.className);
	});

	it('disables styles', () => {
		const args = {
			facets: searchResponse.facets,
			disableStyles: true,
		};

		const rendered = render(<Facets {...args} />);

		const facetsElement = rendered.container.querySelector('.ss__facets');
		expect(facetsElement!.classList).toHaveLength(1);
	});
});

describe('Facets Component is themeable', () => {
	const globalTheme = {
		components: {
			facets: {
				className: 'customClassName',
			},
		},
	};

	const args = {
		facets: searchResponse.facets,
		limit: 2,
	};

	it('is themeable with ThemeProvider', () => {
		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<Facets {...args} />
			</ThemeProvider>
		);
		const facetsElement = rendered.container.querySelector('.ss__facets');
		expect(facetsElement).toHaveClass(globalTheme.components.facets.className);
	});

	it('is themeable with theme prop', () => {
		const rendered = render(<Facets {...args} theme={globalTheme} />);
		const facetsElement = rendered.container.querySelector('.ss__facets');
		expect(facetsElement).toHaveClass(globalTheme.components.facets.className);
	});

	it('is themeable with theme prop overrides ThemeProvider', () => {
		const theme = {
			components: {
				facets: {
					className: 'otherCustomClassName',
				},
			},
		};
		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<Facets {...args} theme={theme} />
			</ThemeProvider>
		);
		const facetsElement = rendered.container.querySelector('.ss__facets');
		expect(facetsElement).toHaveClass(theme.components.facets.className);
		expect(facetsElement).not.toHaveClass(globalTheme.components.facets.className);
	});

	it('can pass child component props via the theme', () => {
		const clickFunc = jest.fn();
		const theme2 = {
			components: {
				facetListOptions: {
					onClick: clickFunc,
				},
			},
		};

		const rendered = render(<Facets {...args} theme={theme2} />);

		expect(clickFunc).not.toHaveBeenCalled();

		const resultElement = rendered.container.querySelector('.ss__facet-list-options__option');
		userEvent.click(resultElement!);

		expect(clickFunc).toHaveBeenCalled();
	});
});
