import { h } from 'preact';
import { observer } from 'mobx-react';

import { ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs/blocks';

import { FacetHierarchyOptions, FacetHierarchyOptionsProps } from './FacetHierarchyOptions';
import { componentArgs } from '../../../utilities';
import { Snapify } from '../../../utilities/snapify';
import { FacetDisplay } from '../../../types';
import Readme from '../FacetHierarchyOptions/readme.md';
import type { SearchController } from '@searchspring/snap-controller';

export default {
	title: `Molecules/FacetHierarchyOptions`,
	component: FacetHierarchyOptions,
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
					summary: 'object',
				},
			},
			control: { type: 'object' },
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
		previewOnHover: {
			description: 'Invoke facet value preview upon hover',
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

const snapInstance = Snapify.search({ id: 'FacetHierarchyOptions', globals: { siteId: '8uyt2m' } });

const ObservableFacetHierarchyOptions = observer(({ args, controller }: { args: FacetHierarchyOptionsProps; controller: SearchController }) => {
	const hierarchyValues = controller?.store?.facets
		.filter((facet) => facet.display === FacetDisplay.HIERARCHY)
		.shift()
		.values.slice(0, 12);

	return <FacetHierarchyOptions {...args} values={hierarchyValues} />;
});

export const Default = (args: FacetHierarchyOptionsProps, { loaded: { controller } }: { loaded: { controller: SearchController } }) => {
	return <ObservableFacetHierarchyOptions args={args} controller={controller} />;
};

Default.loaders = [
	async () => {
		await snapInstance.search();
		return {
			controller: snapInstance,
		};
	},
];
