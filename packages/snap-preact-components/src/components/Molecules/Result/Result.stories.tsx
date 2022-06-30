import { h } from 'preact';

import { ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs/blocks';

import { Result, ResultProps } from './Result';
import { FALLBACK_IMAGE_URL } from '../../Atoms/Image';
import { componentArgs } from '../../../utilities';
import { Snapify } from '../../../utilities/snapify';
import Readme from '../Result/readme.md';
import { Layout } from '../../../types';
import type { SearchController } from '@searchspring/snap-controller';

export default {
	title: `Molecules/Result`,
	component: Result,
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
			<div style={{ maxWidth: '250px' }}>
				<Story />
			</div>
		),
	],
	argTypes: {
		result: {
			description: 'Result store reference',
			type: { required: true },
			table: {
				type: {
					summary: 'result store object',
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
			defaultValue: Layout.GRID,
			table: {
				type: {
					summary: 'string',
				},
			},
			control: {
				type: 'select',
				options: [Layout.GRID, Layout.LIST],
			},
		},
		onClick: {
			description: 'Custom onClick event handler',
			table: {
				type: {
					summary: 'function',
				},
			},
			action: 'onClick',
		},
		controller: {
			description: 'Controller reference',
			table: {
				type: {
					summary: 'Controller',
				},
			},
			control: { type: 'none' },
		},
		...componentArgs,
	},
};

const snapInstance = Snapify.search({ id: 'Result', globals: { siteId: '8uyt2m' } });

export const Default = (args: ResultProps, { loaded: { controller } }: { loaded: { controller: SearchController } }) => (
	<Result {...args} result={controller?.store?.results[0]} />
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
	<Result {...args} result={controller?.store?.results[0]} />
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
	<Result {...args} result={controller?.store?.results[0]} />
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
