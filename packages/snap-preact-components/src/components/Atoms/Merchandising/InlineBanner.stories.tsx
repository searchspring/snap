import { h } from 'preact';

import { ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs/blocks';

import { InlineBanner, InlineBannerProps } from './InlineBanner';
import { componentArgs } from '../../../utilities';
import { Snapify } from '../../../utilities/snapify';
import Readme from '../Merchandising/readme.md';
import { Layout } from '../../../types';

import type { Banner } from '@searchspring/snap-store-mobx';
import type { SearchController } from '@searchspring/snap-controller';

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
			description: 'Banner object reference',
			type: { required: true },
			table: {
				type: {
					summary: 'inline banner store object',
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
	const inlineBanners = controller?.store?.results?.filter((result) => result.type === 'banner').pop() as Banner;

	return inlineBanners && <InlineBanner {...args} banner={inlineBanners} />;
};

Default.loaders = [
	async () => {
		await snapInstance.search();
		return {
			controller: snapInstance,
		};
	},
];
