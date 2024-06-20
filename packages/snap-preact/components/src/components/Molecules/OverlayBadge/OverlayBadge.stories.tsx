import { h } from 'preact';
import { observer } from 'mobx-react';

import { ArgsTable, PRIMARY_STORY, Markdown } from '@storybook/blocks';

import { OverlayBadgeProps, OverlayBadge } from './OverlayBadge';
import { componentArgs, highlightedCode } from '../../../utilities';
import { Snapify } from '../../../utilities/snapify';
import Readme from '../OverlayBadge/readme.md';

import type { SearchController } from '@searchspring/snap-controller';
import type { Product } from '@searchspring/snap-store-mobx';

export default {
	title: 'Molecules/OverlayBadge',
	component: OverlayBadge,
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
				<Story />
				<div
					style={{
						height: '50px',
						margin: '10px 0',
						border: '2px dotted lightgrey',
					}}
				/>
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
		controller: {
			description: 'Controller reference',
			type: { required: true },
			table: {
				type: {
					summary: 'Controller',
				},
			},
			control: { type: 'none' },
		},
		children: {
			description: 'Overlay content to be displayed',
			type: { required: true },
			table: {
				type: {
					summary: 'string, JSX',
				},
			},
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
		...componentArgs,
	},
};

const snapInstance = Snapify.search({ id: 'Result', globals: { siteId: '8uyt2m' } });

const ObservableOverlayBadge = observer(({ args, controller }: { args: OverlayBadgeProps; controller: SearchController }) => {
	return (
		<OverlayBadge {...args} controller={controller} result={controller?.store?.results[0] as Product}>
			<div
				style={{
					height: '300px',
					border: '2px dotted lightgrey',
				}}
			/>
		</OverlayBadge>
	);
});

export const Default = (args: OverlayBadgeProps, { loaded: { controller } }: { loaded: { controller: SearchController } }) => {
	return <ObservableOverlayBadge args={args} controller={controller} />;
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

			response.results[0].badges = [
				{
					tag: 'free-shipping-overlay',
					value: 'Free Shipping',
				},
			];
			response.results[1].badges = [
				{
					tag: 'free-shipping-callout',
					value: 'Free Shipping',
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
						right: [],
						callout: [
							{
								tag: 'callout',
								name: 'Callout',
							},
						],
					},
					tags: {
						'free-shipping-overlay': {
							location: 'left/left',
							component: 'BadgeRectangle',
							priority: 1,
							enabled: true,
							parameters: {
								color: '#FF0000',
								colorText: '#FFFFFF',
							},
						},
						'free-shipping-callout': {
							location: 'callout/callout',
							component: 'BadgeRectangle',
							priority: 1,
							enabled: true,
							parameters: {
								color: '#FF0000',
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
