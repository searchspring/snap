import { h } from 'preact';

import { ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs/blocks';

import { Dropdown, DropdownProps } from './Dropdown';
import { componentArgs } from '../../../utilities';
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
			type: { required: true },
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
			description: 'Disable dropdown - prevents all click events',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		disableOverlay: {
			description: 'Disable dropdown overlay and renders as block',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		toggleOnHover: {
			description: 'open and close dropdown on hover',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		open: {
			description: 'Pass a value here to control the state externally',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: 'undefined' },
			},
			control: { type: 'boolean' },
		},
		startOpen: {
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
		onMouseEnter: {
			description: 'Dropdown mouse enter event handler',
			table: {
				type: {
					summary: 'function(e: Event)',
				},
			},
			action: 'onMouseEnter',
		},
		onMouseLeave: {
			description: 'Dropdown mouse leave event handler',
			table: {
				type: {
					summary: 'function(e: Event)',
				},
			},
			action: 'onMouseLeave',
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
		disableClick: {
			description: 'boolean to disable clicking of the button',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		disableA11y: {
			description: 'boolean to disable autoset ally properties',
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

export const Default = (args: DropdownProps) => <Dropdown {...args} />;
Default.args = {
	button: 'button text',
	content: 'content text',
};

export const Hoverable = (args: DropdownProps) => <Dropdown {...args} />;
Hoverable.args = {
	button: 'hover over me',
	content: 'content text',
	toggleOnHover: true,
};

export const ExternalState = (args: DropdownProps) => <Dropdown {...args} />;
ExternalState.args = {
	button: 'button text',
	content: 'content text',
	open: true,
};

export const JSXContent = (args: DropdownProps) => <Dropdown {...args} />;
JSXContent.args = {
	button: 'button text',
	content: <div>jsx content - (note this component receieved the open state as a prop)</div>,
};

export const JSXChildren = (args: DropdownProps) => <Dropdown button={args.button}>{args.content}</Dropdown>;
JSXChildren.args = {
	button: 'button text',
	content: <div>jsx content - (note this component receieved the open state as a prop)</div>,
};

export const StringChildren = (args: DropdownProps) => <Dropdown button={args.button}>{args.content}</Dropdown>;
StringChildren.args = {
	button: 'button text',
	content: 'string content - (note this component receieved the open state as a prop)',
};
