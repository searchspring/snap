import { h } from 'preact';
import { observer } from 'mobx-react';

import { FacetHierarchyOptions, FacetHierarchyOptionsProps } from './FacetHierarchyOptions';
import { componentArgs } from '../../../utilities';
import { Snapify } from '../../../utilities/snapify';
import { FacetDisplay } from '../../../types';

export default {
	title: `Molecules/FacetHierarchyOptions`,
	component: FacetHierarchyOptions,
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

const snapInstance = Snapify.search({ globals: { siteId: 'scmq7n' } });

const ObservableFacetHierarchyOptions = observer(({ args, controller }) => {
	const hierarchyValues = controller?.store?.facets
		.filter((facet) => facet.display === FacetDisplay.HIERARCHY)
		.shift()
		.values.slice(0, 12);

	return <FacetHierarchyOptions {...args} values={hierarchyValues} />;
});

const Template = (args: FacetHierarchyOptionsProps, { loaded: { controller } }) => {
	return <ObservableFacetHierarchyOptions args={args} controller={controller} />;
};

export const Default = Template.bind({});
Default.loaders = [
	async () => ({
		controller: await snapInstance.search(),
	}),
];
