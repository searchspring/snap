import { h } from 'preact';

import { ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs/blocks';

import { HorizontalFacets, HorizontalFacetsProps } from './HorizontalFacets';
import { componentArgs } from '../../../utilities';
import { Snapify } from '../../../utilities/snapify';

import Readme from '../HorizontalFacets/readme.md';
import type { SearchController } from '@searchspring/snap-controller';

export default {
	title: `Organisms/HorizontalFacets`,
	component: HorizontalFacets,
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
		facets: {
			description: 'Facets store reference',
			type: { required: false },
			table: {
				type: {
					summary: 'Facets store object',
				},
			},
			control: { type: 'none' },
		},
		limit: {
			description: 'Maximum number of facets to display',
			defaultValue: 6,
			type: { required: false },
			table: {
				type: {
					summary: 'number',
				},
			},
			control: { type: 'number' },
		},
		hideFiltersButton: {
			defaultValue: false,
			description: 'prevents the MobileSidebar and its button from rendering',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		alwaysShowFiltersButton: {
			defaultValue: false,
			description: 'Always render MobileSidebar regardless of facet overflow set my limit prop',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		controller: {
			description: 'Controller reference',
			type: { required: false },
			table: {
				type: {
					summary: 'Controller object',
				},
			},
			control: { type: 'none' },
		},
		...componentArgs,
	},
};

const snapInstance = Snapify.search({ id: 'HorizontalFacets', globals: { siteId: '8uyt2m' } });

export const Default = (args: HorizontalFacetsProps, { loaded: { controller } }: { loaded: { controller: SearchController } }) => {
	return <HorizontalFacets {...args} controller={controller} />;
};

Default.loaders = [
	async () => {
		await snapInstance.search();
		return {
			controller: snapInstance,
		};
	},
];
