import { h } from 'preact';

import { ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs/blocks';

import { BadgeTextProps, BadgeText } from './BadgeText';
import { componentArgs } from '../../../utilities';
import Readme from '../BadgeText/readme.md';

export default {
	title: `Atoms/BadgeText`,
	component: BadgeText,
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
		colorText: {
			description: 'Badge text color',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: '#000000' },
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

export const Default = (args: BadgeTextProps) => <BadgeText {...args} />;
Default.args = {
	value: '30% Off',
	colorText: '#000000',
};
