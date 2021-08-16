import { h } from 'preact';

import { ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs/blocks';

import { iconPaths } from '../../Atoms/Icon';
import { FilterSummary, FilterSummaryProps } from './FilterSummary';
import { componentArgs } from '../../../utilities';
import { Snapify } from '../../../utilities/snapify';
import Readme from '../FilterSummary/readme.md';

export default {
	title: `Organisms/FilterSummary`,
	component: FilterSummary,
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
	argTypes: {
		filters: {
			description: 'Filters object',
			type: { required: false },
			table: {
				type: {
					summary: 'object',
				},
			},
			control: { type: 'object' },
		},
		title: {
			defaultValue: 'Current Filters',
			description: 'Filters object',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: 'Current Filters' },
			},
			control: { type: 'text' },
		},
		hideFacetLabel: {
			description: 'Hide filter facet label',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: 'boolean',
		},
		separator: {
			defaultValue: ':',
			description: 'Filter delimiter',
			table: {
				type: {
					summary: 'string',
				},
			},
			control: { type: 'text' },
		},
		hideClearAll: {
			description: 'Hide filter clear all button',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: 'boolean',
		},
		clearAllLabel: {
			defaultValue: 'Clear All',
			description: 'Text to show on clear all filters',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: 'Clear All' },
			},
			control: 'text',
		},
		clearAllIcon: {
			defaultValue: 'close-thin',
			description: 'Icon name',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: 'close-thin' },
			},
			control: {
				type: 'select',
				options: [...Object.keys(iconPaths)],
			},
		},
		filterIcon: {
			defaultValue: 'close-thin',
			description: 'Icon name',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: 'close-thin' },
			},
			control: {
				type: 'select',
				options: [...Object.keys(iconPaths)],
			},
		},
		onClick: {
			description: 'Filter click event handler',
			table: {
				type: {
					summary: 'function',
				},
			},
			action: 'onClick',
		},
		onClearAllClick: {
			description: 'Filter clear click event handler',
			table: {
				type: {
					summary: 'function',
				},
			},
			action: 'onClearAllClick',
		},
		...componentArgs,
	},
};

const snapInstance = Snapify.search({
	id: 'FilterSummary',
	globals: {
		siteId: '8uyt2m',
		filters: [
			{
				type: 'value',
				field: 'color_family',
				value: 'Blue',
			},
			{
				type: 'value',
				field: 'size',
				value: 'Small',
			},
		],
	},
});
const Template = (args: FilterSummaryProps, { loaded: { controller } }) => <FilterSummary {...args} controller={controller} />;

export const Regular = Template.bind({});
Regular.loaders = [
	async () => {
		await snapInstance.search();
		return {
			controller: snapInstance,
		};
	},
];

export const noFacetLabel = Template.bind({});
noFacetLabel.loaders = [
	async () => {
		await snapInstance.search();
		return {
			controller: snapInstance,
		};
	},
];
noFacetLabel.args = {
	hideFacetLabel: true,
};

export const customTitle = Template.bind({});
customTitle.loaders = [
	async () => {
		await snapInstance.search();
		return {
			controller: snapInstance,
		};
	},
];
customTitle.args = {
	title: 'Selected Filters',
};
