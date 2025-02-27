import { h } from 'preact';
import { observer } from 'mobx-react-lite';

import { ArgsTable, PRIMARY_STORY, Markdown } from '@storybook/blocks';

import { CalloutBadgeProps, CalloutBadge } from './CalloutBadge';
import { componentArgs, highlightedCode } from '../../../utilities';
import { Snapify } from '../../../utilities/snapify';
import Readme from '../CalloutBadge/readme.md';

import type { SearchController } from '@searchspring/snap-controller';
import type { Product } from '@searchspring/snap-store-mobx';

export default {
	title: 'Molecules/CalloutBadge',
	component: CalloutBadge,
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
			<div
				style={{
					width: '300px',
					height: '500px',
					padding: '20px',
					border: '2px dotted lightgrey',
				}}
			>
				<div
					style={{
						height: '300px',
						border: '2px dotted lightgrey',
					}}
				/>
				<div
					style={{
						height: '50px',
						margin: '10px 0',
						border: '2px dotted lightgrey',
					}}
				/>
				<Story />
			</div>
		),
	],
	argTypes: {
		result: {
			description: 'Result store Product reference',
			type: { required: true },
			table: {
				type: {
					summary: 'result store Product object',
				},
			},
			control: { type: 'none' },
		},
		componentMap: {
			description: 'Component map containing custom badge component',
			table: {
				type: {
					summary: 'object',
				},
			},
			control: { type: 'object' },
		},
		renderEmpty: {
			description: 'Render wrapper element even when there are no badges',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		limit: {
			description: 'Number of badges per slot',
			table: {
				type: {
					summary: 'number',
				},
				defaultValue: { summary: '1' },
			},
			control: { type: 'number' },
		},
		tag: {
			description: 'Callout location tag',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: 'callout' },
			},
			control: { type: 'text' },
		},
		...componentArgs,
	},
};

const snapInstance = Snapify.search({ id: 'CalloutBadge', globals: { siteId: '8uyt2m' } });

const ObservableCalloutBadge = observer(({ args, controller }: { args: CalloutBadgeProps; controller: SearchController }) => {
	return <CalloutBadge {...args} result={controller?.store?.results[0] as Product} />;
});

export const Default = (args: CalloutBadgeProps, { loaded: { controller } }: { loaded: { controller: SearchController } }) => {
	return <ObservableCalloutBadge args={args} controller={controller} />;
};

Default.loaders = [
	async () => {
		snapInstance.on('afterSearch', ({ response }: any) => {
			/**
			 * Mock badge response - TODO: remove when badges are available in response
			 *
			 * Controller is shared between stories, therefore both badges are defined
			 * here so that when switching between OverlayBadge and CalloutBadge stories,
			 * a page reload is not required
			 */

			response.search.results[0].badges = [
				{
					tag: 'free-shipping',
					value: 'Free Shipping',
				},
				{
					tag: 'last-one',
					value: 'Last One!',
				},
				{
					tag: 'on-sale',
					value: 'On Sale',
				},
				{
					tag: 'save-percent',
					value: 'Save 30%',
				},
				{
					tag: 'inventory-remaining',
					value: '1 in stock',
				},
			];

			response.meta = {
				...response.meta,
				badges: {
					locations: {
						left: [
							{
								tag: 'left',
								name: 'Left',
							},
						],
						right: [
							{
								tag: 'right',
								name: 'Right',
							},
						],
						callout: [
							{
								tag: 'callout',
								name: 'Callout',
							},
						],
					},
					tags: {
						'free-shipping': {
							location: 'callout/callout',
							component: 'BadgeRectangle',
							priority: 1,
							enabled: true,
							parameters: {
								color: '#3A23AD',
								colorText: '#FFFFFF',
							},
						},
						'last-one': {
							location: 'callout/callout',
							component: 'BadgePill',
							priority: 1,
							enabled: true,
							parameters: {
								color: '#515151',
								colorText: '#FFFFFF',
							},
						},
						'inventory-remaining': {
							location: 'callout/callout',
							component: 'BadgePill',
							priority: 1,
							enabled: true,
							parameters: {
								color: '#382F5A',
								colorText: '#FFFFFF',
							},
						},
						'on-sale': {
							location: 'left/left',
							component: 'BadgePill',
							priority: 1,
							enabled: true,
							parameters: {
								color: '#00CEE1',
								colorText: '#FFFFFF',
							},
						},
						'save-percent': {
							location: 'left/left',
							component: 'BadgeRectangle',
							priority: 1,
							enabled: true,
							parameters: {
								color: '#8F6CF6',
								colorText: '#FFFFFF',
							},
						},
					},
				},
			};
		});

		await snapInstance.search();

		return {
			controller: snapInstance,
		};
	},
];
Default.args = {
	tag: 'callout',
};
