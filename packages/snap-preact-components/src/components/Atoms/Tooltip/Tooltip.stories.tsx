import { h } from 'preact';

import { ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs/blocks';

import { Tooltip, TooltipProps } from './Tooltip';
import { iconPaths } from '../Icon/paths';
import { componentArgs } from '../../../utilities';
import Readme from './readme.md';

export default {
	title: 'Atoms/Tooltip',
	component: Tooltip,
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
			<div style={{ margin: '150px' }}>
				<Story />
			</div>
		),
	],
	argTypes: {
		content: {
			description: 'Tooltip content',
			type: { required: true },
			table: {
				type: {
					summary: 'string',
				},
			},
			control: { type: 'text' },
		},
		children: {
			description: 'Element to trigger tooltip',
			table: {
				type: {
					summary: 'string, JSX',
				},
			},
			control: { type: 'none' },
		},
		icon: {
			description: 'Icon name',
			table: {
				type: {
					summary: 'string',
				},
			},
			options: [...Object.keys(iconPaths)],
			control: {
				type: 'select',
			},
		},
		position: {
			description: 'Tooltip position',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: 'top' },
			},
			options: ['top', 'bottom', 'left', 'right'],
			control: {
				type: 'select',
			},
		},
		...componentArgs,
	},
};

export const Default = (props: TooltipProps): JSX.Element => <Tooltip {...props} />;
Default.args = {
	content: 'This is a tooltip',
	children: <span>Hover me</span>,
};

export const JustContent = (props: TooltipProps): JSX.Element => <Tooltip {...props} />;
JustContent.args = {
	content: 'This is a tooltip with no children',
};

export const WithIcon = (props: TooltipProps): JSX.Element => <Tooltip {...props} />;
WithIcon.args = {
	content: 'This is a tooltip with an icon',
	icon: 'info',
	children: <span>My Tooltip has an Icon!</span>,
};

export const Positions = (props: TooltipProps): JSX.Element => (
	<div style={{ display: 'flex', gap: '50px', padding: '50px' }}>
		<Tooltip {...props} position="top" content="Top Tooltip">
			<span>Top</span>
		</Tooltip>
		<Tooltip {...props} position="bottom" content="Bottom Tooltip">
			<span>Bottom</span>
		</Tooltip>
		<Tooltip {...props} position="left" content="Left Tooltip">
			<span>Left</span>
		</Tooltip>
		<Tooltip {...props} position="right" content="Right Tooltip">
			<span>Right</span>
		</Tooltip>
	</div>
);
Positions.args = {};
