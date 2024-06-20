import { h } from 'preact';
import { ArgsTable, PRIMARY_STORY, Markdown } from '@storybook/blocks';
import { Grid, GridProps } from './Grid';
import { componentArgs, highlightedCode } from '../../../utilities';
import Readme from './readme.md';

export default {
	title: 'Molecules/Grid',
	component: Grid,
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
	decorators: [
		(Story: any) => (
			<div style={{ maxWidth: '350px' }}>
				<Story />
			</div>
		),
	],
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
		selected: {
			description: 'Current selected option',
			table: {
				type: {
					summary: 'string | number',
				},
			},
			control: { type: 'none' },
		},
		hideLabels: {
			description: 'enable/disable option labels from rendering',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		hideShowLess: {
			description: 'hide show less button',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		columns: {
			defaultValue: 4,
			description: 'Number of columns in grid',
			table: {
				type: {
					summary: 'number',
				},
				defaultValue: { summary: 4 },
			},
			control: { type: 'number' },
		},
		rows: {
			description: 'Number of rows in grid',
			table: {
				type: {
					summary: 'number',
				},
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
		disableOverflowAction: {
			description: 'enable/disable show more click functionality',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		overflowButtonInGrid: {
			description: 'render overflow button in the grid or below',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: true },
			},
			control: { type: 'boolean' },
		},
		overflowButton: {
			description: 'Slot for custom overflow button component.',
			table: {
				type: {
					summary: 'component',
				},
			},
		},
		onOverflowButtonClick: {
			description: 'Custom onClick event handler for overflow button',
			table: {
				type: {
					summary: 'function',
				},
			},
			action: 'onOverflowButtonClick',
		},
		...componentArgs,
	},
};

export const Default = (args: GridProps) => <Grid {...args} />;
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
		{
			value: 'five',
		},
		{
			value: 'six',
		},
		{
			value: 'seven',
		},
		{
			value: 'eight',
		},
	],
} as GridProps;

export const DisabledOption = (args: GridProps) => <Grid {...args} />;
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
		{
			value: 'five',
		},
		{
			value: 'six',
		},
		{
			value: 'seven',
		},
		{
			value: 'eight',
		},
	],
} as GridProps;

export const backgroundImages = (args: GridProps) => <Grid {...args} />;
backgroundImages.args = {
	options: [
		{
			value: 'Faded Khaki',
			backgroundImageUrl:
				'https://cdn.shopify.com/s/files/1/0677/2424/7298/files/25caa3be92e5680ba340a62dc99cac3f_1b83cffd-c611-42bf-b6d8-59a497fe2ec7.jpg?v=1706125264',
		},
		{
			value: 'Indigo',
			backgroundImageUrl:
				'https://cdn.shopify.com/s/files/1/0677/2424/7298/files/4dae673375338093f817804c8da6305a_7de3d458-28f4-41d1-903a-b8916ef26dcb.jpg?v=1706125265https://cdn.shopify.com/s/files/1/0677/2424/7298/files/11136413-I_OK_x_Arvin_Gds_Wool_Boot_Socks_CBM_1_0e3b5702-49e2-4608-acb6-7c131891fc18_450x.jpg?v=1706124808',
		},
		{
			value: 'Mirage',
			backgroundImageUrl:
				'https://cdn.shopify.com/s/files/1/0677/2424/7298/files/a853b69a38627e53209e0cb98c90d154_63b6fc1d-2fe5-4c54-bb86-09bd4f7b550b.jpg?v=1706125265',
		},
		{
			value: 'Toasted',
			backgroundImageUrl:
				'https://cdn.shopify.com/s/files/1/0677/2424/7298/files/77f9701fc6979aadbedec33a68398aaa_cecd6b05-9aea-4db1-b4f1-ac245da74abb.jpg?v=1706125264',
		},
	],
	overflowButtonInGrid: true,
	hideLabels: true,
	rows: 1,
	columns: 4,
} as GridProps;

export const backgroundColors = (args: GridProps) => <Grid {...args} />;
backgroundColors.args = {
	options: [
		{
			value: 'red',
			background: 'red',
		},
		{
			value: 'blue',
			background: 'blue',
		},
		{
			value: 'white',
			background: 'white',
			disabled: true,
		},
		{
			value: 'green',
			background: 'green',
		},
		{
			value: 'yellow',
			background: 'yellow',
		},
	],
	hideLabels: true,
	overflowButtonInGrid: true,
	rows: 1,
} as GridProps;

export const overflow = (args: GridProps) => <Grid {...args} />;
overflow.args = {
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
		{
			value: 'five',
		},
		{
			value: 'six',
		},
		{
			value: 'seven',
		},
		{
			value: 'eight',
		},
	],
	rows: 2,
	columns: 3,
} as GridProps;
