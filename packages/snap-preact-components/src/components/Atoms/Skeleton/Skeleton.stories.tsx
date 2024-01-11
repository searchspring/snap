import { h } from 'preact';

import { ArgsTable, PRIMARY_STORY, Markdown } from '@storybook/blocks';

import { componentArgs, highlightedCode } from '../../../utilities';
import { Skeleton, SkeletonProps } from './Skeleton';
import Readme from '../Skeleton/readme.md';

export default {
	title: 'Atoms/Skeleton',
	component: Skeleton,
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
	decorators: [
		(Story: any) => (
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
			description: 'CSS sizing to set the height of the Skeleton',
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
			description: 'CSS sizing to set the width of the Skeleton',
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
		backgroundColor: {
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
		animatedColor: {
			description: 'Color setting for the vertical animated bar',
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

export const Default = (args: SkeletonProps) => <Skeleton {...args} />;
Default.args = {
	width: '100px',
	height: '100px',
};

export const Circle = (args: SkeletonProps) => <Skeleton {...args} />;
Circle.args = {
	width: '100px',
	height: '100px',
	round: true,
};
