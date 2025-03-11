import { h } from 'preact';

import { ArgsTable, PRIMARY_STORY, Markdown } from '@storybook/blocks';

import { Result, ResultProps } from './Result';
import { FALLBACK_IMAGE_URL } from '../../Atoms/Image';
import { componentArgs, highlightedCode } from '../../../utilities';
import { Snapify } from '../../../utilities/snapify';
import Readme from '../Result/readme.md';
import { ResultsLayout } from '../../../types';
import type { SearchController } from '@searchspring/snap-controller';
import { Product } from '@searchspring/snap-store-mobx';

export default {
	title: 'Molecules/Result',
	component: Result,
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
			<div style={{ maxWidth: '250px' }}>
				<Story />
			</div>
		),
	],
	argTypes: {
		controller: {
			description: 'Controller reference',
			table: {
				type: {
					summary: 'Controller',
				},
			},
			control: { type: 'none' },
		},
		result: {
			description: 'Result store Product reference',
			type: { required: true },
			table: {
				type: {
					summary: 'result store Product object',
				},
			},
			control: { type: 'none' },
		},
		hideBadge: {
			description: 'Hide badge',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		hideTitle: {
			description: 'Hide title',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		hidePricing: {
			description: 'Hide pricing',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		hideImage: {
			description: 'Hide image',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		hideRating: {
			description: 'Hide ratings',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: true },
			},
			control: { type: 'boolean' },
		},
		hideAddToCartButton: {
			description: 'Hide add to cart button',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: true },
			},
			control: { type: 'boolean' },
		},
		addToCartButtonText: {
			description: 'add to cart button text',
			table: {
				type: {
					summary: 'string',
				},
			},
			control: { type: 'text' },
		},
		addToCartButtonSuccessText: {
			description: 'add to cart button text to show after adding to cart',
			table: {
				type: {
					summary: 'string',
				},
			},
			control: { type: 'text' },
		},
		addToCartButtonSuccessTimeout: {
			table: {
				type: {
					summary: 'number',
				},
			},
			control: { type: 'number' },
		},
		onAddToCartClick: {
			description: 'function to run on add to cart button click',
			table: {
				type: {
					summary: 'function',
				},
				defaultValue: { summary: 'Add To Cart' },
			},
			control: { type: 'none' },
			action: 'onClick',
		},
		detailSlot: {
			description: 'Slot for more product details (under price)',
			table: {
				type: {
					summary: 'string',
				},
			},
			control: { type: 'text' },
		},
		fallback: {
			defaultValue: '',
			description: 'Fallback image url',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: FALLBACK_IMAGE_URL },
			},
			control: { type: 'text' },
		},
		truncateTitle: {
			defaultValue: {},
			description: 'truncate title options object',
			table: {
				type: {
					summary: 'object',
				},
			},
			control: {
				type: 'object',
			},
		},
		layout: {
			description: 'Results layout',
			defaultValue: ResultsLayout.grid,
			table: {
				type: {
					summary: 'string',
				},
			},
			options: [ResultsLayout.grid, ResultsLayout.list],
			control: {
				type: 'select',
			},
		},
		onClick: {
			description: 'Custom onClick event handler',
			table: {
				type: {
					summary: 'function',
				},
			},
			control: { type: 'none' },
			action: 'onClick',
		},
		...componentArgs,
	},
};

const snapInstance = Snapify.search({ id: 'Result', globals: { siteId: '8uyt2m' } });

export const Default = (args: ResultProps, { loaded: { controller } }: { loaded: { controller: SearchController } }) => (
	<Result {...args} result={controller?.store?.results[0] as Product} />
);

Default.loaders = [
	async () => {
		await snapInstance.search();
		return {
			controller: snapInstance,
		};
	},
];

export const hideSections = (args: ResultProps, { loaded: { controller } }: { loaded: { controller: SearchController } }) => (
	<Result {...args} result={controller?.store?.results[0] as Product} />
);

hideSections.loaders = [
	async () => {
		await snapInstance.search();
		return {
			controller: snapInstance,
		};
	},
];
hideSections.args = {
	hideBadge: true,
	hideTitle: true,
	hidePricing: true,
};

export const truncateTitle = (args: ResultProps, { loaded: { controller } }: { loaded: { controller: SearchController } }) => (
	<Result {...args} result={controller?.store?.results[0] as Product} />
);

truncateTitle.loaders = [
	async () => {
		await snapInstance.search();
		return {
			controller: snapInstance,
		};
	},
];
truncateTitle.args = {
	truncateTitle: { limit: 5, append: '...' },
};
