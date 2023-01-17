import { h } from 'preact';
import { observer } from 'mobx-react';

import { ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs/blocks';

import { FacetPaletteOptions, FacetPaletteOptionsProps } from './FacetPaletteOptions';
import { componentArgs } from '../../../utilities';
import { Snapify } from '../../../utilities/snapify';
import Readme from '../FacetPaletteOptions/readme.md';
import type { SearchController } from '@searchspring/snap-controller';

export default {
	title: `Molecules/FacetPaletteOptions`,
	component: FacetPaletteOptions,
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
			type: { required: false },
			table: {
				type: {
					summary: 'facet values store array',
				},
			},
			control: { type: 'none' },
		},
		facet: {
			description: 'Facet store reference',
			type: { required: false },
			table: {
				type: {
					summary: 'facet store object',
				},
			},
			control: { type: 'none' },
		},
		columns: {
			defaultValue: 4,
			description: 'Number of columns in palette',
			table: {
				type: {
					summary: 'number',
				},
				defaultValue: { summary: 4 },
			},
			control: { type: 'number' },
		},
		gapSize: {
			defaultValue: '8px',
			description: 'Gap size between rows and columns',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: '8px' },
			},
			control: { type: 'text' },
		},
		hideLabel: {
			description: 'Hide facet option label',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		hideIcon: {
			description: 'Hide facet option icon',
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

const snapInstance = Snapify.search({ id: 'FacetPaletteOptions', globals: { siteId: '8uyt2m' } });

const ObservableFacetPaletteOptions = observer(({ args, controller }: { args: FacetPaletteOptionsProps; controller: SearchController }) => {
	const sizeFacet = controller?.store?.facets.filter((facet) => facet.field == 'color_family').pop();

	return <FacetPaletteOptions {...args} values={sizeFacet.values} />;
});

export const Default = (args: FacetPaletteOptionsProps, { loaded: { controller } }: { loaded: { controller: SearchController } }) => {
	return <ObservableFacetPaletteOptions args={args} controller={controller} />;
};

Default.loaders = [
	async () => {
		await snapInstance.search();
		return {
			controller: snapInstance,
		};
	},
];
