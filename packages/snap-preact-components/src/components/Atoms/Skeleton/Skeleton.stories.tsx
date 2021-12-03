/** @jsx h */
import { h } from 'preact';

import { ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs/blocks';

import { componentArgs } from '../../../utilities';
import { Skeleton } from './Skeleton';
import Readme from '../Badge/readme.md';

export default {
	title: `Atoms/Skeleton`,
	component: Skeleton,
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
		(Story) => (
			<div
				style={{
					width: '200px',
					height: '200px',
					position: 'relative',
				}}
			>
				<Story height="200px" />
			</div>
		),
	],
	argTypes: {
		height: {
			description: 'Numeric value to set the height of the Skeleton',
			defaultValue: '100px',
			type: { required: true },
			table: {
				type: {
					summary: 'string',
				},
			},
			control: { type: 'text' },
		},
		width: {
			description: 'Numeric value to set the width of the Skeleton',
			defaultValue: '100px',
			type: { required: true },
			table: {
				type: {
					summary: 'string',
				},
			},
			control: { type: 'text' },
		},
		round: {
			table: {
				type: {
					summary: 'boolean',
				},
			},
			control: { type: 'boolean' },
		},
		bgcolor: {
			description: 'Background color',
			defaultValue: '#ebebeb',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: 'string' },
			},
			control: { type: 'text' },
		},
		secondaryColor: {
			description: 'Secondary color',
			defaultValue: '#f5f5f5',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: 'string' },
			},
			control: { type: 'text' },
		},
		...componentArgs,
	},
};

const Template = (args) => <Skeleton {...args} />;

export const Default = Template.bind({});
Default.args = {
	width: '100px',
	height: '100px',
};

export const Circle = (args) => <Skeleton {...args} />;
Circle.args = {
	width: '100px',
	height: '100px',
	round: true,
};
