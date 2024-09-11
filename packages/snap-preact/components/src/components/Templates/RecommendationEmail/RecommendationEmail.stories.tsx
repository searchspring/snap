import { h } from 'preact';

import { ArgsTable, PRIMARY_STORY, Markdown } from '@storybook/blocks';

import { RecommendationEmail, RecommendationEmailProps } from './RecommendationEmail';
import { componentArgs, highlightedCode } from '../../../utilities';
import { Snapify } from '../../../utilities/snapify';

import Readme from './readme.md';
import type { RecommendationController } from '@searchspring/snap-controller';
import type { Product } from '@searchspring/snap-store-mobx';
import type { Next } from '@searchspring/snap-event-manager';

export default {
	title: 'Templates/RecommendationEmail',
	component: RecommendationEmail,
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
					maxWidth: '900px',
					height: '500px',
				}}
			>
				<Story />
			</div>
		),
	],
	argTypes: {
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
		results: {
			description: 'Results store reference, overrides controller.store.results',
			type: { required: false },
			table: {
				type: {
					summary: 'Results store object',
				},
			},
			control: { type: 'none' },
		},
		resultComponent: {
			description: 'Custom component to render each result',
			type: { required: false },
			table: {
				type: {
					summary: 'ResultComponent',
				},
			},
			control: { type: 'none' },
		},
		resultProps: {
			description: 'Additional props to pass to each result component',
			type: { required: false },
			table: {
				type: {
					summary: 'Partial<ResultProps> | Record<string, any>',
				},
			},
			control: { type: 'object' },
		},
		resultWidth: {
			description: 'Width of each result card',
			type: { required: false },
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: '240px' },
			},
			control: { type: 'text' },
		},
		...componentArgs,
	},
};

const snapInstance = Snapify.recommendation({ id: 'RecommendationEmail', tag: 'email', globals: { siteId: '8uyt2m' } });

export const Default = (props: RecommendationEmailProps, { loaded: { controller } }: { loaded: { controller: RecommendationController } }) => {
	return <RecommendationEmail {...props} controller={controller} />;
};

Default.loaders = [
	async () => {
		snapInstance.on('afterStore', async ({ controller }: { controller: RecommendationController }, next: Next) => {
			controller.store.results.forEach((result: Product) => (result.mappings.core!.url = 'javascript:void(0);'));
			await next();
		});
		await snapInstance.search();
		return {
			controller: snapInstance,
		};
	},
];
