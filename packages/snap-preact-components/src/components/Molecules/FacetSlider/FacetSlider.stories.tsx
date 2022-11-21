import { h } from 'preact';

import { ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs/blocks';

import { FacetSlider, FacetSliderProps } from './FacetSlider';
import { componentArgs } from '../../../utilities';
import Readme from '../FacetSlider/readme.md';
import type { RangeFacet } from '@searchspring/snap-store-mobx';

// unfortunatley we have to hardcode the searchresponse data here rather than use the Snap-Shared
// mockdata due to issues with storybook being unable to bundle MockData due to it using fs
const sliderFacetMock = {
	field: 'price',
	label: 'Price',
	type: 'range',
	display: 'slider',
	filtered: false,
	collapsed: false,
	range: {
		low: 0,
		high: 120,
	},
	active: {
		low: 0,
		high: 120,
	},
	step: 1,
	formatValue: '$%01.2f',
};

export default {
	title: `Molecules/FacetSlider`,
	component: FacetSlider,
	parameters: {
		docs: {
			page: () => (
				<div>
					<Readme />
					<ArgsTable story={PRIMARY_STORY} />
				</div>
			),
		},
	},
	decorators: [
		(Story: any) => (
			<div style={{ maxWidth: '300px' }}>
				<Story />
			</div>
		),
	],
	argTypes: {
		facet: {
			description: 'Facet store reference',
			type: { required: true },
			table: {
				type: {
					summary: 'facet store object',
				},
			},
			control: { type: 'none' },
		},
		showTicks: {
			description: 'enables/disables ticks',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		tickSize: {
			defaultValue: 20,
			description: 'distance between ticks',
			table: {
				type: {
					summary: 'number',
				},
				defaultValue: { summary: 20 },
			},
			control: { type: 'number' },
		},
		tickTextColor: {
			description: 'ticks color',
			table: {
				type: {
					summary: 'string',
				},
			},
			control: { type: 'color' },
		},
		trackColor: {
			description: 'Slider track color',
			table: {
				type: {
					summary: 'string',
				},
			},
			control: { type: 'color' },
		},
		railColor: {
			description: 'Slider rail Color',
			table: {
				type: {
					summary: 'string',
				},
			},
			control: { type: 'color' },
		},
		valueTextColor: {
			description: 'Slider value Text Color',
			table: {
				type: {
					summary: 'string',
				},
			},
			control: { type: 'color' },
		},
		handleColor: {
			description: 'Slider handle color',
			table: {
				type: {
					summary: 'string',
				},
			},
			control: { type: 'color' },
		},
		stickyHandleLabel: {
			description: 'enables/disables sticky handle labels',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		handleDraggingColor: {
			description: 'Slider handle color when dragging',
			table: {
				type: {
					summary: 'string',
				},
			},
			control: { type: 'color' },
		},
		onDrag: {
			description: 'Slider onDrag event handler - fires as the slider is dragged (should not be used to trigger searches)',
			table: {
				type: {
					summary: 'function',
				},
			},
			action: 'onDrag',
		},
		onChange: {
			description: 'Slider onChange event handler - fires after touchEnd (used to trigger search)',
			table: {
				type: {
					summary: 'function',
				},
			},
			action: 'onChange',
		},
		...componentArgs,
	},
};

export const Price = (args: FacetSliderProps) => <FacetSlider {...args} facet={sliderFacetMock as RangeFacet} />;
