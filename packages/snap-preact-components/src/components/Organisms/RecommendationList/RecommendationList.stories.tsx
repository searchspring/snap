import { h } from 'preact';

import { ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs/blocks';

import { RecommendationList, RecommendationListProps } from './RecommendationList';
import { componentArgs } from '../../../utilities';
import { Snapify } from '../../../utilities/snapify';

import Readme from './readme.md';
import type { RecommendationController } from '@searchspring/snap-controller';
import type { Product } from '@searchspring/snap-store-mobx';
import type { Next } from '@searchspring/snap-event-manager';

export default {
	title: `Organisms/RecommendationList`,
	component: RecommendationList,
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
		title: {
			description: 'Recommendation title',
			table: {
				type: {
					summary: 'string | JSX Element',
				},
				defaultValue: { summary: '' },
			},
			control: { type: 'text' },
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
		vertical: {
			defaultValue: false,
			description: 'Recommendation list direction',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		resultComponent: {
			description: 'Slot for custom result component',
			table: {
				type: {
					summary: 'component',
				},
			},
		},
		limit: {
			description: 'limit the number of results rendered',
			table: {
				type: {
					summary: 'number',
				},
			},
			control: { type: 'number' },
		},
		...componentArgs,
	},
};

const snapInstance = Snapify.recommendation({ id: 'Recommendation', tag: 'trending', globals: { siteId: '8uyt2m' } });

export const Default = (props: RecommendationListProps, { loaded: { controller } }: { loaded: { controller: RecommendationController } }) => {
	return <RecommendationList {...props} controller={controller} />;
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
