import { h } from 'preact';
import { observer } from 'mobx-react';

import { FacetPaletteOptions, FacetPaletteOptionsProps } from './FacetPaletteOptions';
import { componentArgs } from '../../../utilities';
import { Snapify } from '../../../utilities/snapify';

export default {
	title: `Molecules/FacetPaletteOptions`,
	component: FacetPaletteOptions,
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
			defaultValue: false,
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
			defaultValue: false,
			description: 'Hide facet option icon',
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

const ObservableFacetPaletteOptions = observer(({ args, controller }) => {
	const sizeFacet = controller?.store?.facets.filter((facet) => facet.field == 'color_family').pop();

	return <FacetPaletteOptions {...args} values={sizeFacet.values} />;
});

const Template = (args: FacetPaletteOptionsProps, { loaded: { controller } }) => {
	return <ObservableFacetPaletteOptions args={args} controller={controller} />;
};

export const Default = Template.bind({});
Default.loaders = [
	async () => ({
		controller: await snapInstance.search(),
	}),
];
