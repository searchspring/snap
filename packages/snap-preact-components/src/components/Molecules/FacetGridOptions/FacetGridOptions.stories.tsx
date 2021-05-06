import { h } from 'preact';
import { observer } from 'mobx-react';

import { FacetGridOptions, FacetGridOptionsProps } from './FacetGridOptions';

import { componentArgs } from '../../../utilities';
import { Snapify } from '../../../utilities/snapify';
import { ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs/blocks';

import Readme from '../FacetGridOptions/readme.md';

export default {
	title: `Molecules/FacetGridOptions`,
	component: FacetGridOptions,
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
		columns: {
			defaultValue: 4,
			description: 'Number of columns in grid',
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

const ObservableFacetGridOptions = observer(({ args, controller }) => {
	const sizeFacet = controller?.store?.facets.filter((facet) => facet.field == 'size_dress').pop();

	return <FacetGridOptions {...args} values={sizeFacet.values} />;
});

const Template = (args: FacetGridOptionsProps, { loaded: { controller } }) => {
	return <ObservableFacetGridOptions args={args} controller={controller} />;
};

export const Default = Template.bind({});
Default.loaders = [
	async () => ({
		controller: await snapInstance.search(),
	}),
];
