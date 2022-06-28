import { h } from 'preact';

import { ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs/blocks';

import { FormattedNumber, FormattedNumberProps } from './FormattedNumber';
import { componentArgs } from '../../../utilities';
import Readme from '../FormattedNumber/readme.md';

export default {
	title: `Atoms/FormattedNumber`,
	component: FormattedNumber,
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
			defaultValue: '',
			description: 'Unit symbol',
			table: {
				type: {
					summary: 'string',
				},
			},
			control: { type: 'text' },
		},
		symbolAfter: {
			defaultValue: true,
			description: 'Place unit symbol after the value',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: true },
			},
			control: { type: 'boolean' },
		},
		decimalPlaces: {
			defaultValue: 3,
			description: 'Number of decimal places',
			table: {
				type: {
					summary: 'number',
				},
				defaultValue: { summary: 3 },
			},
			control: { type: 'number' },
		},
		padDecimalPlaces: {
			defaultValue: true,
			description: 'Pad decimal places with zeros',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: true },
			},
			control: { type: 'boolean' },
		},
		thousandsSeparator: {
			defaultValue: '',
			description: 'Character used to separate thousands',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: '' },
			},
			control: { type: 'text' },
		},
		decimalSeparator: {
			defaultValue: '.',
			description: 'Character used to separate decimal values',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: '.' },
			},
			control: { type: 'text' },
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

export const Default = (args: FormattedNumberProps) => <FormattedNumber {...args} />;
Default.args = {
	value: 1099.99,
};

export const Temperature = (args: FormattedNumberProps) => <FormattedNumber {...args} />;
Temperature.args = {
	value: 100,
	symbol: ' °C',
	decimalPlaces: 2,
};

export const Length = (args: FormattedNumberProps) => <FormattedNumber {...args} />;
Length.args = {
	value: 100,
	symbol: ' mm',
	decimalPlaces: 2,
};
