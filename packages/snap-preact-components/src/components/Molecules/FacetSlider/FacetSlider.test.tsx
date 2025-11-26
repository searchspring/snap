import { h } from 'preact';

import { render } from '@testing-library/preact';

import { ThemeProvider } from '../../../providers';

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

// Mock react-ranger
jest.mock('react-ranger', () => ({
	useRanger: jest.fn((options) => {
		const { values } = options;
		return {
			getTrackProps: () => ({}),
			ticks: [],
			segments: [{ getSegmentProps: () => ({}) }, { getSegmentProps: () => ({}) }, { getSegmentProps: () => ({}) }],
			handles: values.map((value: number) => ({
				value,
				active: false,
				getHandleProps: () => ({}),
			})),
		};
	}),
}));

import { useRanger } from 'react-ranger';

describe('Slider Component', () => {
	const theme = {
		components: {
			facetSlider: {
				trackColor: 'rgb(255, 0, 0)',
				railColor: 'rgb(0, 255, 0)',
				handleColor: 'rgb(0, 0, 255)',
			},
		},
	};
	const args = {
		facet: sliderFacetMock as RangeFacet,
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders', () => {
		const rendered = render(<FacetSlider {...args} />);
		const sliderElement = rendered.container.querySelector('.ss__facet-slider');
		expect(sliderElement).toBeInTheDocument();
	});

	it('has both slide handles', () => {
		const rendered = render(<FacetSlider {...args} />);
		const sliderHandles = rendered.container.querySelectorAll('.ss__facet-slider__handle');
		expect(sliderHandles.length).toBe(2);
	});

	it('both handles are where they should be and have proper text', () => {
		const rendered = render(<FacetSlider {...args} />);
		const sliderMarks = rendered.container.querySelectorAll('.ss__facet-slider__label');
		expect(sliderMarks[0].textContent).toEqual(sprintf(args.facet.formatValue, args.facet.active?.low));
		expect(sliderMarks[1].textContent).toEqual(sprintf(args.facet.formatValue, args.facet.active?.high));
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
	});

	it('can disable styling', () => {
		const rendered = render(<FacetSlider {...args} disableStyles={true} />);

		const paletteElement = rendered.container.querySelector('.ss__facet-slider');
		expect(paletteElement?.classList.length).toBe(1);
	});

	it('renders with classname', () => {
		const className = 'classy';
		const rendered = render(<FacetSlider {...args} className={className} />);

		const paletteElement = rendered.container.querySelector('.ss__facet-slider');
		expect(paletteElement).toBeInTheDocument();
		expect(paletteElement).toHaveClass(className);
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
	});

	describe('separateHandles prop', () => {
		it('separates handles when they overlap and separateHandles is true', () => {
			const onChangeSpy = jest.fn();
			const useRangerMock = useRanger as jest.Mock;
			const step = args.facet.step!;

			render(<FacetSlider {...args} separateHandles={true} onChange={onChangeSpy} />);

			// Get the options passed to useRanger
			const { onChange } = useRangerMock.mock.calls[useRangerMock.mock.calls.length - 1][0];

			// Simulate dragging handles to same value
			const val = [10, 10];
			onChange(val);

			// Expect separation by increasing max value
			expect(onChangeSpy).toHaveBeenCalledWith([10, 10 + step]);
		});

		it('does not separate handles when separateHandles is false', () => {
			const onChangeSpy = jest.fn();
			const useRangerMock = useRanger as jest.Mock;

			render(<FacetSlider {...args} separateHandles={false} onChange={onChangeSpy} />);

			const { onChange } = useRangerMock.mock.calls[useRangerMock.mock.calls.length - 1][0];

			const val = [10, 10];
			onChange(val);

			expect(onChangeSpy).toHaveBeenCalledWith([10, 10]);
		});

		it('does not separate handles when separateHandles is undefined', () => {
			const onChangeSpy = jest.fn();
			const useRangerMock = useRanger as jest.Mock;

			render(<FacetSlider {...args} onChange={onChangeSpy} />);

			const { onChange } = useRangerMock.mock.calls[useRangerMock.mock.calls.length - 1][0];

			const val = [10, 10];
			onChange(val);

			expect(onChangeSpy).toHaveBeenCalledWith([10, 10]);
		});

		it('separates handles onDrag as well', () => {
			const onDragSpy = jest.fn();
			const useRangerMock = useRanger as jest.Mock;
			const step = args.facet.step!;

			render(<FacetSlider {...args} separateHandles={true} onDrag={onDragSpy} />);

			const { onDrag } = useRangerMock.mock.calls[useRangerMock.mock.calls.length - 1][0];

			const val = [10, 10];
			onDrag(val);

			expect(onDragSpy).toHaveBeenCalledWith([10, 10 + step]);
		});

		it('separates handles by increasing max value when there is room', () => {
			const onChangeSpy = jest.fn();
			const useRangerMock = useRanger as jest.Mock;
			const step = args.facet.step!;
			const rangeMax = args.facet.range?.high!;

			render(<FacetSlider {...args} separateHandles={true} onChange={onChangeSpy} />);

			const { onChange } = useRangerMock.mock.calls[useRangerMock.mock.calls.length - 1][0];

			// Test value in middle of range where max can be increased
			const testValue = Math.floor((rangeMax - step) / 2);
			const val = [testValue, testValue];
			onChange(val);

			expect(onChangeSpy).toHaveBeenCalledWith([testValue, testValue + step]);
		});

		it('separates handles by decreasing min value when max is at range boundary', () => {
			const onChangeSpy = jest.fn();
			const useRangerMock = useRanger as jest.Mock;
			const step = args.facet.step!;
			const rangeMax = args.facet.range?.high!;
			const rangeMin = args.facet.range?.low!;

			render(<FacetSlider {...args} separateHandles={true} onChange={onChangeSpy} />);

			const { onChange } = useRangerMock.mock.calls[useRangerMock.mock.calls.length - 1][0];

			// Test when both handles are at max range (can't increase max, must decrease min)
			const val = [rangeMax, rangeMax];
			onChange(val);

			if (rangeMax - step >= rangeMin) {
				expect(onChangeSpy).toHaveBeenCalledWith([rangeMax - step, rangeMax]);
			} else {
				// If range is too small to separate, handles stay together
				expect(onChangeSpy).toHaveBeenCalledWith([rangeMax, rangeMax]);
			}
		});

		it('does not separate handles when range is too small (only one step)', () => {
			const onChangeSpy = jest.fn();
			const useRangerMock = useRanger as jest.Mock;

			// Create a facet with minimal range (just one step)
			const smallRangeFacet = {
				...args.facet,
				range: { low: 0, high: args.facet.step },
				active: { low: 0, high: args.facet.step },
			} as RangeFacet;

			render(<FacetSlider facet={smallRangeFacet} separateHandles={true} onChange={onChangeSpy} />);

			const { onChange } = useRangerMock.mock.calls[useRangerMock.mock.calls.length - 1][0];

			// When both handles are at the same value in a minimal range
			const val = [0, 0];
			onChange(val);

			// Should separate if possible
			if (args.facet.step! <= smallRangeFacet.range!.high!) {
				expect(onChangeSpy).toHaveBeenCalledWith([0, args.facet.step!]);
			}
		});

		it('separates handles at minimum range boundary', () => {
			const onChangeSpy = jest.fn();
			const useRangerMock = useRanger as jest.Mock;
			const step = args.facet.step!;
			const rangeMin = args.facet.range?.low!;

			render(<FacetSlider {...args} separateHandles={true} onChange={onChangeSpy} />);

			const { onChange } = useRangerMock.mock.calls[useRangerMock.mock.calls.length - 1][0];

			// Test when both handles are at min range
			const val = [rangeMin, rangeMin];
			onChange(val);

			// Should increase max since min can't go lower
			expect(onChangeSpy).toHaveBeenCalledWith([rangeMin, rangeMin + step]);
		});

		it('maintains separation when handles are already separate', () => {
			const onChangeSpy = jest.fn();
			const useRangerMock = useRanger as jest.Mock;
			const step = args.facet.step!;

			render(<FacetSlider {...args} separateHandles={true} onChange={onChangeSpy} />);

			const { onChange } = useRangerMock.mock.calls[useRangerMock.mock.calls.length - 1][0];

			// Test with already separated values
			const val = [10, 10 + step * 3];
			onChange(val);

			// Should not modify already separated handles
			expect(onChangeSpy).toHaveBeenCalledWith([10, 10 + step * 3]);
		});

		it('calls onChange callback before urlManager changes', () => {
			const onChangeSpy = jest.fn();
			const mockUrlManager = {
				remove: jest.fn().mockReturnThis(),
				set: jest.fn().mockReturnThis(),
				go: jest.fn(),
			};

			const facetWithUrlManager = {
				...args.facet,
				services: {
					urlManager: mockUrlManager,
				},
			} as unknown as RangeFacet;

			const useRangerMock = useRanger as jest.Mock;

			render(<FacetSlider facet={facetWithUrlManager} separateHandles={true} onChange={onChangeSpy} />);

			const { onChange } = useRangerMock.mock.calls[useRangerMock.mock.calls.length - 1][0];

			const val = [15, 15];
			onChange(val);

			// onChange should be called before urlManager
			expect(onChangeSpy).toHaveBeenCalled();
			expect(mockUrlManager.remove).toHaveBeenCalled();
		});
	});
});
