import { h } from 'preact';

import { LoadingBar } from './LoadingBar';
import { defaultTheme } from '../../../providers/theme';
import { componentArgs } from '../../../utilities';
import { ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs/blocks';
// @ts-ignore
import Readme from '../Loading/readme.md';

export default {
	title: `Atoms/LoadingBar`,
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
			defaultValue: defaultTheme.colors.primary,
			description: 'Bar color',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: defaultTheme.colors.primary },
			},
			control: { type: 'color' },
		},
		backgroundColor: {
			defaultValue: defaultTheme.colors.secondary,
			description: 'Background color',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: defaultTheme.colors.secondary },
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

const Template = (args) => <LoadingBar {...args} />;

export const Active = Template.bind({});
Active.args = {
	active: true,
};
