import { h } from 'preact';
import { ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs/blocks';

import { Toggle, ToggleProps } from './Toggle';
import { componentArgs } from '../../../utilities';
import Readme from './readme.md';

export default {
	title: `Atoms/Toggle`,
	component: Toggle,
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
		size: {
			defaultValue: '60px',
			description: 'toggle size',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: '60px' },
			},
			control: { type: 'text' },
		},
		label: {
			description: 'Text to render in the label',
			table: {
				type: {
					summary: 'string',
				},
			},
			control: { type: 'text' },
		},
		toggled: {
			description: 'toggle state',
			table: {
				type: {
					summary: 'boolean',
				},
			},
			control: { type: 'boolean' },
		},
		round: {
			description: 'round toggle switch',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: true },
			},
			control: { type: 'boolean' },
		},
		disabled: {
			description: 'disable the toggle',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		activeColor: {
			description: 'Change the background color of the toggle when active',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: '#2196F3' },
			},
			control: { type: 'text' },
		},
		inactiveColor: {
			description: 'Change the background color of the toggle when in active',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: '#ccc' },
			},
			control: { type: 'text' },
		},
		buttonColor: {
			description: 'Change the background color of the toggle button',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: 'white' },
			},
			control: { type: 'text' },
		},
		onClick: {
			description: 'Toggle click event handler',
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

export const Default = (args: ToggleProps) => {
	return <Toggle {...args} />;
};

export const withLabel = (args: ToggleProps) => {
	return <Toggle {...args} />;
};

withLabel.args = {
	label: 'In Stock: ',
} as ToggleProps;

export const square = (args: ToggleProps) => {
	return <Toggle {...args} />;
};

square.args = {
	round: false,
} as ToggleProps;
