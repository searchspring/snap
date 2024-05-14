import { h } from 'preact';

import { ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs/blocks';

import { BadgePillProps, BadgePill } from './BadgePill';
import { componentArgs } from '../../../utilities';
import Readme from '../BadgePill/readme.md';

export default {
	title: `Atoms/BadgePill`,
	component: BadgePill,
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
			<div
				style={{
					width: '200px',
					height: '200px',
					border: '2px dotted lightgrey',
				}}
			>
				<Story />
			</div>
		),
	],
	argTypes: {
		value: {
			description: 'Badge text contents',
			type: { required: true },
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: '' },
			},
			control: { type: 'text' },
		},
		color: {
			description: 'Badge background color',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: 'rgba(58, 35, 173, 0.5)' },
			},
			control: { type: 'color' },
		},
		colorText: {
			description: 'Badge text color',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: '#ffffff' },
			},
			control: { type: 'color' },
		},
		tag: {
			description: 'Badge location tag',
			table: {
				type: {
					summary: 'string',
				},
			},
			control: { type: 'text' },
		},
		...componentArgs,
	},
};

export const Default = (args: BadgePillProps) => <BadgePill {...args} />;
Default.args = {
	value: '30% Off',
	color: '#0000FF',
	colorText: '#FFFFFF',
};
