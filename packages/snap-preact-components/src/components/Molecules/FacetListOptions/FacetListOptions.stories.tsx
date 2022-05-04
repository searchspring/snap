import { h } from 'preact';
import { observer } from 'mobx-react';

import { ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs/blocks';

import { FacetListOptions, FacetListOptionsProps } from './FacetListOptions';
import { componentArgs } from '../../../utilities';
import { Snapify } from '../../../utilities/snapify';
import Readme from '../FacetListOptions/readme.md';
import { SearchController } from '@searchspring/snap-controller';

export default {
	title: `Molecules/FacetListOptions`,
	component: FacetListOptions,
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
		values: {
			description: 'Facet.values store reference',
			type: { required: true },
			table: {
				type: {
					summary: 'facet values store array',
				},
			},
			control: { type: 'none' },
		},
		hideCheckbox: {
			defaultValue: false,
			description: 'Hide facet option checkbox',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		hideCount: {
			defaultValue: false,
			description: 'Hide facet option count',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		previewOnFocus: {
			description: 'Invoke facet value preview upon focus',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		valueProps: {
			description: 'Object of facet value props',
			table: {
				type: {
					summary: 'object',
				},
				defaultValue: { summary: '{}' },
			},
			control: { type: 'object' },
		},
		onClick: {
			description: 'Facet option click event handler',
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

const snapInstance = Snapify.search({ id: 'FacetListOptions', globals: { siteId: '8uyt2m' } });

const ObservableFacetListOptions = observer(({ args, controller }: { args: FacetListOptionsProps; controller: SearchController }) => {
	const brandFacet = controller?.store?.facets.filter((facet) => facet.field == 'brand').pop();

	return <FacetListOptions {...args} values={brandFacet.values} />;
});

export const Default = (args: FacetListOptionsProps, { loaded: { controller } }: { loaded: { controller: SearchController } }) => {
	return <ObservableFacetListOptions args={args} controller={controller} />;
};

Default.loaders = [
	async () => {
		await snapInstance.search();
		return {
			controller: snapInstance,
		};
	},
];
