import { h, Fragment } from 'preact';
import { observer } from 'mobx-react';

import { ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs/blocks';

import { Autocomplete, AutocompleteProps } from './Autocomplete';
import { componentArgs } from '../../../utilities';
import { Snapify } from '../../../utilities/snapify';
import Readme from '../Autocomplete/readme.md';

export default {
	title: `Organisms/Autocomplete`,
	component: Autocomplete,
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
			<div
				style={{
					maxWidth: '900px',
				}}
			>
				<input type="text" id="searchInput" placeholder="try me!" autoComplete="off" style="width: 100%; padding: 10px;" />
				<Story />
			</div>
		),
	],
	argTypes: {
		controller: {
			description: 'Autocomplete controller reference',
			type: { required: true },
			table: {
				type: {
					summary: 'Autocomplete controller object',
				},
			},
			control: { type: 'none' },
		},
		hideFacets: {
			defaultValue: false,
			description: 'toggle facets display',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		hideTerms: {
			defaultValue: false,
			description: 'toggle terms display',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		horizontalTerms: {
			defaultValue: false,
			description: 'display terms horizontally, (not required if vertical prop is true)',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		vertical: {
			defaultValue: false,
			description: 'use a vertical (single column) layout',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		termsSlot: {
			description: 'Slot for custom terms component',
			table: {
				type: {
					summary: 'component',
				},
			},
		},
		facetsSlot: {
			description: 'Slot for custom facets component',
			table: {
				type: {
					summary: 'component',
				},
			},
		},
		contentSlot: {
			description: 'Slot for custom content component',
			table: {
				type: {
					summary: 'component',
				},
			},
		},
		responsive: {
			description: 'Responsive options object',
			table: {
				type: {
					summary: 'object',
				},
			},
			control: {
				type: 'object',
			},
		},
		...componentArgs,
	},
};

const snapInstance = Snapify.autocomplete({ id: 'Autocomplete', selector: '#searchInput', globals: { siteId: '8uyt2m' } });

const ObservableAutoComplete = observer(({ args, controller }) => {
	return <Autocomplete {...args} controller={controller} input={controller?.config.selector} />;
});

const Template = (args: AutocompleteProps, { loaded: { controller } }) => {
	return <ObservableAutoComplete args={args} controller={controller} />;
};

export const Default = Template.bind({});
Default.loaders = [
	async () => ({
		controller: await snapInstance,
	}),
];
