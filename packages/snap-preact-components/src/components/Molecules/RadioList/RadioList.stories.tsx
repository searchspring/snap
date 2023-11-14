import { h } from 'preact';
import { ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs/blocks';
import { RadioList, RadioListProps } from './RadioList';
import { componentArgs } from '../../../utilities';
import Readme from '../RadioList/readme.md';
import type { SearchController } from '@searchspring/snap-controller';
import { Snapify } from '../../../utilities/snapify';

export default {
	title: `Molecules/RadioList`,
	component: RadioList,
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
		native: {
			description: 'render a list of native HTML radio inputs.',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		hideRadios: {
			description: 'enable/disable radio icons from rendering.',
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

const snapInstance = Snapify.search({ id: 'Select', globals: { siteId: '8uyt2m' } });

export const Default = (args: RadioListProps) => <RadioList {...args} />;
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
} as RadioListProps;

export const Native = (args: RadioListProps) => <RadioList {...args} />;
Native.args = {
	native: true,
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
} as RadioListProps;

export const PerPage = (args: RadioListProps, { loaded: { controller } }: { loaded: { controller: SearchController } }) => {
	return <RadioList {...args} options={controller.store.pagination.pageSizeOptions} selected={controller.store.pagination.pageSizeOptions[0]} />;
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
} as RadioListProps;

export const SortBy = (args: RadioListProps, { loaded: { controller } }: { loaded: { controller: SearchController } }) => {
	return <RadioList {...args} options={controller?.store?.sorting.options} selected={controller?.store?.sorting.current} />;
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
} as RadioListProps;
