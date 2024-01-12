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
			type: { required: false },
			table: {
				type: {
					summary: 'number',
				},
			},
			control: { type: 'number' },
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
