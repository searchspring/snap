import { h } from 'preact';

import { ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs/blocks';

import { Facets, FacetsProps } from './Facets';
import { componentArgs } from '../../../utilities';
import { Snapify } from '../../../utilities/snapify';

import Readme from '../Facets/readme.md';
import type { SearchController } from '@searchspring/snap-controller';

export default {
	title: `Organisms/Facets`,
	component: Facets,
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
		...componentArgs,
	},
};

const snapInstance = Snapify.search({ id: 'Facets', globals: { siteId: '8uyt2m' } });

export const Default = (args: FacetsProps, { loaded: { controller } }: { loaded: { controller: SearchController } }) => {
	return <Facets {...args} controller={controller} />;
};

Default.loaders = [
	async () => {
		await snapInstance.search();
		return {
			controller: snapInstance,
		};
	},
];
