import { h } from 'preact';

import { ArgsTable, PRIMARY_STORY, Markdown } from '@storybook/blocks';

import { Button, ButtonProps } from './Button';
import { componentArgs, highlightedCode } from '../../../utilities';
import Readme from '../Button/readme.md';
import { iconPaths } from '../Icon';

export default {
	title: 'Atoms/Button',
	component: Button,
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
			control: { type: 'none' },
		},
		disabled: {
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
			control: { type: 'none' },
			action: 'onClick',
		},
		color: {
			description: 'Button text color',
			table: {
				type: {
					summary: 'string',
				},
			},
			control: { type: 'color' },
		},
		icon: {
			description: 'Button Icon name',
			table: {
				type: {
					summary: 'string',
				},
			},
			options: [...Object.keys(iconPaths)],
			control: {
				type: 'select',
			},
		},
		backgroundColor: {
			description: 'Button background color',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: '#fff' },
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
			description: 'Render as unstyled native button',
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

export const Default = (args: ButtonProps) => <Button {...args} />;
Default.args = {
	content: 'Button',
};

export const Disabled = (args: ButtonProps) => <Button {...args} />;
Disabled.args = {
	content: 'Button',
	disabled: true,
};

export const Native = (args: ButtonProps) => <Button {...args} />;
Native.args = {
	content: 'Button',
	native: true,
};
