import { h } from 'preact';

import { Dropdown } from './Dropdown';
import { componentArgs } from '../../../utilities';
import { ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs/blocks';
// @ts-ignore
import Readme from '../Dropdown/readme.md';

export default {
	title: `Atoms/Dropdown`,
	component: Dropdown,
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
		button: {
			description: 'Button content to toggle the dropdown',
			table: {
				type: {
					summary: 'string, JSX',
				},
			},
			control: { type: 'text' },
		},
		content: {
			description: 'Content to be displayed in dropdown',
			table: {
				type: {
					summary: 'string, JSX',
				},
			},
			control: { type: 'text' },
		},
		children: {
			description: 'Content to be displayed in dropdown using children',
			table: {
				type: {
					summary: 'string, JSX',
				},
			},
		},
		disabled: {
			defaultValue: false,
			description: 'Disable dropdown - prevents all click events',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		open: {
			defaultValue: false,
			description: 'Pass a value here to control the state externally',
			table: {
				type: {
					summary: 'boolean',
				},
			},
			control: { type: 'boolean' },
		},
		startOpen: {
			defaultValue: false,
			description: 'Dropdown state is open on initial render - used with internal state only',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		disableClickOutside: {
			defaultValue: false,
			description: 'Ignore clicks outside of element',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		onClick: {
			description: 'Dropdown click event handler',
			table: {
				type: {
					summary: 'function(e: Event)',
				},
			},
			action: 'onClick',
		},
		onToggle: {
			description: 'Executes when the internal state changes, gets passed the event and the internal state - used with internal state only',
			table: {
				type: {
					summary: 'function(e: Event, open: boolean)',
					detail: 'e is the click event',
				},
			},
			action: 'onToggle',
		},
		...componentArgs,
	},
};

const Template = (args) => <Dropdown {...args} />;

export const Default = Template.bind({});
Default.args = {
	button: 'button text',
	content: 'content text',
};
