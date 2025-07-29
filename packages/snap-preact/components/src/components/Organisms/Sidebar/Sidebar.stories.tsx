import { h } from 'preact';

import { ArgsTable, PRIMARY_STORY, Markdown } from '@storybook/blocks';

import { Sidebar, SidebarProps } from './Sidebar';
import { componentArgs, highlightedCode } from '../../../utilities';
import { Snapify } from '../../../utilities/snapify';
import Readme from './readme.md';
import type { SearchController } from '@searchspring/snap-controller';

export default {
	title: 'Organisms/Sidebar',
	component: Sidebar,
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
			<div style={{ maxWidth: '300px' }}>
				<Story />
			</div>
		),
	],
	argTypes: {
		controller: {
			description: 'Search controller reference',
			type: { required: true },
			table: {
				type: {
					summary: 'Search controller object',
				},
			},
			control: { type: 'none' },
		},
		layout: {
			description: 'specifies the layout of the sidebar',
			table: {
				type: {
					summary: "['filterSummary' | 'sortBy' | 'perPage' | 'facets' | 'banner.left' | 'paginationInfo' | 'layoutSelector' | '_']",
				},
				defaultValue: { summary: "[['filterSummary'], ['sortBy', 'perPage'], ['facets'], ['banner.left']]" },
			},
			control: 'array',
		},
		titleText: {
			description: 'Text to render in the sidebar title',
			type: { required: false },
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: 'Filters' },
			},
			control: { type: 'text' },
		},
		hideTitleText: {
			defaultValue: false,
			description: 'hides the sidebar title component',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		sticky: {
			description: 'specifies if the sidebar should be sticky',
			table: {
				type: { summary: 'boolean' },
			},
			control: { type: 'boolean' },
		},
		stickyOffset: {
			description: 'specifies the offset of the sidebar when sticky is true',
			table: {
				type: { summary: 'number' },
			},
			control: { type: 'number' },
		},
		...componentArgs,
	},
};

const snapInstance = Snapify.search({ id: 'Sidebar', globals: { siteId: '8uyt2m' } });

export const Default = (args: SidebarProps, { loaded: { controller } }: { loaded: { controller: SearchController } }) => {
	return <Sidebar {...args} controller={controller} />;
};

Default.loaders = [
	async () => {
		await snapInstance.search();
		return {
			controller: snapInstance,
		};
	},
];
