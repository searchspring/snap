import { h } from 'preact';
import { ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs/blocks';
import { List, ListProps } from './List';
import { componentArgs } from '../../../utilities';
import Readme from './readme.md';
import type { SearchController } from '@searchspring/snap-controller';
import { Snapify } from '../../../utilities/snapify';

export default {
	title: 'Molecules/List',
	component: List,
	tags: ['autodocs'],
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
	decorators: [(Story: any) => <Story />],
	argTypes: {
		options: {
			description: 'list of options to display',
			type: { required: false },
			table: {
				type: {
					summary: 'option[]',
				},
			},
			control: { type: 'object' },
		},
		titleText: {
			defaultValue: '',
			description: 'optional title to render',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: '' },
			},
			control: { type: 'text' },
		},
		hideOptionCheckboxes: {
			description: 'enable/disable checkboxes',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		hideOptionIcons: {
			description: 'enable/disable option icons',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		hideOptionLabels: {
			description: 'enable/disable option labels',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		requireSelection: {
			description: 'enable/disable requireSelection',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		multiSelect: {
			description: 'enable/disable multiselect',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		horizontal: {
			defaultValue: false,
			description: 'render the list options horizontally',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		onSelect: {
			description: 'option onSelect event handler',
			table: {
				type: {
					summary: 'function',
				},
			},
			control: { type: 'none' },
			action: 'onSelect',
		},
		disabled: {
			description: 'boolean to set the select in a disabled state',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		native: {
			description: 'boolean to render unstyled native checkbox elements',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		selected: {
			description: 'Current selected option',
			table: {
				type: {
					summary: 'string | number',
				},
			},
			control: { type: 'none' },
		},
		...componentArgs,
	},
};

const snapInstance = Snapify.search({ id: 'List', globals: { siteId: '8uyt2m' } });

export const Default = (args: ListProps) => <List {...args} />;
Default.args = {
	options: [
		{
			value: 'one',
		},
		{
			value: 'two',
		},
		{
			value: 'three',
		},
		{
			value: 'four',
		},
	],
} as ListProps;

export const DisabledOption = (args: ListProps) => <List {...args} />;
DisabledOption.args = {
	options: [
		{
			value: 'one',
			disabled: true,
		},
		{
			value: 'two',
		},
		{
			value: 'three',
		},
		{
			value: 'four',
		},
	],
} as ListProps;

const viewOptions = [
	{
		label: '1 wide',
		value: '1 wide',
		icon: 'square',
	},
	{
		label: '2 wide',
		value: '2 wide',
		icon: {
			icon: 'layout-large',
		},
	},
	{
		label: '3 wide',
		value: '3 wide',
		icon: {
			icon: 'layout-grid',
		},
	},
];

export const Icons = (args: ListProps) => <List {...args} />;
Icons.args = {
	requireSelection: true,
	options: viewOptions,
	selected: viewOptions[0],
} as ListProps;

export const PerPage = (args: ListProps, { loaded: { controller } }: { loaded: { controller: SearchController } }) => {
	return <List {...args} options={controller.store.pagination.pageSizeOptions} selected={controller.store.pagination.pageSizeOptions[0]} />;
};

PerPage.loaders = [
	async () => {
		await snapInstance.search();
		return {
			controller: snapInstance,
		};
	},
];

PerPage.args = {
	titleText: 'Per Page',
	requireSelection: true,
} as Partial<ListProps>;

export const SortBy = (args: ListProps, { loaded: { controller } }: { loaded: { controller: SearchController } }) => {
	return <List {...args} options={controller?.store?.sorting.options} selected={controller?.store?.sorting.current} />;
};

SortBy.loaders = [
	async () => {
		await snapInstance.search();
		return {
			controller: snapInstance,
		};
	},
];

SortBy.args = {
	titleText: 'Sort By',
	requireSelection: true,
} as Partial<ListProps>;
