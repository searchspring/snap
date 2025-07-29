import { h } from 'preact';

import { ArgsTable, PRIMARY_STORY, Markdown } from '@storybook/blocks';

import { componentArgs, highlightedCode } from '../../../utilities';
import { Snapify } from '../../../utilities/snapify';
import Readme from './readme.md';
import type { SearchController } from '@searchspring/snap-controller';
import { Toolbar, ToolbarProps } from './Toolbar';
import { SearchRequestModelFilterValue } from '@searchspring/snapi-types';

export default {
	title: 'Organisms/Toolbar',
	component: Toolbar,
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
					maxWidth: '900px',
				}}
			>
				<Story />
			</div>
		),
	],
	argTypes: {
		controller: {
			description: 'Controller reference',
			type: { required: true },
			table: {
				type: {
					summary: 'Controller',
				},
			},
			control: { type: 'none' },
		},
		layout: {
			description: 'array of modules to render in specified layout',
			table: {
				type: {
					summary:
						'[`searchHeader` | `filterSummary` | `mobileSidebar` | `layoutSelector` | `perPage` | `sortBy` | `pagination` | `paginationInfo` | `_` | `button.sidebar-toggle` | `banner.header` | `banner.banner` | `banner.footer` | `facetsHorizontal`]',
				},
				defaultValue: { summary: "['mobileSidebar', 'filterSummary', 'paginationInfo', 'sortBy', 'perPage', 'pagination']" },
			},
			control: 'array',
		},
		toggleSideBarButton: {
			description: 'specifies an element to be used as the toggleSideBarButton',
			table: {
				type: {
					summary: 'object',
				},
				defaultValue: { summary: '' },
			},
			control: { type: 'object' },
		},
		...componentArgs,
	},
};

const snapInstance = Snapify.search({
	id: 'Toolbar',
	globals: {
		siteId: '8uyt2m',
		filters: [
			{
				type: 'value',
				field: 'color_family',
				value: 'Blue',
			} as SearchRequestModelFilterValue,
			{
				type: 'value',
				field: 'size',
				value: 'Small',
			} as SearchRequestModelFilterValue,
		],
	},
});

export const Default = (args: ToolbarProps, { loaded: { controller } }: { loaded: { controller: SearchController } }) => {
	return <Toolbar {...args} controller={controller} />;
};

Default.loaders = [
	async () => {
		await snapInstance.search();
		return {
			controller: snapInstance,
		};
	},
];
