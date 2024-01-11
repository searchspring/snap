import { h } from 'preact';
import { ArgsTable, PRIMARY_STORY, Markdown } from '@storybook/blocks';
import { RadioList, RadioListProps } from './RadioList';
import { componentArgs, highlightedCode } from '../../../utilities';
import Readme from '../RadioList/readme.md';
import type { SearchController } from '@searchspring/snap-controller';
import { Snapify } from '../../../utilities/snapify';

export default {
	title: 'Molecules/RadioList',
	component: RadioList,
	tags: ['autodocs'],
	parameters: {
		docs: {
			page: () => (
				<div>
					<Markdown
						options={{
							overrides: {
								code: highlightedCode,
							},
						}}
					>
						{Readme}
					</Markdown>
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
			description: 'use native HTML radio inputs',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		hideOptionRadios: {
			description: 'enable/disable radio icons',
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

const snapInstance = Snapify.search({ id: 'RadioList', globals: { siteId: '8uyt2m' } });

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

export const Icons = (args: RadioListProps) => <RadioList {...args} />;
Icons.args = {
	options: [
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
	return (
		<RadioList {...args} options={controller.store.pagination.pageSizeOptions} selected={controller.store.pagination.pageSizeOptions[0].value} />
	);
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
	return <RadioList {...args} options={controller?.store?.sorting.options} selected={controller?.store?.sorting.current?.value} />;
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
