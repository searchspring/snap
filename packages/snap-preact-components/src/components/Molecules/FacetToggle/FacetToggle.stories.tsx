import { h } from 'preact';
import { observer } from 'mobx-react';

import { ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs/blocks';

import { FacetToggle, FacetToggleProps } from './FacetToggle';
import { componentArgs } from '../../../utilities';
import { Snapify } from '../../../utilities/snapify';
import Readme from '../FacetToggle/readme.md';
import type { SearchController } from '@searchspring/snap-controller';

export default {
	title: `Atoms/FacetToggle`,
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
			type: { required: false },
			table: {
				type: {
					summary: 'Single facet value store array',
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
		round: {
			description: 'round toggle switch',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		activeColor: {
			description: 'Change the background color of the toggle when active',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: '#2196F3' },
			},
			control: { type: 'text' },
		},
		inactiveColor: {
			description: 'Change the background color of the toggle when in active',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: '#ccc' },
			},
			control: { type: 'text' },
		},
		buttonColor: {
			description: 'Change the background color of the toggle button',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: 'white' },
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

const ObservableFacetToggle = observer(({ args, controller }: { args: FacetToggleProps; controller: SearchController }) => {
	const sizeFacet = controller?.store?.facets.filter((facet) => facet.field == 'on_sale').pop();

	return <FacetToggle {...args} label={sizeFacet.label} value={sizeFacet.values[0]} />;
});

export const Default = (args: FacetToggleProps, { loaded: { controller } }: { loaded: { controller: SearchController } }) => {
	return <ObservableFacetToggle args={args} controller={controller} />;
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
