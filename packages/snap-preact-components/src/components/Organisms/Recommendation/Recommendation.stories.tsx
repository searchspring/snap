import { h } from 'preact';

import { ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs/blocks';

import { Recommendation, RecommendationProps } from './Recommendation';
import { componentArgs } from '../../../utilities';
import { Snapify } from '../../../utilities/snapify';

import Readme from './readme.md';
import { RecommendationController } from '@searchspring/snap-controller';
import type { Product } from '@searchspring/snap-store-mobx';
import type { Next } from '@searchspring/snap-event-manager';

export default {
	title: `Organisms/Recommendation`,
	component: Recommendation,
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
		loop: {
			defaultValue: true,
			description: 'Recommendation pagination loops',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: true },
			},
			control: { type: 'boolean' },
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
		pagination: {
			defaultValue: false,
			description: 'Display pagination dots',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		vertical: {
			defaultValue: false,
			description: 'Recommendation carousel direction',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		hideButtons: {
			defaultValue: false,
			description: 'Hide prev/next buttons',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		prevButton: {
			description: 'Previous button',
			table: {
				type: {
					summary: 'string | JSX Element',
				},
			},
			control: { type: 'text' },
		},
		nextButton: {
			description: 'Next button',
			table: {
				type: {
					summary: 'string | JSX Element',
				},
			},
			control: { type: 'text' },
		},
		breakpoints: {
			defaultValue: undefined,
			description: 'Recommendation title',
			table: {
				type: {
					summary: 'object',
				},
				defaultValue: { summary: 'Breakpoint object' },
			},
			control: { type: 'object' },
		},
		...componentArgs,
	},
};

const snapInstance = Snapify.recommendation({ id: 'Recommendation', tag: 'trending', globals: { siteId: '8uyt2m' } });

export const Default = (props: RecommendationProps, { loaded: { controller } }: { loaded: { controller: RecommendationController } }) => {
	return <Recommendation {...props} controller={controller} />;
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
