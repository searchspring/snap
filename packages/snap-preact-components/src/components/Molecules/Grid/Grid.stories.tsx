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
