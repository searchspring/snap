import { h } from 'preact';

import { ArgsTable, PRIMARY_STORY, Markdown } from '@storybook/blocks';

import { MobileSidebar, MobileSidebarProps } from './MobileSidebar';
import { componentArgs, highlightedCode } from '../../../utilities';
import { Snapify } from '../../../utilities/snapify';
import Readme from './readme.md';
import type { SearchController } from '@searchspring/snap-controller';
import { iconPaths } from '../../Atoms/Icon';

export default {
	title: 'Organisms/MobileSidebar',
	component: MobileSidebar,
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
		openButtonIcon: {
			description: 'Icon to render in the open sidebar button',
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
		hideHeader: {
			description: 'hides the sidebar header',
			table: {
				type: {
					summary: 'boolean',
				},
			},
			control: { type: 'boolean' },
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
			options: [...Object.keys(iconPaths)],
			control: {
				type: 'select',
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
		hideFilterSummary: {
			description: 'hides the sidebar FilterSummary component',
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
		hideFooter: {
			description: 'hides the sidebar footer',
			table: {
				type: {
					summary: 'boolean',
				},
			},
			control: { type: 'boolean' },
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
			options: [...Object.keys(iconPaths)],
			control: {
				type: 'select',
			},
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
		clearButtonIcon: {
			description: 'Icon to render in the clear filters button',
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
		hideTitleText: {
			description: 'hides the title text',
			table: {
				type: {
					summary: 'boolean',
				},
			},
			control: { type: 'boolean' },
		},
		hideOpenButtonText: {
			description: 'hides the open button text',
			table: {
				type: {
					summary: 'boolean',
				},
			},
			control: { type: 'boolean' },
		},
		hideClearButtonText: {
			description: 'hides the clear all filters button text',
			table: {
				type: {
					summary: 'boolean',
				},
			},
			control: { type: 'boolean' },
		},
		hideApplyButtonText: {
			description: 'hides the apply filters button text',
			table: {
				type: {
					summary: 'boolean',
				},
			},
			control: { type: 'boolean' },
		},
		hideCloseButtonText: {
			description: 'hides the close button text',
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

const snapInstance = Snapify.search({ id: 'MobileSidebar', globals: { siteId: '8uyt2m' } });

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
