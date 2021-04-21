import { h } from 'preact';

import { Price } from './Price';
import { ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs/blocks';

// @ts-ignore
import Readme from '../Price/readme.md';

export default {
	title: `Atoms/Price`,
	component: Price,
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
	argTypes: {
		value: {
			description: 'Numeric value to be formatted',
			type: { required: true },
			table: {
				type: {
					summary: 'number',
				},
			},
			control: { type: 'number' },
		},
		symbol: {
			description: 'Currency symbol',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: '$' },
			},
			control: { type: 'text' },
		},
		symbolAfter: {
			description: 'Place currency symbol after the value',
			defaultValue: false,
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		decimalPlaces: {
			description: 'Number of decimal places',
			table: {
				type: {
					summary: 'number',
				},
				defaultValue: { summary: 2 },
			},
			control: { type: 'number' },
		},
		padDecimalPlaces: {
			description: 'Pad decimal places with zeros',
			defaultValue: true,
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: true },
			},
			control: { type: 'boolean' },
		},
		thousandsSeparator: {
			description: 'Character used to separate thousands',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: ',' },
			},
			control: { type: 'text' },
		},
		decimalSeparator: {
			description: 'Character used to separate decimal values',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: '.' },
			},
			control: { type: 'text' },
		},
		lineThrough: {
			defaultValue: false,
			description: 'Add line through styling',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: {
				type: 'boolean',
			},
		},
		disableStyles: {
			description: 'Disable all default styling',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: {
				type: 'boolean',
			},
		},
		className: {
			description: 'Class name appended to root element of component',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: 'ss-price' },
			},
			control: { type: 'text' },
		},
	},
};

const Template = (args) => <Price {...args} />;

export const Default = Template.bind({});
Default.args = {
	value: 1099.99,
};

export const lineThrough = Template.bind({});
lineThrough.args = {
	value: 1199.99,
	lineThrough: true,
};

export const CustomCurrency = Template.bind({});
CustomCurrency.args = {
	value: 999.99,
	symbol: ' €',
	thousandsSeparator: '.',
	decimalSeparator: ',',
	symbolAfter: true,
};
