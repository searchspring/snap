import { h } from 'preact';

import { FormattedNumber } from './FormattedNumber';

export default {
	title: `Atoms/FormattedNumber`,
	component: FormattedNumber,
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
			description: 'Unit symbol',
			table: {
				type: {
					summary: 'string',
				},
			},
			control: { type: 'text' },
		},
		symbolAfter: {
			description: 'Place unit symbol after the value',
			defaultValue: true,
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: true },
			},
			control: { type: 'boolean' },
		},
		decimalPlaces: {
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
				defaultValue: { summary: 'ss-formattednumber' },
			},
			control: { type: 'text' },
		},
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
