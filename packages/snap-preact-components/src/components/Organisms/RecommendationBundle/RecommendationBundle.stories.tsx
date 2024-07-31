import { h } from 'preact';

import { ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs/blocks';

import { RecommendationBundle, RecommendationBundleProps } from '../RecommendationBundle';
import { componentArgs } from '../../../utilities';
import { Snapify } from '../../../utilities/snapify';

import Readme from './readme.md';
import type { RecommendationController } from '@searchspring/snap-controller';
import type { Product } from '@searchspring/snap-store-mobx';
import type { Next } from '@searchspring/snap-event-manager';
import { iconPaths } from '../../Atoms/Icon';
import type { RecommendationControllerConfig } from '@searchspring/snap-controller';

export default {
	title: `Organisms/RecommendationBundle`,
	component: RecommendationBundle,
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
			type: { required: true },
			table: {
				type: {
					summary: 'function',
				},
			},
			action: 'onAddToCart',
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
		carousel: {
			description: 'Carousel settings object',
			defaultValue: {
				enabled: true,
				loop: false,
			},
			table: {
				type: {
					summary: 'object',
				},
				defaultValue: { summary: 'Carousel settings object' },
			},
			control: { type: 'object' },
		},
		preselectedCount: {
			description: 'Number of results to have selected by default. (seed included)',
			table: {
				type: {
					summary: 'number',
				},
			},
			control: { type: 'number' },
		},
		hideCheckboxes: {
			defaultValue: false,
			description: 'Hide/show bundle checkboxes in results',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
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
		hideSeed: {
			description: 'Hide/show seed result',
			defaultValue: false,
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		vertical: {
			description: 'set the recommendation to render vertically',
			defaultValue: false,
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		separatorIconSeedOnly: {
			description: 'boolean to only have seperator Icon for the seed product',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: true },
			},
			control: { type: 'boolean' },
		},
		separatorIcon: {
			defaultValue: 'plus',
			description: 'Icon to render between results',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: 'plus' },
			},
			control: {
				type: 'select',
				options: [...Object.keys(iconPaths)],
			},
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

export const Default = (props: RecommendationBundleProps, { loaded: { controller } }: { loaded: { controller: RecommendationController } }) => {
	return <RecommendationBundle {...props} controller={controller} results={controller.store.results.reverse()} />;
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
