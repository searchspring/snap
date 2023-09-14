import { h } from 'preact';

import { ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs/blocks';

import { componentArgs } from '../../../utilities';
import Readme from './readme.md';
import { Rating, RatingProps } from './Rating';
import { iconPaths } from '../../Atoms/Icon';

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
			description: 'The rating value (out of five)',
			type: { required: true },
			table: {
				type: {
					summary: 'number',
				},
			},
			control: { type: 'number' },
		},
		count: {
			description: 'The number of ratings or reviews',
			type: { required: false },
			table: {
				type: {
					summary: 'number',
				},
			},
			control: { type: 'number' },
		},
		text: {
			type: { required: false },
			description: 'Additional text to be rendered.',
			table: {
				type: {
					summary: 'string',
				},
			},
			control: { type: 'text' },
		},
		alwaysRender: {
			description: 'Force to render even when value is 0 or undefined',
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
			description: 'Disables fractional stars - will round down',
			type: { required: false },
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: 'boolean',
		},
		fullIcon: {
			description: 'Icon to render in for a full star',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: 'star' },
			},
			control: {
				type: 'select',
				options: [...Object.keys(iconPaths)],
			},
		},
		emptyIcon: {
			description: 'Icon to render for an empty star',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: 'star-o' },
			},
			control: {
				type: 'select',
				options: [...Object.keys(iconPaths)],
			},
		},
		...componentArgs,
	},
};

export const Default = (props: RatingProps) => <Rating {...props} />;
Default.args = {
	value: 4.5,
};

export const StarsWithCount = (props: RatingProps) => <Rating {...props} />;
StarsWithCount.args = {
	value: 3,
	count: 33,
	emptyIcon: 'star',
};

export const Hearts = (props: RatingProps) => <Rating {...props} />;
Hearts.args = {
	value: 3.3,
	fullIcon: 'heart',
	emptyIcon: 'heart-o',
};
