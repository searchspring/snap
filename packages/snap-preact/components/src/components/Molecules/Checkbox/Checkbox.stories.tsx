import { h } from 'preact';

import { ArgsTable, PRIMARY_STORY, Markdown } from '@storybook/blocks';

import { Checkbox, CheckboxProps } from './Checkbox';
import { iconPaths } from '../../Atoms/Icon';
import { componentArgs, highlightedCode } from '../../../utilities';
import Readme from '../Checkbox/readme.md';

export default {
	title: 'Molecules/Checkbox',
	component: Checkbox,
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
		checked: {
			description: 'Checkbox is checked (externally managed state)',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		disabled: {
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
			options: [...Object.keys(iconPaths)],
			control: {
				type: 'select',
			},
		},
		color: {
			description: 'Checkbox color',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: 'theme.variables.colors.primary' },
			},
			control: { type: 'color' },
		},
		iconColor: {
			description: 'Checkbox icon color. Overwrites color.',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: 'theme.variables.colors.primary' },
			},
			control: { type: 'color' },
		},
		startChecked: {
			description: 'Checkbox is checked initially (internally managed state)',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		native: {
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

export const Default = (args: CheckboxProps) => <Checkbox {...args} />;

export const Disabled = (args: CheckboxProps) => <Checkbox {...args} />;
Disabled.args = {
	checked: true,
	disabled: true,
};

export const Native = (args: CheckboxProps) => <Checkbox {...args} />;
Native.args = {
	native: true,
};
