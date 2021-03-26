/** @jsx h */
import { h } from 'preact';

import { Title, Subtitle, Description, Primary, ArgsTable, Stories, PRIMARY_STORY } from '@storybook/addon-docs/blocks';
import { componentArgs } from '../../../utilities';
import { Badge } from './Badge';

export default {
	title: `Atoms/Badge`,
	component: Badge,
	parameters: {
		docs: {
			description: {
				component: 'badge component _markdown_',
			},
			page: () => (
				<div>
					<Title />
					<Subtitle />
					<Description />
					<ArgsTable story={PRIMARY_STORY} />
					<Primary />
					<div>
						<h1>hi</h1>
					</div>
					<Stories />
				</div>
			),
		},
	},
	decorators: [
		(Story) => (
			<div
				style={{
					margin: '1em',
					width: '220px',
					height: '300px',
					position: 'relative',
					border: '1px solid lightgrey',
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

const Template = (args) => <Badge {...args} />;

export const BadgeWithContent = Template.bind({});
BadgeWithContent.args = {
	content: 'pink',
	position: {
		top: 0,
		right: 0,
	},
};

export const BadgeWithChildren = (args) => (
	<Badge {...args}>
		<img src="//cdn.searchspring.net/ajax_search/img/star-badge-new-blue.png" />
	</Badge>
);
