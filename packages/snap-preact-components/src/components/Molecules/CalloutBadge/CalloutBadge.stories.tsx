import { h } from 'preact';
import { observer } from 'mobx-react';

import { ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs/blocks';

import { CalloutBadgeProps, CalloutBadge } from './CalloutBadge';
import { componentArgs } from '../../../utilities';
import { Snapify } from '../../../utilities/snapify';
import Readme from '../CalloutBadge/readme.md';

import type { SearchController } from '@searchspring/snap-controller';

export default {
	title: `Molecules/CalloutBadge`,
	component: CalloutBadge,
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
		name: {
			description: 'Callout location name',
			type: { required: true },
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: 'callout' },
			},
			control: { type: 'text' },
		},
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
		componentMap: {
			description: 'Component map containing custom badge component',
			table: {
				type: {
					summary: 'object',
				},
			},
			control: { type: 'object' },
		},
		...componentArgs,
	},
};

const snapInstance = Snapify.search({ id: 'Result', globals: { siteId: '8uyt2m' } });

const ObservableCalloutBadge = observer(({ args, controller }: { args: CalloutBadgeProps; controller: SearchController }) => {
	return <CalloutBadge {...args} controller={controller} result={controller?.store?.results[1]} />;
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
			response.results[0] = {
				...response.results[0],
				badges: [
					{
						tag: 'free-shipping-overlay',
						label: 'Free Shipping',
					},
				],
			};
			response.results[1] = {
				...response.results[1],
				badges: [
					{
						tag: 'free-shipping-callout',
						label: 'Free Shipping',
					},
				],
			};
			response.meta = {
				...response.meta,
				badges: {
					locations: {
						overlay: {
							left: [
								{
									name: 'left',
									label: 'Left',
									description: 'description for left',
								},
							],
							right: [],
						},
						callouts: [
							{
								name: 'callout',
								label: 'Callout',
								description: 'description for callout',
							},
						],
					},
					tags: {
						'free-shipping-overlay': {
							location: 'left',
							component: 'BadgeText',
							parameters: {
								color: '#FF0000',
								colorText: '#FFFFFF',
							},
						},
						'free-shipping-callout': {
							location: 'callout',
							component: 'BadgeText',
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
Default.args = {
	name: 'callout',
};
