import { h } from 'preact';

import { ArgsTable, PRIMARY_STORY } from '@storybook/blocks';

import { Radio, RadioProps } from './Radio';
import { iconPaths } from '../../Atoms/Icon';
import { componentArgs } from '../../../utilities';
import Readme from './readme.md';

export default {
	component: Radio,
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
			description: 'Radio is checked (externally managed state)',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		disabled: {
			description: 'Radio is disabled',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		size: {
			defaultValue: '20px',
			description: 'Radio size',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: '20px' },
			},
			control: { type: 'text' },
		},
		checkedIcon: {
			description: 'Icon name when radio is checked',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: 'bullet' },
			},
			control: {
				type: 'select',
				options: [...Object.keys(iconPaths)],
			},
		},
		unCheckedIcon: {
			description: 'Icon name when radio is unchecked',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: 'bullet-o' },
			},
			control: {
				type: 'select',
				options: [...Object.keys(iconPaths)],
			},
		},
		color: {
			description: 'Radio color',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: 'theme.colors.primary' },
			},
			control: { type: 'color' },
		},
		startChecked: {
			description: 'Radio is checked initially (internally managed state)',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		native: {
			description: 'Render as unstyled native radio',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		onClick: {
			description: 'Radio click event handler',
			table: {
				type: {
					summary: 'function',
				},
			},
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

export const Default = (args: RadioProps) => <Radio {...args} />;

export const Disabled = (args: RadioProps) => <Radio {...args} />;
Disabled.args = {
	checked: true,
	disabled: true,
};

export const Native = (args: RadioProps) => <Radio {...args} />;
Native.args = {
	native: true,
};
