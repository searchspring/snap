import { h } from 'preact';
import { observer } from 'mobx-react';
import { ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs/blocks';
import { Swatches, SwatchesProps } from './Swatches';
import { componentArgs } from '../../../utilities';
import Readme from '../Swatches/readme.md';

export default {
	title: `Molecules/Swatches`,
	component: Swatches,
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

export const ThumbnailImageBackground = (args: SwatchesProps) => {
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
ThumbnailImageBackground.args = {
	options: [
		{
			value: 'PastelPalms',
			label: 'Pastel Palms',
			disabled: false,
			backgroundImageUrl: 'https://www.rufflebutts.com/media/wysiwyg/P0533-PastelPalms_2.jpg',
		},
		{
			value: 'ShimmerOn-Swim',
			label: 'ShimmerOn Swim',
			disabled: false,
			backgroundImageUrl: 'https://www.rufflebutts.com/media/wysiwyg/P0598-ShimmerOn-Swim_1.jpg',
		},
		{
			value: 'MarineGlow',
			label: 'Marine Glow',
			disabled: false,
			backgroundImageUrl: 'https://www.rufflebutts.com/media/wysiwyg/P0543-MarineGlow.jpg',
		},
		{
			value: 'PeriwinkleButterflyGarden',
			label: 'Periwinkle Butterfly Garden',
			disabled: false,
			backgroundImageUrl: 'https://www.rufflebutts.com/media/wysiwyg/P0621-PeriwinkleButterflyGarden.jpg',
		},
		{
			value: 'PeriwinkleBlueSeersucker',
			label: 'Periwinkle Blue Seersucker',
			disabled: false,
			backgroundImageUrl: 'https://www.rufflebutts.com/media/wysiwyg/P0539-ApparelPeriwinkleBlueSeersucker_1.jpg',
		},
	],
};
