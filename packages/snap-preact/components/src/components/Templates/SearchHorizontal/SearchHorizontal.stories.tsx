import { h } from 'preact';

import { ArgsTable, PRIMARY_STORY, Markdown } from '@storybook/blocks';

import { componentArgs, highlightedCode } from '../../../utilities';
import { Snapify } from '../../../utilities/snapify';
import Readme from '../Search/readme.md';
import type { SearchController } from '@searchspring/snap-controller';
import { SearchHorizontal, SearchHorizontalProps } from './SearchHorizontal';

export default {
	title: 'Templates/SearchHorizontal',
	component: SearchHorizontal,
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
	argTypes: {
		controller: {
			description: 'Search Controller Reference',
			type: { required: true },
			table: {
				type: {
					summary: 'Controller',
				},
			},
			control: { type: 'none' },
		},
		hideTopToolbar: {
			defaultValue: false,
			description: 'prevents the top Toolbar component from rendering',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		hideMiddleToolbar: {
			defaultValue: false,
			description: 'prevents the middle Toolbar component from rendering',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		hideBottomToolbar: {
			defaultValue: false,
			description: 'prevents the bottom Toolbar component from rendering',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		resultComponent: {
			description: 'Slot for custom result component',
			table: {
				type: {
					summary: 'component',
				},
			},
		},
		...componentArgs,
	},
};

const snapInstance = Snapify.search({
	id: 'search',
	globals: {
		siteId: '8uyt2m',
	},
});

const noresultsInstance = Snapify.search({
	id: 'noresults',
	globals: {
		siteId: '8uyt2m',
		search: {
			query: {
				string: 'eijworhufsbgd',
			},
		},
	},
});

export const Default = (args: SearchHorizontalProps, { loaded: { controller } }: { loaded: { controller: SearchController } }) => {
	return <SearchHorizontal {...args} controller={controller} />;
};

Default.loaders = [
	async () => {
		await snapInstance.search();
		return {
			controller: snapInstance,
		};
	},
];

export const NoResults = (args: SearchHorizontalProps, { loaded: { controller } }: { loaded: { controller: SearchController } }) => {
	return <SearchHorizontal {...args} controller={controller} />;
};

NoResults.loaders = [
	async () => {
		await noresultsInstance.search();
		return {
			controller: noresultsInstance,
		};
	},
];
