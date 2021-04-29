import { h } from 'preact';

import { Slider, SliderProps } from './Slider';
import { componentArgs } from '../../../utilities';
import { sliderFacetMock } from '../../../mocks/searchResponse';
import { ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs/blocks';

// @ts-ignore
import Readme from '../Slider/readme.md';

export default {
	title: `Molecules/Slider`,
	component: Slider,
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
		(Story) => (
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
			description: 'distance between ticks',
			table: {
				type: {
					summary: 'number',
				},
				defaultValue: { summary: 20 },
			},
			control: { type: 'number' },
		},
		textColor: {
			description: 'Slider text color',
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
		handleTextColor: {
			description: 'Slider Handle Text Color',
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

const Template = (args: SliderProps) => <Slider {...args} facet={sliderFacetMock} />;

export const Price = Template.bind({});
