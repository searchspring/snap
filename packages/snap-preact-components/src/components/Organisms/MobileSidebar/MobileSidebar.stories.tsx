import { h } from 'preact';

import { ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs/blocks';

import { MobileSidebar, MobileSidebarProps } from './MobileSidebar';
import { componentArgs } from '../../../utilities';
import { Snapify } from '../../../utilities/snapify';
import Readme from './readme.md';
import type { SearchController } from '@searchspring/snap-controller';
import { iconPaths } from '../../Atoms/Icon';

export default {
	title: `Organisms/MobileSidebar`,
	component: MobileSidebar,
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
		slideoutButtonText: {
			description: 'Text to render in the slideout button',
			type: { required: false },
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: 'Filters' },
			},
			control: { type: 'text' },
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
		clearButtonText: {
			description: 'Text to render in the clear all facets button',
			type: { required: false },
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: 'Clear All' },
			},
			control: { type: 'text' },
		},
		applyButtonText: {
			description: 'Text to render in the apply facets button',
			type: { required: false },
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: 'Apply Filters' },
			},
			control: { type: 'text' },
		},
		displayAt: {
			description: 'specifies a CSS media query for when the component will render. By default, the component will always render',
			defaultValue: '10000px',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: '650px' },
			},
			control: { type: 'text' },
		},
		hideTitle: {
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
		hideApplyButton: {
			defaultValue: false,
			description: 'hides the apply facets button component',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		hideClearAllButton: {
			defaultValue: false,
			description: 'hides the clear all filters button component',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		hideCloseButton: {
			defaultValue: false,
			description: 'hides the close sidebar icon component',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		hideFacets: {
			defaultValue: false,
			description: 'hides the sidebar facets component',
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
			description: 'hides the sidebar per page component',
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
			description: 'hides the sidebar sort by component',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		hideFilterSummary: {
			defaultValue: false,
			description: 'hides the sidebar FilterSummary component',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		iconOpen: {
			description: 'Icon name for the open side bar icon, renders in the slideout button.',
			table: {
				type: {
					summary: 'string',
				},
			},
			control: {
				type: 'select',
				options: [...Object.keys(iconPaths)],
			},
		},
		iconClose: {
			description: 'Icon name for the close side bar icon, renders in the sidebar title.',
			table: {
				type: {
					summary: 'string',
				},
			},
			control: {
				type: 'select',
				options: [...Object.keys(iconPaths)],
			},
		},
		...componentArgs,
	},
};

const snapInstance = Snapify.search({ id: 'Facet', globals: { siteId: '8uyt2m' } });

export const Default = (args: MobileSidebarProps, { loaded: { controller } }: { loaded: { controller: SearchController } }) => {
	return <MobileSidebar {...args} controller={controller} />;
};

Default.loaders = [
	async () => {
		await snapInstance.search();
		return {
			controller: snapInstance,
		};
	},
];
