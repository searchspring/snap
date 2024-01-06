import { h } from 'preact';

import { LoadingBar, LoadingBarProps } from './LoadingBar';
import { componentArgs } from '../../../utilities';
import { ArgsTable, PRIMARY_STORY } from '@storybook/blocks';

import Readme from '../Loading/readme.md';

export default {
	component: LoadingBar,
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
		active: {
			defaultValue: false,
			description: 'LoadingBar is displayed',
			type: { required: true },
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		color: {
			description: 'Bar color',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: 'theme.colors.primary' },
			},
			control: { type: 'color' },
		},
		backgroundColor: {
			description: 'Background color',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: 'theme.colors.secondary' },
			},
			control: { type: 'color' },
		},
		height: {
			defaultValue: '5px',
			description: 'LoadingBar height',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: '5px' },
			},
			control: { type: 'text' },
		},
		...componentArgs,
	},
};

export const Active = (args: LoadingBarProps) => <LoadingBar {...args} />;
Active.args = {
	active: true,
};
