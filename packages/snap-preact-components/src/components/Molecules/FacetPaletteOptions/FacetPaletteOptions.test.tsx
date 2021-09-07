import { h } from 'preact';

import { render } from '@testing-library/preact';

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
		const styles = getComputedStyle(paletteElement);
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
		const styles = getComputedStyle(paletteElement);
		expect(styles['grid-template-columns']).toBe(
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
		const styles = getComputedStyle(paletteElement);
		expect(styles['grid-template-columns']).toBe(
			`repeat(${themeOverride.components.facetPaletteOptions.columns}, calc((100% - (${
				themeOverride.components.facetPaletteOptions.columns - 1
			} * 8px))/ ${themeOverride.components.facetPaletteOptions.columns}))`
		);
	});
});
