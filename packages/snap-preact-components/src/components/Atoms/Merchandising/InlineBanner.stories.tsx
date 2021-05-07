import { h } from 'preact';

import { InlineBanner, InlineBannerProps } from './InlineBanner';

import { componentArgs } from '../../../utilities';
import { Snapify } from '../../../utilities/snapify';
import { ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs/blocks';

import Readme from '../Merchandising/readme.md';

export default {
	title: `Atoms/InlineBanner`,
	component: InlineBanner,
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
		banner: {
			description: 'InlineBanner content store reference',
			type: { required: true },
			table: {
				type: {
					summary: 'inline banner content store object',
				},
			},
			control: { type: 'none' },
		},
		layout: {
			description: 'Banner layout',
			type: { required: true },
			table: {
				type: {
					summary: 'string',
				},
			},
			control: {
				type: 'select',
				options: ['grid', 'list'],
			},
		},
		...componentArgs,
	},
	decorators: [
		(Story) => (
			<div
				style={{
					width: '220px',
					height: '300px',
					position: 'relative',
				}}
			>
				<Story height="200px" />
			</div>
		),
	],
};

const snapInstance = Snapify.search({ globals: { siteId: 'scmq7n', search: { query: { string: 'glasses' } } } });

const Template = (args: InlineBannerProps, { loaded: { controller } }) => (
	<InlineBanner banner={controller?.store?.merchandising?.content.inline[0]} {...args} />
);

export const Default = Template.bind({});
Default.loaders = [
	async () => ({
		controller: await snapInstance.search(),
	}),
];
