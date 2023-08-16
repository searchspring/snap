import { h } from 'preact';

import { ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs/blocks';

import { componentArgs } from '../../../utilities';
import { Snapify } from '../../../utilities/snapify';

import Readme from './readme.md';
import type { SearchController } from '@searchspring/snap-controller';
import { SearchHeader, SearchHeaderProps } from './SearchHeader';

export default {
	title: `Atoms/SearchHeader`,
	component: SearchHeader,
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
					maxWidth: '900px',
				}}
			>
				<Story />
			</div>
		),
	],
	argTypes: {
		controller: {
			description: 'Search Controller reference',
			type: { required: true },
			table: {
				type: {
					summary: 'Search controller object',
				},
			},
			control: { type: 'none' },
		},
		titleText: {
			defaultValue: 'Showing 1-30 of 8,474 results for "*"',
			description: 'Search Title Text',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: 'Showing 1-30 of 8,474 results for "*"' },
			},
			control: { type: 'text' },
		},
		subTitleText: {
			defaultValue: '',
			description: 'Search Subtitle Text',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: '' },
			},
			control: { type: 'text' },
		},
		oqText: {
			defaultValue: '<div class="ss-oq">No results found for <em>"*"</em>, showing results for <em>"hat"</em> instead.</div>',
			description: 'Original query redirect text',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: '<div class="ss-oq">No results found for <em>"*"</em>, showing results for <em>"hat"</em> instead.</div>' },
			},
			control: { type: 'text' },
		},
		noResultsText: {
			defaultValue: '<span>No results found.</span>',
			description: 'no results found text',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: '<span>No results found.</span>' },
			},
			control: { type: 'text' },
		},
		...componentArgs,
	},
};

const snapInstance = Snapify.search({ id: 'Results', globals: { siteId: '8uyt2m' } });

export const Default = (args: SearchHeaderProps, { loaded: { controller } }: { loaded: { controller: SearchController } }) => {
	return <SearchHeader {...args} controller={controller} />;
};

Default.loaders = [
	async () => {
		await snapInstance.search();
		return {
			controller: snapInstance,
		};
	},
];
