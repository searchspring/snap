import { h } from 'preact';
import { render } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';

import { FacetPaletteOptions } from './FacetPaletteOptions';
import { paletteFacetMock } from '../../../mocks/searchResponse';
import { ThemeProvider } from '../../../providers';

describe('FacetPaletteOptions Component', () => {
	const theme = {
		components: {
			facetPaletteOptions: {
				columns: 6,
			},
		},
	};

	it('renders', () => {
		const rendered = render(<FacetPaletteOptions values={paletteFacetMock.values} />);
		const paletteElement = rendered.container.querySelector('.ss__facet-palette-options');

		expect(paletteElement).toBeInTheDocument();
		expect(paletteElement).toHaveTextContent(paletteFacetMock.values[0].label);
	});

	it('Palette container element has correct number of classes', () => {
		const rendered = render(<FacetPaletteOptions values={paletteFacetMock.values} />);
		const paletteElement = rendered.container.querySelector('.ss__facet-palette-options');
		expect(paletteElement).toBeInTheDocument();
		expect(paletteElement).toHaveClass('ss__facet-palette-options');
	});

	it('maps through and renders the correct number of options', () => {
		const rendered = render(<FacetPaletteOptions values={paletteFacetMock.values} />);
		const options = rendered.container.querySelectorAll('.ss__facet-palette-options__option');
		expect(options).toHaveLength(paletteFacetMock.values.length);
	});

	it('Palette option label element has correct number of classes', () => {
		const rendered = render(<FacetPaletteOptions values={paletteFacetMock.values} />);
		const paletteOptionsElement = rendered.container.querySelectorAll('.ss__facet-palette-options__option__value');
		const inactivePaletteOption = paletteOptionsElement[1];
		const activePaletteOption = paletteOptionsElement[0];
		expect(inactivePaletteOption).toHaveClass('ss__facet-palette-options__option__value');
		expect(activePaletteOption.parentElement).toHaveClass('ss__facet-palette-options__option--filtered');
	});

	it('has icons by default', () => {
		const rendered = render(<FacetPaletteOptions values={paletteFacetMock.values} />);
		const selectedIcons = rendered.container.querySelector('.ss__icon');
		expect(selectedIcons).toBeInTheDocument();
	});

	it('hideIcons and hideLabel works as expected', () => {
		const rendered = render(<FacetPaletteOptions hideIcon={true} hideLabel={true} values={paletteFacetMock.values} />);
		const paletteOptionsElement = rendered.container.querySelector('.ss__facet-palette-options__option__value');
		const selectedIcons = rendered.container.querySelector('.ss__icon');

		expect(paletteOptionsElement).not.toBeInTheDocument();
		expect(selectedIcons).not.toBeInTheDocument();
	});

	it('can disable styling', () => {
		const rendered = render(<FacetPaletteOptions values={paletteFacetMock.values} disableStyles={true} />);

		const paletteElement = rendered.container.querySelector('.ss__facet-palette-options');
		expect(paletteElement?.classList.length).toBe(1);
	});

	it('renders with classname', () => {
		const className = 'classy';
		const rendered = render(<FacetPaletteOptions values={paletteFacetMock.values} className={className} />);

		const paletteElement = rendered.container.querySelector('.ss__facet-palette-options');
		expect(paletteElement).toBeInTheDocument();
		expect(paletteElement).toHaveClass(className);
	});

	it('can set custom onClick func', () => {
		const onClickFunc = jest.fn();
		const rendered = render(<FacetPaletteOptions values={paletteFacetMock.values} onClick={onClickFunc} />);

		const paletteElement = rendered.container.querySelector('.ss__facet-palette-options__option');
		expect(paletteElement).toBeInTheDocument();
		userEvent.click(paletteElement!);
		expect(onClickFunc).toHaveBeenCalled();
	});

	it('can change gapsize and columns', () => {
		const args = {
			gapSize: '10px',
			columns: 2,
		};
		const rendered = render(<FacetPaletteOptions values={paletteFacetMock.values} {...args} />);

		const paletteElement = rendered.container.querySelector('.ss__facet-palette-options');
		expect(paletteElement).toBeInTheDocument();
		const styles = getComputedStyle(paletteElement!);
		expect(styles?.gap).toBe(args.gapSize);
		expect(styles?.gridTemplateColumns).toBe(`repeat(${args.columns}, calc((100% - (${args.columns - 1} * ${args.gapSize}))/ ${args.columns}))`);

		const paletteOptionElement = rendered.container.querySelector('.ss__facet-palette-options__option');
		const optionStyles = getComputedStyle(paletteOptionElement!);
		expect(optionStyles?.width).toBe(`calc(100% / ${args.columns} - ${2 * Math.round((args.columns + 2) / 2)}px )`);
	});

	it('is themeable with ThemeProvider', () => {
		const args = {
			values: paletteFacetMock.values,
		};
		const rendered = render(
			<ThemeProvider theme={theme}>
				<FacetPaletteOptions {...args} />
			</ThemeProvider>
		);
		const paletteElement = rendered.container.querySelector('.ss__facet-palette-options');
		const styles = getComputedStyle(paletteElement!);
		expect(styles['grid-template-columns']).toBe(
			`repeat(${theme.components.facetPaletteOptions.columns}, calc((100% - (${theme.components.facetPaletteOptions.columns - 1} * 8px))/ ${
				theme.components.facetPaletteOptions.columns
			}))`
		);
	});

	it('is themeable with theme prop', () => {
		const args = {
			values: paletteFacetMock.values,
		};
		const rendered = render(<FacetPaletteOptions {...args} theme={theme} />);
		const paletteElement = rendered.container.querySelector('.ss__facet-palette-options');
		const styles = getComputedStyle(paletteElement!);
		expect(styles['grid-template-columns']!).toBe(
			`repeat(${theme.components.facetPaletteOptions.columns}, calc((100% - (${theme.components.facetPaletteOptions.columns - 1} * 8px))/ ${
				theme.components.facetPaletteOptions.columns
			}))`
		);
	});

	it('is themeable with theme prop overrides ThemeProvider', () => {
		const args = {
			values: paletteFacetMock.values,
		};
		const themeOverride = {
			components: {
				facetPaletteOptions: {
					columns: 3,
				},
			},
		};
		const rendered = render(
			<ThemeProvider theme={theme}>
				<FacetPaletteOptions {...args} theme={themeOverride} />
			</ThemeProvider>
		);
		const paletteElement = rendered.container.querySelector('.ss__facet-palette-options');
		const styles = getComputedStyle(paletteElement!);
		expect(styles['grid-template-columns']!).toBe(
			`repeat(${themeOverride.components.facetPaletteOptions.columns}, calc((100% - (${
				themeOverride.components.facetPaletteOptions.columns - 1
			} * 8px))/ ${themeOverride.components.facetPaletteOptions.columns}))`
		);
	});
});
