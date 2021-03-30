import { h } from 'preact';

import { Button } from './Button';

import { componentArgs } from '../../../utilities';

export default {
	title: `Atoms/Button`,
	component: Button,
	argTypes: {
		content: {
			description: 'Content to be displayed in button',
			table: {
				type: {
					summary: 'string, JSX',
				},
			},
			control: { type: 'text' },
		},
		children: {
			description: 'Content to be displayed in button (using children)',
			table: {
				type: {
					summary: 'string, JSX',
				},
			},
		},
		disabled: {
			defaultValue: false,
			description: 'Disable button',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		onClick: {
			description: 'Button click event handler',
			table: {
				type: {
					summary: 'function',
				},
			},
			action: 'onClick',
		},
		color: {
			description: 'Button color',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: '#333' },
			},
			control: { type: 'color' },
		},
		backgroundColor: {
			description: 'Button background color',
			table: {
				type: {
					summary: 'string',
				},
			},
			control: { type: 'color' },
		},
		borderColor: {
			description: 'Button border color',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: '#333' },
			},
			control: { type: 'color' },
		},
		native: {
			defaultValue: false,
			description: 'Render as unstyled native button',
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

const Template = (args) => <Button {...args} />;

export const Default = Template.bind({});
Default.args = {
	content: 'button',
};

export const Disabled = Template.bind({});
Disabled.args = {
	content: 'disabled',
	disabled: true,
};

export const Native = Template.bind({});
Native.args = {
	content: 'native',
	native: true,
};
