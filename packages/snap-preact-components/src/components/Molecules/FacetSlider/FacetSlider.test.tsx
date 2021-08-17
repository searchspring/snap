import { h } from 'preact';

import { render } from '@testing-library/preact';

import { ThemeProvider } from '../../../providers';
import { sliderFacetMock } from '../../../mocks/searchResponse';
import { FacetSlider } from './FacetSlider';
import { sprintf } from '../../../utilities';

describe('Slider Component', () => {
	const theme = {
		components: {
			slider: {
				trackColor: 'rgb(255, 0, 0)',
				railColor: 'rgb(0, 255, 0)',
				handleColor: 'rgb(0, 0, 255)',
			},
		},
	};
	const args = {
		facet: sliderFacetMock,
	};

	it('renders', () => {
		const rendered = render(<FacetSlider {...args} />);
		const sliderElement = rendered.container.querySelector('.ss__slider');
		expect(sliderElement).toBeInTheDocument();
	});

	it('has both slide handles', () => {
		const rendered = render(<FacetSlider {...args} />);
		const sliderHandles = rendered.container.querySelectorAll('.ss__slider__handle');
		expect(sliderHandles.length).toBe(2);
	});

	it('both handles are where they should be and have proper text', () => {
		const rendered = render(<FacetSlider {...args} />);
		const sliderMarks = rendered.container.querySelectorAll('.ss__slider__handle label');

		expect(sliderMarks[0].textContent).toEqual(sprintf(args.facet.formatValue, args.facet.active.low));
		expect(sliderMarks[1].textContent).toEqual(sprintf(args.facet.formatValue, args.facet.active.high));
	});

	it('has custom track, rail, and handle colors', () => {
		const colorArgs = {
			trackColor: 'rgb(100, 0, 0)',
			railColor: 'rgb(0, 100, 0)',
			handleColor: 'rgb(0, 0, 100)',
		};
		const rendered = render(<FacetSlider {...args} {...colorArgs} />);
		const trackElement = rendered.container.querySelector('.ss__slider__segment');
		let styles = getComputedStyle(trackElement);
		expect(styles.backgroundColor).toBe(colorArgs.trackColor);

		const railElement = rendered.container.querySelector('.ss__slider .ss__slider__rail');
		styles = getComputedStyle(railElement);
		expect(styles.backgroundColor).toBe(colorArgs.railColor);

		const handleElement = rendered.container.querySelector('.ss__slider .ss__slider__handle');
		styles = getComputedStyle(handleElement);
		expect(styles.backgroundColor).toBe(colorArgs.handleColor);
	});

	it('is themeable with ThemeProvider', () => {
		const rendered = render(
			<ThemeProvider theme={theme}>
				<FacetSlider {...args} />
			</ThemeProvider>
		);
		const trackElement = rendered.container.querySelector('.ss__slider__segment');
		let styles = getComputedStyle(trackElement);
		expect(styles.backgroundColor).toBe(theme.components.slider.trackColor);

		const railElement = rendered.container.querySelector('.ss__slider .ss__slider__rail');
		styles = getComputedStyle(railElement);
		expect(styles.backgroundColor).toBe(theme.components.slider.railColor);

		const handleElement = rendered.container.querySelector('.ss__slider .ss__slider__handle');
		styles = getComputedStyle(handleElement);
		expect(styles.backgroundColor).toBe(theme.components.slider.handleColor);
	});

	it('is themeable with theme prop', () => {
		const rendered = render(<FacetSlider {...args} theme={theme} />);
		const trackElement = rendered.container.querySelector('.ss__slider__segment');
		let styles = getComputedStyle(trackElement);
		expect(styles.backgroundColor).toBe(theme.components.slider.trackColor);

		const railElement = rendered.container.querySelector('.ss__slider .ss__slider__rail');
		styles = getComputedStyle(railElement);
		expect(styles.backgroundColor).toBe(theme.components.slider.railColor);

		const handleElement = rendered.container.querySelector('.ss__slider .ss__slider__handle');
		styles = getComputedStyle(handleElement);
		expect(styles.backgroundColor).toBe(theme.components.slider.handleColor);
	});

	it('is themeable with theme prop overrides ThemeProvider', () => {
		const themeOverride = {
			components: {
				slider: {
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
		const trackElement = rendered.container.querySelector('.ss__slider__segment');
		let styles = getComputedStyle(trackElement);
		expect(styles.backgroundColor).toBe(themeOverride.components.slider.trackColor);

		const railElement = rendered.container.querySelector('.ss__slider .ss__slider__rail');
		styles = getComputedStyle(railElement);
		expect(styles.backgroundColor).toBe(themeOverride.components.slider.railColor);

		const handleElement = rendered.container.querySelector('.ss__slider .ss__slider__handle');
		styles = getComputedStyle(handleElement);
		expect(styles.backgroundColor).toBe(themeOverride.components.slider.handleColor);
	});
});
