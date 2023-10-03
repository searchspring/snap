import { h } from 'preact';

import { ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs/blocks';

import { componentArgs } from '../../../utilities';
import { Snapify } from '../../../utilities/snapify';
import Readme from './readme.md';
import type { SearchController } from '@searchspring/snap-controller';
import { Search, SearchProps } from './Search';

export default {
	title: `Templates/Search`,
	component: Search,
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
	decorators: [(Story: any) => <Story />],
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
		toggleSidebarButtonText: {
			description: 'Text to render in the toggle Sidebar button.',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: '' },
			},
			control: { type: 'text' },
		},
		mobileSidebarDisplayAt: {
			defaultValue: '',
			description: 'Media query for when to render the mobileSidebar',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: '' },
			},
			control: { type: 'text' },
		},
		hideSidebar: {
			defaultValue: false,
			description: 'prevents the sidebar component from rendering',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		hideMobileSidebar: {
			defaultValue: false,
			description: 'prevents the mobileSidebar component from rendering',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		hideSearchHeader: {
			defaultValue: false,
			description: 'prevents the SearchHeader component from rendering',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		hideTopToolBar: {
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
		hideBottomToolBar: {
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
		hideMerchandisingBanners: {
			defaultValue: false,
			description: 'hides merchandising banners. Accepts a boolean, or array of banner ContentTypes to hide.',
			table: {
				type: {
					summary: 'boolean | ContentType[]',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
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

export const Default = (args: SearchProps, { loaded: { controller } }: { loaded: { controller: SearchController } }) => {
	return <Search {...args} controller={controller} />;
};

Default.loaders = [
	async () => {
		await snapInstance.search();
		return {
			controller: snapInstance,
		};
	},
];

export const ToggleSidebar = (args: SearchProps, { loaded: { controller } }: { loaded: { controller: SearchController } }) => {
	return <Search toggleSidebarButtonText="Hide Sidebar" {...args} controller={controller} />;
};

ToggleSidebar.loaders = [
	async () => {
		await snapInstance.search();
		return {
			controller: snapInstance,
		};
	},
];

export const NoResults = (args: SearchProps, { loaded: { controller } }: { loaded: { controller: SearchController } }) => {
	return <Search {...args} controller={controller} />;
};

NoResults.loaders = [
	async () => {
		await noresultsInstance.search();
		return {
			controller: noresultsInstance,
		};
	},
];
