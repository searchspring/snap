import { h } from 'preact';

import { ArgsTable, PRIMARY_STORY, Markdown } from '@storybook/blocks';

import { Modal, ModalProps } from './Modal';
import { componentArgs, highlightedCode } from '../../../utilities';
import Readme from './readme.md';

export default {
	title: 'Molecules/Modal',
	component: Modal,
	tags: ['autodocs'],
	parameters: {
		docs: {
			page: () => (
				<div>
					<Markdown
						options={{
							overrides: {
								code: highlightedCode,
							},
						}}
					>
						{Readme}
					</Markdown>
					<ArgsTable story={PRIMARY_STORY} />
				</div>
			),
		},
	},
	argTypes: {
		button: {
			description: 'Button content to toggle the modal',
			table: {
				type: {
					summary: 'string, JSX',
				},
			},
			control: { type: 'text' },
		},
		buttonSelector: {
			description: 'Button selector to toggle the modal',
			table: {
				type: {
					summary: 'string, JSX',
				},
			},
			control: { type: 'text' },
		},
		overlayColor: {
			defaultValue: 'rgba(0,0,0,0.8)',
			description: 'Modal overlay color',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: 'rgba(0,0,0,0.0)' },
			},
			control: { type: 'color' },
		},
		onOverlayClick: {
			description: 'Function to call when the overlay is clicked',
			table: {
				type: {
					summary: 'function(e: Event)',
				},
			},
			control: { type: 'none' },
			action: 'onOverlayClick',
		},
		content: {
			description: 'Content to be displayed in modal',
			table: {
				type: {
					summary: 'string, JSX',
				},
			},
			control: { type: 'text' },
		},
		children: {
			description: 'Content to be displayed in modal',
			table: {
				type: {
					summary: 'string, JSX',
				},
			},
			control: { type: 'text' },
		},
		disabled: {
			description: 'Disable modal - prevents all click events',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		lockScroll: {
			description: 'Lock the Scroll on the body when the modal is open',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: true },
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
			description: 'modal state is open on initial render - used with internal state only',
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
			description: 'modal click event handler',
			table: {
				type: {
					summary: 'function(e: Event)',
				},
			},
			control: { type: 'none' },
			action: 'onClick',
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

export const Default = (args: ModalProps) => <Modal {...args} />;
Default.args = {
	button: 'button text',
	content: 'content text',
};

export const ExternalState = (args: ModalProps) => <Modal {...args} />;
ExternalState.args = {
	button: 'button text',
	content: 'content text',
	open: true,
};

export const JSXContent = (args: ModalProps) => <Modal {...args} />;
JSXContent.args = {
	button: 'button text',
	content: <div>jsx content - (note this component receieved the open state as a prop)</div>,
};
