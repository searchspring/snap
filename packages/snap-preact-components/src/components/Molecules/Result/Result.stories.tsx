import { h } from 'preact';

import { ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs/blocks';

import { Result, ResultProps } from './Result';
import { FALLBACK_IMAGE_URL } from '../../Atoms/Image';
import { componentArgs } from '../../../utilities';
import { Snapify } from '../../../utilities/snapify';
import Readme from '../Result/readme.md';
import { Layout } from '../../../types';

export default {
	title: `Molecules/Result`,
	component: Result,
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
		(Story) => (
			<div style={{ maxWidth: '250px' }}>
				<Story />
			</div>
		),
	],
	argTypes: {
		result: {
			description: 'Result store reference',
			type: { required: true },
			table: {
				type: {
					summary: 'result store object',
				},
			},
			control: { type: 'none' },
		},
		hideBadge: {
			description: 'Hide badge',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		hideTitle: {
			description: 'Hide title',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		hidePricing: {
			description: 'Hide pricing',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		detailSlot: {
			description: 'Slot for more product details (under price)',
			table: {
				type: {
					summary: 'string',
				},
			},
			control: { type: 'text' },
		},
		fallback: {
			defaultValue: '',
			description: 'Fallback image url',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: FALLBACK_IMAGE_URL },
			},
			control: { type: 'text' },
		},
		layout: {
			description: 'Results layout',
			defaultValue: Layout.GRID,
			table: {
				type: {
					summary: 'string',
				},
			},
			control: {
				type: 'select',
				options: [Layout.GRID, Layout.LIST],
			},
		},
		controller: {
			description: 'Controller reference',
			table: {
				type: {
					summary: 'Controller',
				},
			},
			control: { type: 'none' },
		},
		...componentArgs,
	},
};

const snapInstance = Snapify.search({ id: 'Result', globals: { siteId: '8uyt2m' } });
const Template = (args: ResultProps, { loaded: { controller } }) => <Result result={controller?.store?.results[0]} {...args} />;

export const Default = Template.bind({});
Default.loaders = [
	async () => {
		await snapInstance.search();
		return {
			controller: snapInstance,
		};
	},
];

export const hideSections = Template.bind({});
hideSections.loaders = [
	async () => {
		await snapInstance.search();
		return {
			controller: snapInstance,
		};
	},
];
hideSections.args = {
	hideBadge: true,
	hideTitle: true,
	hidePricing: true,
};

export const truncateTitle = Template.bind({});
truncateTitle.loaders = [
	async () => {
		await snapInstance.search();
		return {
			controller: snapInstance,
		};
	},
];
truncateTitle.args = {
	truncateTitle: { limit: 5, append: '...' },
};
