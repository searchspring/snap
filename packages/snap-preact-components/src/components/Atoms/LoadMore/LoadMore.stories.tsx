import { h } from 'preact';
import { observer } from 'mobx-react';

import { ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs/blocks';

import { LoadMore, LoadMoreProps } from './LoadMore';
import { componentArgs } from '../../../utilities';
import { Snapify } from '../../../utilities/snapify';
import Readme from '../LoadMore/readme.md';
import type { SearchController } from '@searchspring/snap-controller';

export default {
	title: `Atoms/LoadMore`,
	component: LoadMore,
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
	argTypes: {
		pagination: {
			description: 'Pagination store reference',
			type: { required: true },
			table: {
				type: {
					summary: 'pagination store object',
				},
			},
			control: { type: 'none' },
		},
		auto: {
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
		progressIndicator: {
			defaultValue: 'bar',
			description: 'Type of progress indicator to show',
			table: {
				type: {
					summary: 'string',
				},
			},
			control: {
				type: 'select',
				options: ['bar', 'radial'],
			},
		},
		progressIndicatorWidth: {
			description: 'Progress indicator width in pixels',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: '300px bar | 70px radial' },
			},
			control: { type: 'text' },
		},
		progressIndicatorSize: {
			description: 'Progress indicator size in pixels',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: '5px bar | 10px radial' },
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
		onClick: {
			description: 'Button click event handler',
			table: {
				type: {
					summary: 'function(e: Event)',
				},
			},
			action: 'onClick',
		},
		...componentArgs,
	},
};

const snapInstance = Snapify.search({ id: 'Pagination', globals: { siteId: '8uyt2m' } });

const ObservableLoadMore = observer(({ args, controller }: { args: LoadMoreProps; controller: SearchController }) => {
	return <LoadMore {...args} pagination={controller?.store?.pagination} />;
});

export const Default = (args: LoadMoreProps, { loaded: { controller } }: { loaded: { controller: SearchController } }) => {
	return <ObservableLoadMore args={args} controller={controller} />;
};

Default.loaders = [
	async () => {
		// limit to 100 results to show progress indicator
		snapInstance.on('afterStore', () => {
			snapInstance.store.pagination.totalResults = 100;
		});
		await snapInstance.search();

		return {
			controller: snapInstance,
		};
	},
];

export const Radial = (args: LoadMoreProps, { loaded: { controller } }: { loaded: { controller: SearchController } }) => {
	return <ObservableLoadMore args={args} controller={controller} />;
};

Radial.loaders = [
	async () => {
		// limit to 100 results to show progress indicator
		snapInstance.on('afterStore', () => {
			snapInstance.store.pagination.totalResults = 100;
		});
		await snapInstance.search();

		return {
			controller: snapInstance,
		};
	},
];

Radial.args = {
	progressIndicator: 'radial',
};
