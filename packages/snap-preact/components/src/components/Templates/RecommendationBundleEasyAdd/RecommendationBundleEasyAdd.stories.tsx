import { h } from 'preact';

import { ArgsTable, PRIMARY_STORY, Markdown } from '@storybook/blocks';

import { RecommendationBundleEasyAdd, RecommendationBundleEasyAddProps } from './RecommendationBundleEasyAdd';
import { componentArgs, highlightedCode } from '../../../utilities';
import { Snapify } from '../../../utilities/snapify';

import Readme from './readme.md';
import type { RecommendationController } from '@searchspring/snap-controller';
import type { Product } from '@searchspring/snap-store-mobx';
import type { Next } from '@searchspring/snap-event-manager';
import { iconPaths } from '../../Atoms/Icon';
import type { RecommendationControllerConfig } from '@searchspring/snap-controller';

export default {
	title: 'Templates/RecommendationBundleEasyAdd',
	component: RecommendationBundleEasyAdd,
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
					maxWidth: '300px',
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
			description: 'Slot for custom result component',
			table: {
				type: {
					summary: 'component',
				},
			},
		},
		title: {
			description: 'recommendation title',
			table: {
				type: {
					summary: 'string | JSX Element',
				},
				defaultValue: { summary: '' },
			},
			control: { type: 'text' },
		},
		onAddToCart: {
			description: 'onClick event handler for add bundle to cart button in CTA',
			table: {
				type: {
					summary: 'function',
				},
			},
			action: 'onAddToCart',
		},
		seedText: {
			description: 'Text to render in seed product badge',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: 'Seed Product' },
			},
			control: { type: 'text' },
		},
		vertical: {
			description: 'set the recommendation to render vertically',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: true },
			},
			control: { type: 'boolean' },
		},
		ctaButtonText: {
			description: 'text to render in add to cart button',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: 'Add All To Cart' },
			},
			control: { type: 'text' },
		},
		ctaIcon: {
			desciption: 'The `ctaIcon` prop specifies the icon to render in the CTA. Takes an object with `Icon` component props or a string.',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: 'bag' },
			},
			control: {
				type: 'select',
				options: [...Object.keys(iconPaths)],
			},
		},
		ctaButtonSuccessText: {
			description: 'text to temporarily render in the add to cart button after it is clicked',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: 'Bundle Added!' },
			},
			control: { type: 'text' },
		},
		ctaButtonSuccessTimeout: {
			description: 'Number of ms to show success text in add to cart button before reverting back to normal text',
			defaultValue: 2000,
			table: {
				type: {
					summary: 'number',
				},
			},
			control: { type: 'number' },
		},
		ctaInline: {
			description: 'boolean to enable the stacked add to cart button display',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: true },
			},
			control: { type: 'boolean' },
		},
		ctaSlot: {
			description: 'Slot for custom add to cart component',
			table: {
				type: {
					summary: 'component',
				},
			},
		},
		lazyRender: {
			description: 'Lazy render settings object',
			defaultValue: {
				enabled: true,
				offset: '10%',
			},
			table: {
				type: {
					summary: 'object',
				},
				defaultValue: { summary: 'Lazy render settings object' },
			},
			control: { type: 'object' },
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

const config: RecommendationControllerConfig = {
	id: 'RecommendationBundle',
	tag: 'bundle',
	globals: {
		siteId: '8uyt2m',
		products: ['C-AD-W1-1869P'],
	},
};

const snapInstance = Snapify.recommendation(config);

export const Default = (
	props: RecommendationBundleEasyAddProps,
	{ loaded: { controller } }: { loaded: { controller: RecommendationController } }
) => {
	return <RecommendationBundleEasyAdd {...props} controller={controller} results={controller.store.results} />;
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
