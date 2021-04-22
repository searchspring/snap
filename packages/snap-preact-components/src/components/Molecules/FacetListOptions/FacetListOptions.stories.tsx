import { h } from 'preact';
import { observer } from 'mobx-react';

import { FacetListOptions, FacetListOptionsProps } from './FacetListOptions';
import { componentArgs } from '../../../utilities';
import { Snapify } from '../../../utilities/snapify';
import { ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs/blocks';

// @ts-ignore
import Readme from '../FacetListOptions/readme.md';

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
		(Story) => (
			<div style={{ maxWidth: '300px', border: '1px solid lightgrey', padding: '8px' }}>
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

const snapInstance = Snapify.search({ globals: { siteId: 'scmq7n' } });

const ObservableFacetListOptions = observer(({ args, controller }) => {
	const brandFacet = controller?.store?.facets.filter((facet) => facet.field == 'brand').pop();

	return <FacetListOptions {...args} values={brandFacet.values} />;
});

const Template = (args: FacetListOptionsProps, { loaded: { controller } }) => {
	return <ObservableFacetListOptions args={args} controller={controller} />;
};

export const Default = Template.bind({});
Default.loaders = [
	async () => ({
		controller: await snapInstance.search(),
	}),
];
