import { h } from 'preact';

import { render } from '@testing-library/preact';

import { ThemeProvider } from '../../../providers';
import themes from '../../../themes';

import { FacetSlider } from './FacetSlider';
import { sprintf } from '../../../utilities';
import type { RangeFacet } from '@searchspring/snap-store-mobx';

import { MockData } from '@searchspring/snap-shared';
import { SearchResponseModelFacet, SearchResponseModelFacetRangeAllOf } from '@searchspring/snapi-types';

const mockData = new MockData();
const sliderFacetMock: SearchResponseModelFacet & SearchResponseModelFacetRangeAllOf = mockData
	.search()
	.facets!.filter((facet) => facet.type == 'range')!
	.pop()!;

describe('Slider Component', () => {
	const args = {
		facet: sliderFacetMock as RangeFacet,
	};

	Object.keys(themes || {}).forEach((themeName) => {
		it(`uses ${themeName} theme`, () => {
			const theme = themes[themeName as keyof typeof themes];
			const rendered = render(<FacetSlider theme={theme} {...args} />);
			expect(rendered.asFragment()).toMatchSnapshot();
		});
	});

	const theme = {
		components: {
			facetSlider: {
				trackColor: 'rgb(255, 0, 0)',
				railColor: 'rgb(0, 255, 0)',
				handleColor: 'rgb(0, 0, 255)',
			},
		},
	};

	it('renders', () => {
		const rendered = render(<FacetSlider {...args} />);
		const sliderElement = rendered.container.querySelector('.ss__facet-slider');
		expect(sliderElement).toBeInTheDocument();
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('has both slide handles', () => {
		const rendered = render(<FacetSlider {...args} />);
		const sliderHandles = rendered.container.querySelectorAll('.ss__facet-slider__handle');
		expect(sliderHandles.length).toBe(2);
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('both handles are where they should be and have proper text', () => {
		const rendered = render(<FacetSlider {...args} />);
		const sliderMarks = rendered.container.querySelectorAll('.ss__facet-slider__label');
		expect(sliderMarks[0].textContent).toEqual(sprintf(args.facet.formatValue, args.facet.active?.low));
		expect(sliderMarks[1].textContent).toEqual(sprintf(args.facet.formatValue, args.facet.active?.high));
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('has custom track, rail, and handle colors', () => {
		const colorArgs = {
			trackColor: 'rgb(100, 0, 0)',
			railColor: 'rgb(0, 100, 0)',
			handleColor: 'rgb(0, 0, 100)',
		};
		const rendered = render(<FacetSlider {...args} {...colorArgs} />);
		const trackElement = rendered.container.querySelector('.ss__facet-slider__segment')!;
		let styles = getComputedStyle(trackElement);
		expect(styles.backgroundColor).toBe(colorArgs.trackColor);

		const railElement = rendered.container.querySelector('.ss__facet-slider .ss__facet-slider__rail')!;
		styles = getComputedStyle(railElement);
		expect(styles.backgroundColor).toBe(colorArgs.railColor);

		const handleElement = rendered.container.querySelector('.ss__facet-slider .ss__facet-slider__handle')!;
		styles = getComputedStyle(handleElement);
		expect(styles.backgroundColor).toBe(colorArgs.handleColor);
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('can disable styling', () => {
		const rendered = render(<FacetSlider {...args} disableStyles={true} />);

		const paletteElement = rendered.container.querySelector('.ss__facet-slider');
		expect(paletteElement?.classList.length).toBe(1);
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('renders with classname', () => {
		const className = 'classy';
		const rendered = render(<FacetSlider {...args} className={className} />);

		const paletteElement = rendered.container.querySelector('.ss__facet-slider');
		expect(paletteElement).toBeInTheDocument();
		expect(paletteElement).toHaveClass(className);
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('is themeable with ThemeProvider', () => {
		const rendered = render(
			<ThemeProvider theme={theme}>
				<FacetSlider {...args} />
			</ThemeProvider>
		);
		const trackElement = rendered.container.querySelector('.ss__facet-slider__segment')!;
		let styles = getComputedStyle(trackElement);
		expect(styles.backgroundColor).toBe(theme.components.facetSlider.trackColor);

		const railElement = rendered.container.querySelector('.ss__facet-slider .ss__facet-slider__rail')!;
		styles = getComputedStyle(railElement);
		expect(styles.backgroundColor).toBe(theme.components.facetSlider.railColor);

		const handleElement = rendered.container.querySelector('.ss__facet-slider .ss__facet-slider__handle')!;
		styles = getComputedStyle(handleElement);
		expect(styles.backgroundColor).toBe(theme.components.facetSlider.handleColor);
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('is themeable with theme prop', () => {
		const rendered = render(<FacetSlider {...args} theme={theme} />);
		const trackElement = rendered.container.querySelector('.ss__facet-slider__segment')!;
		let styles = getComputedStyle(trackElement);
		expect(styles.backgroundColor).toBe(theme.components.facetSlider.trackColor);

		const railElement = rendered.container.querySelector('.ss__facet-slider .ss__facet-slider__rail')!;
		styles = getComputedStyle(railElement);
		expect(styles.backgroundColor).toBe(theme.components.facetSlider.railColor);

		const handleElement = rendered.container.querySelector('.ss__facet-slider .ss__facet-slider__handle')!;
		styles = getComputedStyle(handleElement);
		expect(styles.backgroundColor).toBe(theme.components.facetSlider.handleColor);
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('is themeable with theme prop overrides ThemeProvider', () => {
		const themeOverride = {
			components: {
				facetSlider: {
					trackColor: 'rgb(123, 0, 0)',
					railColor: 'rgb(0, 123, 0)',
					handleColor: 'rgb(0, 0, 123)',
				},
			},
		};
		const rendered = render(
			<ThemeProvider theme={theme}>
				<FacetSlider {...args} theme={themeOverride} />
			</ThemeProvider>
		);
		const trackElement = rendered.container.querySelector('.ss__facet-slider__segment')!;
		let styles = getComputedStyle(trackElement);
		expect(styles.backgroundColor).toBe(themeOverride.components.facetSlider.trackColor);

		const railElement = rendered.container.querySelector('.ss__facet-slider .ss__facet-slider__rail')!;
		styles = getComputedStyle(railElement);
		expect(styles.backgroundColor).toBe(themeOverride.components.facetSlider.railColor);

		const handleElement = rendered.container.querySelector('.ss__facet-slider .ss__facet-slider__handle')!;
		styles = getComputedStyle(handleElement);
		expect(styles.backgroundColor).toBe(themeOverride.components.facetSlider.handleColor);
		expect(rendered.asFragment()).toMatchSnapshot();
	});
});
