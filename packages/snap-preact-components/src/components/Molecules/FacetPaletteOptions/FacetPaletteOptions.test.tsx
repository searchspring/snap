import { h } from 'preact';

import { render } from '@testing-library/preact';

import { FacetPaletteOptions } from './FacetPaletteOptions';
import { paletteFacetMock } from '../../../mocks/searchResponse';
import { ThemeProvider } from '../../../providers/theme';

describe('FacetPaletteOptions Component', () => {
	const theme = {
		components: {
			facetpaletteoptions: {
				columns: 6,
			},
		},
	};

	it('renders', () => {
		const rendered = render(<FacetPaletteOptions values={paletteFacetMock.values} />);
		const paletteElement = rendered.container.querySelector('.ss-palette');

		expect(paletteElement).toBeInTheDocument();
		expect(paletteElement).toHaveTextContent(paletteFacetMock.values[0].label);
	});

	it('Palette container element has correct number of classes', () => {
		const rendered = render(<FacetPaletteOptions values={paletteFacetMock.values} />);
		const paletteElement = rendered.container.querySelector('.ss-palette');
		expect(paletteElement).toBeInTheDocument();
		expect(paletteElement).toHaveClass('ss-palette');
	});

	it('maps through and renders the correct number of options', () => {
		const rendered = render(<FacetPaletteOptions values={paletteFacetMock.values} />);
		const options = rendered.container.querySelectorAll('.ss-palette-option');
		expect(options).toHaveLength(paletteFacetMock.values.length);
	});

	it('Palette option label element has correct number of classes', () => {
		const rendered = render(<FacetPaletteOptions values={paletteFacetMock.values} />);
		const paletteOptionsElement = rendered.container.querySelectorAll('.ss-label');
		const inactivePaletteOption = paletteOptionsElement[1];
		const activePaletteOption = paletteOptionsElement[0];
		expect(inactivePaletteOption).toHaveClass('ss-label');
		expect(activePaletteOption.className).toMatch(/filtered/);
	});

	it('has icons by default', () => {
		const rendered = render(<FacetPaletteOptions values={paletteFacetMock.values} />);
		const selectedIcons = rendered.container.querySelector('.ss-icon');
		expect(selectedIcons).toBeInTheDocument();
	});

	it('hideIcons and hideLabel works as expected', () => {
		const rendered = render(<FacetPaletteOptions hideIcon={true} hideLabel={true} values={paletteFacetMock.values} />);
		const paletteOptionsElement = rendered.container.querySelector('.ss-label');
		const selectedIcons = rendered.container.querySelector('.ss-icon');

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
		const paletteElement = rendered.container.querySelector('.ss-palette');
		const styles = getComputedStyle(paletteElement);
		expect(styles['grid-template-columns']).toBe(
			`repeat(${theme.components.facetpaletteoptions.columns}, calc((100% - (${theme.components.facetpaletteoptions.columns - 1} * 8px))/ ${
				theme.components.facetpaletteoptions.columns
			}))`
		);
	});

	it('is themeable with theme prop', () => {
		const args = {
			values: paletteFacetMock.values,
		};
		const rendered = render(<FacetPaletteOptions {...args} theme={theme} />);
		const paletteElement = rendered.container.querySelector('.ss-palette');
		const styles = getComputedStyle(paletteElement);
		expect(styles['grid-template-columns']).toBe(
			`repeat(${theme.components.facetpaletteoptions.columns}, calc((100% - (${theme.components.facetpaletteoptions.columns - 1} * 8px))/ ${
				theme.components.facetpaletteoptions.columns
			}))`
		);
	});

	it('is themeable with theme prop overrides ThemeProvider', () => {
		const args = {
			values: paletteFacetMock.values,
		};
		const themeOverride = {
			components: {
				facetpaletteoptions: {
					columns: 3,
				},
			},
		};
		const rendered = render(
			<ThemeProvider theme={theme}>
				<FacetPaletteOptions {...args} theme={themeOverride} />
			</ThemeProvider>
		);
		const paletteElement = rendered.container.querySelector('.ss-palette');
		const styles = getComputedStyle(paletteElement);
		expect(styles['grid-template-columns']).toBe(
			`repeat(${themeOverride.components.facetpaletteoptions.columns}, calc((100% - (${
				themeOverride.components.facetpaletteoptions.columns - 1
			} * 8px))/ ${themeOverride.components.facetpaletteoptions.columns}))`
		);
	});
});
