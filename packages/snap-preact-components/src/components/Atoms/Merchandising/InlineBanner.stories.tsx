import { h } from 'preact';

import { ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs/blocks';

import { InlineBanner, InlineBannerProps } from './InlineBanner';
import { componentArgs } from '../../../utilities';
import { Snapify } from '../../../utilities/snapify';
import Readme from '../Merchandising/readme.md';
import { Layout } from '../../../types';
import { SearchController } from '@searchspring/snap-controller';
import { InlineBannerContent } from '../../../types';

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
			type: { required: false },
			table: {
				type: {
					summary: 'inline banner content store object',
				},
			},
			control: { type: 'none' },
		},
		layout: {
			description: 'Banner layout',
			defaultValue: Layout.GRID,
			table: {
				type: {
					summary: 'string',
				},
			},
			control: {
				type: 'select',
				options: [Layout.GRID, Layout.LIST],
			},
		},
		width: {
			description: 'InlineBanner width',
			table: {
				type: {
					summary: 'string',
				},
			},
			control: { type: 'text' },
		},
		onClick: {
			description: 'Custom onClick event handler',
			table: {
				type: {
					summary: 'function',
				},
			},
			action: 'onClick',
		},
		...componentArgs,
	},
	decorators: [
		(Story: any) => (
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

const snapInstance = Snapify.search({ id: 'InlineBanner', globals: { siteId: '8uyt2m', search: { query: { string: 'glasses' } } } });

export const Default = (args: InlineBannerProps, { loaded: { controller } }: { loaded: { controller: SearchController } }) => {
	const inlineBanners = controller?.store?.merchandising?.content?.inline as unknown as InlineBannerContent[];

	return inlineBanners && <InlineBanner banner={inlineBanners[0]} {...args} />;
};

Default.loaders = [
	async () => {
		await snapInstance.search();
		return {
			controller: snapInstance,
		};
	},
];
