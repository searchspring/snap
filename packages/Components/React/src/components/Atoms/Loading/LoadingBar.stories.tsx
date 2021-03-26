import { h } from 'preact';

import { LoadingBar } from './LoadingBar';
import { defaultTheme } from '../../../providers/theme';
import { componentArgs } from '../../../utilities';

export default {
	title: `Atoms/LoadingBar`,
	component: LoadingBar,
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
			defaultValue: defaultTheme.colorPrimary,
			description: 'Bar color',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: defaultTheme.colorPrimary },
			},
			control: { type: 'color' },
		},
		backgroundColor: {
			defaultValue: defaultTheme.colorSecondary,
			description: 'Background color',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: defaultTheme.colorSecondary },
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
