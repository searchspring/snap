import { h } from 'preact';
import { observer } from 'mobx-react';

import { ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs/blocks';

import { FacetHierarchyOptions, FacetHierarchyOptionsProps } from './FacetHierarchyOptions';
import { componentArgs } from '../../../utilities';
import { Snapify } from '../../../utilities/snapify';
import { FacetDisplay } from '../../../types';
import Readme from '../FacetHierarchyOptions/readme.md';
import { SearchController } from '@searchspring/snap-controller';

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
			type: { required: true },
			table: {
				type: {
					summary: 'object',
				},
			},
			control: { type: 'object' },
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
