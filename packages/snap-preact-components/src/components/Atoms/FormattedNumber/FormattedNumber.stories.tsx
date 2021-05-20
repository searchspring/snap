import { h } from 'preact';

import { ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs/blocks';

import { FormattedNumber } from './FormattedNumber';
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
		...componentArgs,
	},
};

const Template = (args) => <FormattedNumber {...args} />;

export const Default = Template.bind({});
Default.args = {
	value: 1099.99,
};

export const Temperature = Template.bind({});
Temperature.args = {
	value: 100,
	symbol: ' °C',
	decimalPlaces: 2,
};

export const Length = Template.bind({});
Length.args = {
	value: 100,
	symbol: ' mm',
	decimalPlaces: 2,
};
