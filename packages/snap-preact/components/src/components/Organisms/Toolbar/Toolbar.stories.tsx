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
		hideFilterSummary: {
			defaultValue: false,
			description: 'prevents the FilterSummary component from rendering',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		hideLayoutSelector: {
			defaultValue: false,
			description: 'prevents the LayoutSelector component from rendering',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		hidePerPage: {
			defaultValue: false,
			description: 'prevents the PerPage component from rendering',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		hideSortBy: {
			defaultValue: false,
			description: 'prevents the SortBy component from rendering',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		hidePagination: {
			defaultValue: false,
			description: 'prevents the Pagination component from rendering',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
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
