import { h } from 'preact';

import { ArgsTable, PRIMARY_STORY } from '@storybook/blocks';

import { Price, PriceProps } from './Price';
import { componentArgs } from '../../../utilities';
import Readme from '../Price/readme.md';

export default {
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
			defaultValue: '$',
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
			defaultValue: 2,
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
			defaultValue: ',',
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
			defaultValue: '.',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: '.' },
			},
			control: { type: 'text' },
		},
		lineThrough: {
			description: 'Add line through styling',
			defaultValue: false,
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
		raw: {
			description: 'Returns raw value without wrapping DOM node',
			defaultValue: false,
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		...componentArgs,
	},
};

export const Default = (args: PriceProps) => <Price {...args} />;
Default.args = {
	value: 1099.99,
};

export const lineThrough = (args: PriceProps) => <Price {...args} />;
lineThrough.args = {
	value: 1199.99,
	lineThrough: true,
};

export const CustomCurrency = (args: PriceProps) => <Price {...args} />;
CustomCurrency.args = {
	value: 999.99,
	symbol: ' €',
	thousandsSeparator: '.',
	decimalSeparator: ',',
	symbolAfter: true,
};
