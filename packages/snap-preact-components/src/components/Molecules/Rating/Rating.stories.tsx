import { h } from 'preact';

import { ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs/blocks';

import { componentArgs } from '../../../utilities';
import Readme from './readme.md';
import { Rating, RatingProps } from './Rating';

export default {
	title: `Molecules/Rating`,
	component: Rating,
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
		value: {
			description: 'rating value',
			type: { required: true },
			table: {
				type: {
					summary: 'number',
				},
			},
			control: { type: 'number' },
		},
		count: {
			description: 'rating count',
			type: { required: false },
			table: {
				type: {
					summary: 'number',
				},
			},
			control: { type: 'number' },
		},
		additionalText: {
			defaultValue: '',
			type: { required: false },
			description: 'Additional text to be rendered.',
			table: {
				type: {
					summary: 'string',
				},
			},
			control: { type: 'text' },
		},
		showEmptyRatings: {
			description: 'determines to render when rating is 0 or undefined.',
			type: { required: false },
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: 'boolean',
		},
		disablePartialFill: {
			description: 'determines to render when rating is 0 or undefined.',
			type: { required: false },
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: 'boolean',
		},
		...componentArgs,
	},
};

export const Default = (args: RatingProps) => <Rating {...args} />;
