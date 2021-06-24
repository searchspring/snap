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
				<input type="text" id="searchInput" placeholder="try me!" autoComplete="off" />
				<Story />
			</div>
		),
	],
	argTypes: {
		store: {
			description: 'Autocomplete store reference',
			type: { required: true },
			table: {
				type: {
					summary: 'Autocomplete store object',
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
		controller: {
			description: 'Controller reference',
			table: {
				type: {
					summary: 'Controller',
				},
			},
			control: { type: 'none' },
		},
		...componentArgs,
	},
};

const propTheme = {
	components: {
		facetpaletteoptions: {
			columns: 3,
			gapSize: '8px',
		},
	},
};

const snapInstance = Snapify.autocomplete({ selector: '#searchInput', globals: { siteId: '8uyt2m' } });

const ObservableAutoComplete = observer(({ args, controller }) => {
	return <Autocomplete {...args} store={controller?.store} input={controller?.config.selector} theme={propTheme} style={{ maxWidth: '900px' }} />;
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
