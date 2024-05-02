import { h } from 'preact';
import { ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs/blocks';
import { Grid, GridProps } from './Grid';
import { componentArgs } from '../../../utilities';
import Readme from './readme.md';

export default {
	title: 'Molecules/Grid',
	component: Grid,
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
				defaultValue: { summary: true },
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
		showLessText: {
			defaultValue: 'Show Less',
			description: 'show less text',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: 'Show Less' },
			},
			control: { type: 'text' },
		},
		showMoreText: {
			defaultValue: 'Show more',
			description: 'show more text',
			table: {
				type: {
					summary: 'string | (remainder) => string',
				},
				defaultValue: { summary: 'Show more' },
			},
			control: { type: 'text' },
		},
		disableShowMoreClick: {
			description: 'enable/disable show more click functionality',
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
