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
		openButtonText: {
			description: 'Text to render in the slideout button',
			type: { required: false },
			defaultValue: 'Click to open filters',
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
				defaultValue: { summary: 'Filter Options' },
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
		hideClearButton: {
			description: 'hides the clear all filters button component',
			table: {
				type: {
					summary: 'boolean',
				},
			},
			control: { type: 'boolean' },
		},
		clearButtonIcon: {
			description: 'Icon to render in the clear filters button',
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
		applyButtonIcon: {
			description: 'Icon to render in the apply facets button',
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
		hideApplyButton: {
			description: 'hides the apply facets button component',
			table: {
				type: {
					summary: 'boolean',
				},
			},
			control: { type: 'boolean' },
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
			description: 'hides the sidebar title',
			table: {
				type: {
					summary: 'boolean',
				},
			},
			control: { type: 'boolean' },
		},
		hideCloseButton: {
			description: 'hides the close sidebar button',
			table: {
				type: {
					summary: 'boolean',
				},
			},
			control: { type: 'boolean' },
		},
		closeButtonIcon: {
			description: 'Icon to render in the close sidebar button',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: 'close-thin' },
			},
			control: {
				type: 'select',
				options: [...Object.keys(iconPaths)],
			},
		},
		closeButtonText: {
			description: 'Text to render in the close sidebar button',
			type: { required: false },
			table: {
				type: {
					summary: 'string',
				},
			},
			control: { type: 'text' },
		},
		openButtonIcon: {
			description: 'Icon to render in the open sidebar button',
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
		hideHeader: {
			description: 'hides the sidebar header',
			table: {
				type: {
					summary: 'boolean',
				},
			},
			control: { type: 'boolean' },
		},
		hideFooter: {
			description: 'hides the sidebar footer',
			table: {
				type: {
					summary: 'boolean',
				},
			},
			control: { type: 'boolean' },
		},
		hideFacets: {
			description: 'hides the sidebar facets component',
			table: {
				type: {
					summary: 'boolean',
				},
			},
			control: { type: 'boolean' },
		},
		hidePerPage: {
			description: 'hides the sidebar per page component',
			table: {
				type: {
					summary: 'boolean',
				},
			},
			control: { type: 'boolean' },
		},
		hideSortBy: {
			description: 'hides the sidebar sort by component',
			table: {
				type: {
					summary: 'boolean',
				},
			},
			control: { type: 'boolean' },
		},
		hideFilterSummary: {
			description: 'hides the sidebar FilterSummary component',
			table: {
				type: {
					summary: 'boolean',
				},
			},
			control: { type: 'boolean' },
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
