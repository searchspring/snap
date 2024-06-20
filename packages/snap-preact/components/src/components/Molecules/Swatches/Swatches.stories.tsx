import { h } from 'preact';
import { observer } from 'mobx-react';
import { ArgsTable, PRIMARY_STORY, Markdown } from '@storybook/blocks';
import { Swatches, SwatchesProps } from './Swatches';
import { componentArgs, highlightedCode } from '../../../utilities';
import Readme from '../Swatches/readme.md';

export default {
	title: 'Molecules/Swatches',
	component: Swatches,
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
		options: {
			description: 'list of options to display',
			type: { required: false },
			table: {
				type: {
					summary: 'SwatchOption[]',
				},
			},
			control: { type: 'object' },
		},
		selected: {
			description: 'Current selected option',
			type: { required: false },
			table: {
				type: {
					summary: 'SwatchOption',
				},
			},
			control: { type: 'none' },
		},
		hideLabels: {
			description: 'enable/disable option labels',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: true },
			},
			control: { type: 'boolean' },
		},
		breakpoints: {
			defaultValue: undefined,
			description: 'Carousel breakpoints',
			table: {
				type: {
					summary: 'object',
				},
				defaultValue: { summary: 'Breakpoint object' },
			},
			control: { type: 'object' },
		},
		type: {
			description: 'swatches type to render',
			table: {
				type: {
					summary: 'swatches type',
				},
				defaultValue: { summary: 'carousel' },
			},
			control: {
				type: 'select',
				options: ['carousel', 'grid'],
			},
		},
		...componentArgs,
	},
};

const ObservableSelection = observer(({ args }: { args: SwatchesProps }) => {
	return <Swatches {...args} />;
});

export const Default = (args: SwatchesProps) => {
	return <ObservableSelection args={args} />;
};

export const Grid = (args: SwatchesProps) => {
	return <ObservableSelection args={args} />;
};

export const Disabled = (args: SwatchesProps) => {
	return <ObservableSelection args={args} />;
};

export const GradientBackground = (args: SwatchesProps) => {
	return <ObservableSelection args={args} />;
};

export const Images = (args: SwatchesProps) => {
	return <ObservableSelection args={args} />;
};

Default.args = {
	options: [
		{ value: 'Red', label: 'Red', disabled: false },
		{ value: 'Blue', label: 'Blue', disabled: false },
		{ value: 'Green', label: 'Green', disabled: false },
		{ value: 'Orange', label: 'Orange', disabled: false },
		{ value: 'Tan', label: 'Tan', disabled: false },
		{ value: 'Pink', label: 'Pink', disabled: false },
		{ value: 'Black', label: 'Black', disabled: false },
		{ value: 'White', label: 'White', disabled: false },
	],
};

Grid.args = {
	options: [
		{ value: 'Red', label: 'Red', disabled: false },
		{ value: 'Blue', label: 'Blue', disabled: false },
		{ value: 'Green', label: 'Green', disabled: false },
		{ value: 'Orange', label: 'Orange', disabled: false },
		{ value: 'Tan', label: 'Tan', disabled: false },
		{ value: 'Pink', label: 'Pink', disabled: false },
		{ value: 'Black', label: 'Black', disabled: false },
		{ value: 'White', label: 'White', disabled: false },
	],
	type: 'grid',
} as SwatchesProps;

Disabled.args = {
	options: [
		{ value: 'Red', label: 'Red', disabled: true },
		{ value: 'Blue', label: 'Blue', disabled: false },
		{ value: 'Green', label: 'Green', disabled: true },
		{ value: 'Orange', label: 'Orange', disabled: false },
		{ value: 'Tan', label: 'Tan', disabled: false },
		{ value: 'Pink', label: 'Pink', disabled: true },
		{ value: 'Black', label: 'Black', disabled: false },
		{ value: 'White', label: 'White', disabled: true },
	],
	type: 'carousel',
} as SwatchesProps;

GradientBackground.args = {
	options: [
		{
			value: 'Rainbow',
			label: 'Rainbow',
			disabled: false,
			background: `linear-gradient(
                90deg,
                rgba(255, 0, 0, 1) 0%,
                rgba(255, 154, 0, 1) 10%,
                rgba(208, 222, 33, 1) 20%,
                rgba(79, 220, 74, 1) 30%,
                rgba(63, 218, 216, 1) 40%,
                rgba(47, 201, 226, 1) 50%,
                rgba(28, 127, 238, 1) 60%,
                rgba(95, 21, 242, 1) 70%,
                rgba(186, 12, 248, 1) 80%,
                rgba(251, 7, 217, 1) 90%,
                rgba(255, 0, 0, 1) 100%
            )`,
		},

		{ value: 'Red', label: 'Red', disabled: true },
		{ value: 'Blue', label: 'Blue', disabled: false },
		{ value: 'Green', label: 'Green', disabled: true },
		{ value: 'Orange', label: 'Orange', disabled: false },
		{ value: 'Tan', label: 'Tan', disabled: false },
	],
};

Images.args = {
	carousel: {
		slidesPerView: 3,
		spaceBetween: 10,
	},
	breakpoints: {},
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
};
