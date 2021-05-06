import { h } from 'preact';

import { Checkbox, CheckboxProps } from './Checkbox';
import { iconPaths } from '../../Atoms/Icon';

import { componentArgs } from '../../../utilities';

import { ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs/blocks';

import Readme from '../Checkbox/readme.md';

export default {
	title: `Molecules/Checkbox`,
	component: Checkbox,
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
		checked: {
			description: 'Checkbox is checked (managed state)',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		disabled: {
			defaultValue: false,
			description: 'Checkbox is disabled',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		size: {
			defaultValue: '12px',
			description: 'Checkbox size',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: '12px' },
			},
			control: { type: 'text' },
		},
		icon: {
			defaultValue: 'check-thin',
			description: 'Icon name',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: 'check-thin' },
			},
			control: {
				type: 'select',
				options: [...Object.keys(iconPaths)],
			},
		},
		color: {
			description: 'Checkbox color',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: '#333' },
			},
			control: { type: 'color' },
		},
		iconColor: {
			description: 'Checkbox icon color. Overwrites color.',
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
			description: 'Render as unstyled native checkbox',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		onClick: {
			description: 'Checkbox click event handler',
			table: {
				type: {
					summary: 'function',
				},
			},
			action: 'onClick',
		},
		...componentArgs,
	},
};

const Template = (args: CheckboxProps) => <Checkbox {...args} />;

export const Default = Template.bind({});

export const Disabled = Template.bind({});
Disabled.args = {
	checked: true,
	disabled: true,
};

export const Native = Template.bind({});
Native.args = {
	native: true,
};
