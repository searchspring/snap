import { h } from 'preact';
import { ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs/blocks';

import { FacetToggle, FacetToggleProps } from './FacetToggle';
import { componentArgs } from '../../../utilities';
import { Snapify } from '../../../utilities/snapify';
import Readme from './readme.md';
import type { SearchController } from '@searchspring/snap-controller';

export default {
	title: `Molecules/FacetToggle`,
	component: FacetToggle,
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
		value: {
			description: 'Facet.value store reference',
			type: { required: true },
			table: {
				type: {
					summary: 'Single facet.value store reference',
				},
			},
			control: { type: 'none' },
		},
		label: {
			description: 'Hide facet option label',
			table: {
				type: {
					summary: 'string',
				},
			},
			control: { type: 'text' },
		},
		onClick: {
			description: 'Toggle click event handler',
			table: {
				type: {
					summary: 'function',
				},
			},
			action: 'onClick',
		},

		...componentArgs,
	},
};

const snapInstance = Snapify.search({ id: 'FacetFacetToggle', globals: { siteId: '8uyt2m' } });

export const Default = (args: FacetToggleProps, { loaded: { controller } }: { loaded: { controller: SearchController } }) => {
	const sizeFacet = controller?.store?.facets.filter((facet) => facet.field == 'on_sale').pop();

	return <FacetToggle label={sizeFacet.label} {...args} value={sizeFacet.values[0]} />;
};
Default.args = {};

Default.loaders = [
	async () => {
		await snapInstance.search();
		return {
			controller: snapInstance,
		};
	},
];
