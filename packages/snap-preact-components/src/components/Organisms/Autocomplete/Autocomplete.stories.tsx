import { h, Fragment} from 'preact';
import { observer } from 'mobx-react';

import { Autocomplete, AutocompleteProps } from './Autocomplete';
import { componentArgs } from '../../../utilities';
import { Snapify } from '../../../utilities/snapify';
import { ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs/blocks';

// @ts-ignore
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
					margin: '8px',
					maxWidth: '900px',
					border: '1px solid lightgrey',
				}}
			>
				<input type="text" id="searchInput" placeholder='try me!' autoComplete="off"/>
				<Story/>
			</div>
		),
	],
	argTypes: {
		results: {
			description: 'Results store reference',
			type: { required: true },
			table: {
				type: {
					summary: 'Results store object',
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
		...componentArgs,
	},
};

const propTheme = {
	components: {
		facetpaletteoptions: {
			columns: 3,
			gapSize: "8px",
		},
	},
};

const snapInstance = Snapify.autocomplete({selector: "#searchInput", globals: { siteId: 'scmq7n' } });

const ObservableAutoComplete = observer(({ args, controller }) => {
	return <Autocomplete {...args} store={controller?.store} input={controller?.config.selector} theme={propTheme} style={{maxWidth:"900px"}}/>;
});

const Template = (args: AutocompleteProps, { loaded: { controller} }) => {
	return <ObservableAutoComplete args={args} controller={controller} />; 
};

export const Default = Template.bind({});
Default.loaders = [
	async () => ({
		controller: await snapInstance
	}),
];