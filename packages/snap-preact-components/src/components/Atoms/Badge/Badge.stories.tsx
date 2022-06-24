/** @jsx h */
import { h } from 'preact';

import { ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs/blocks';

import { componentArgs } from '../../../utilities';
import { Badge, BadgeProps } from './Badge';
import Readme from '../Badge/readme.md';

export default {
	title: `Atoms/Badge`,
	component: Badge,
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
					position: 'relative',
					border: '2px dotted lightgrey',
				}}
			>
				<Story height="200px" />
			</div>
		),
	],
	argTypes: {
		content: {
			description: 'Content to be displayed in badge',
			table: {
				type: {
					summary: 'string',
				},
			},
			control: { type: 'text' },
		},
		children: {
			description: 'Content to be displayed in badge using children',
			table: {
				type: {
					summary: 'string, JSX',
				},
			},
		},
		position: {
			description: 'Position of badge',
			defaultValue: { top: 0, left: 0 },
			table: {
				type: {
					summary: 'object',
				},
				defaultValue: { summary: '{ top: 0, left: 0 }' },
			},
			control: { type: 'object' },
		},
		...componentArgs,
	},
};

export const BadgeWithContent = (args: BadgeProps) => <Badge {...args} />;

BadgeWithContent.args = {
	content: 'pink',
	position: {
		top: 0,
		right: 0,
	},
};

export const BadgeWithChildren = (args: BadgeProps) => (
	<Badge {...args}>
		<img src="//cdn.searchspring.net/ajax_search/img/star-badge-new-blue.png" />
	</Badge>
);
