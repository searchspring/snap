import { h } from 'preact';
import { Result, ResultProps } from './Result';
import { FALLBACK_IMAGE_URL } from '../../Atoms/Image';
import { componentArgs } from '../../../utilities';
import { Snapify } from '../../../utilities/snapify';

export default {
	title: `Molecules/Result`,
	component: Result,
	decorators: [
		(Story) => (
			<div style={{ margin: '1em' }}>
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
			defaultValue: false,
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
			defaultValue: false,
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
			defaultValue: false,
			description: 'Hide pricing',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		detailsSlot: {
			description: 'Slot just under product image',
			table: {
				type: {
					summary: 'object',
				},
			},
			control: { type: 'object' },
		},
		buttonSlot: {
			description: 'Slot just under details',
			table: {
				type: {
					summary: 'object',
				},
			},
			control: { type: 'object' },
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
		...componentArgs,
	},
};

const snapInstance = Snapify.search({ globals: { siteId: 'scmq7n' } });
const Template = (args: ResultProps, { loaded: { controller } }) => <Result result={controller?.store?.results[0]} {...args} />;

export const Default = Template.bind({});
Default.loaders = [
	async () => ({
		controller: await snapInstance.search(),
	}),
];

export const hideSections = Template.bind({});
hideSections.loaders = [
	async () => ({
		controller: await snapInstance.search(),
	}),
];
hideSections.args = {
	hideBadge: true,
	hideTitle: true,
	hidePricing: true,
};
