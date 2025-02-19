import { h } from 'preact';

import { ArgsTable, PRIMARY_STORY, Markdown } from '@storybook/blocks';

import { LoadMore, LoadMoreProps } from './LoadMore';
import { componentArgs, highlightedCode } from '../../../utilities';
import { iconPaths } from '../../Atoms/Icon';
import { Snapify } from '../../../utilities/snapify';
import Readme from '../LoadMore/readme.md';
import type { SearchController } from '@searchspring/snap-controller';
import type { SearchRequestModelFilterTypeEnum } from '@searchspring/snapi-types';

export default {
	title: 'Molecules/LoadMore',
	component: LoadMore,
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
			description: 'Search Controller reference',
			table: {
				type: {
					summary: 'Search controller object',
				},
			},
			control: { type: 'none' },
		},
		pagination: {
			description: 'Pagination store reference',
			table: {
				type: {
					summary: 'pagination store object',
				},
			},
			control: { type: 'none' },
		},
		autoFetch: {
			description: 'Automatically load more results when component comes into viewport',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		intersectionOffset: {
			defaultValue: '0px',
			description: 'Defines the IntersectionObserver rootMargin',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: '0px' },
			},
			control: { type: 'text' },
		},
		loading: {
			description: 'Loading state',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		loadMoreText: {
			defaultValue: 'Load More',
			description: 'Load more button text',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: 'Load More' },
			},
			control: { type: 'text' },
		},
		color: {
			description: 'Color of the indicator active state',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: '#cccccc' },
			},
			control: { type: 'color' },
		},
		backgroundColor: {
			description: 'Background color of the indicator',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: '#f8f8f8' },
			},
			control: { type: 'color' },
		},
		progressIndicatorWidth: {
			description: 'Progress indicator width in pixels',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: '300px' },
			},
			control: { type: 'text' },
		},
		progressIndicatorSize: {
			description: 'Progress indicator size in pixels',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: '5px bar' },
			},
			control: { type: 'text' },
		},
		hideProgressIndicator: {
			description: 'Hide progress indicator',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		hideProgressText: {
			description: 'Hide progress text',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		loadingIcon: {
			description: 'Loading icon',
			defaultValue: 'spinner',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: 'spinner' },
			},
			options: [...Object.keys(iconPaths)],
			control: {
				type: 'select',
			},
		},
		loadingLocation: {
			description: 'Location of loading indicator',
			defaultValue: 'button',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: 'button' },
			},
			options: ['button', 'outside'],
			control: {
				type: 'select',
			},
		},
		onClick: {
			description: 'Button click event handler',
			table: {
				type: {
					summary: 'function(e: Event)',
				},
			},
			control: { type: 'none' },
			action: 'onClick',
		},
		...componentArgs,
	},
};
const snapInstance = Snapify.search({
	id: 'LoadMore',
	globals: {
		siteId: '8uyt2m',
		filters: [
			{
				type: 'value' as SearchRequestModelFilterTypeEnum,
				field: 'color_family',
				// @ts-ignore - value does not exist on SearchRequestModelFilter
				value: 'Beige',
				background: true,
			},
		],
	},
});

export const Default = (args: LoadMoreProps, { loaded: { controller } }: { loaded: { controller: SearchController } }) => {
	return <LoadMore {...args} controller={controller} />;
};

Default.loaders = [
	async () => {
		await snapInstance.search();
		return {
			controller: snapInstance,
		};
	},
];
