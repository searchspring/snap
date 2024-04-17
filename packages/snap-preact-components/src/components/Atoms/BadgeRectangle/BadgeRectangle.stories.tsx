import { h } from 'preact';

import { ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs/blocks';

import { BadgeRectangleProps, BadgeRectangle } from './BadgeRectangle';
import { componentArgs } from '../../../utilities';
import Readme from '../BadgeRectangle/readme.md';

export default {
	title: `Atoms/BadgeRectangle`,
	component: BadgeRectangle,
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
				defaultValue: { summary: 'rgba(255, 255, 255, 0.5)' },
			},
			control: { type: 'color' },
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
		...componentArgs,
	},
};

export const Default = (args: BadgeRectangleProps) => <BadgeRectangle {...args} />;
Default.args = {
	value: '30% Off',
	color: '#0000FF',
	colorText: '#FFFFFF',
};
