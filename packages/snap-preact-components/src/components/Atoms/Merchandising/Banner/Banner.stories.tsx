import { h } from 'preact';

import { ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs/blocks';

import { Banner, BannerProps } from './Banner';
import { componentArgs } from '../../../../utilities';
import { Snapify } from '../../../../utilities/snapify';
import Readme from './readme.md';
import { SearchController } from '@searchspring/snap-controller';

export default {
	title: `Atoms/Banner`,
	component: Banner,
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
		content: {
			description: 'Banner content store reference',
			type: { required: true },
			table: {
				type: {
					summary: 'banner content store object',
				},
			},
			control: { type: 'none' },
		},
		type: {
			description: 'Banner position type',
			type: { required: true },
			table: {
				type: {
					summary: 'string',
				},
			},
			control: {
				type: 'select',
				options: ['header', 'footer', 'left', 'inline', 'banner'],
			},
		},
		...componentArgs,
	},
};

const snapInstance = Snapify.search({ id: 'Banner', globals: { siteId: '8uyt2m', search: { query: { string: 'glasses' } } } });

export const Header = (args: BannerProps, { loaded: { controller } }: { loaded: { controller: SearchController } }) => (
	<Banner {...args} content={controller?.store?.merchandising?.content} />
);
Header.loaders = [
	async () => {
		await snapInstance.search();
		return {
			controller: snapInstance,
		};
	},
];
Header.args = {
	type: 'header',
};

export const Footer = (args: BannerProps, { loaded: { controller } }: { loaded: { controller: SearchController } }) => (
	<Banner {...args} content={controller?.store?.merchandising?.content} />
);
Footer.loaders = [
	async () => {
		await snapInstance.search();
		return {
			controller: snapInstance,
		};
	},
];
Footer.args = {
	type: 'footer',
};

export const Secondary = (args: BannerProps, { loaded: { controller } }: { loaded: { controller: SearchController } }) => (
	<Banner {...args} content={controller?.store?.merchandising?.content} />
);
Secondary.loaders = [
	async () => {
		await snapInstance.search();
		return {
			controller: snapInstance,
		};
	},
];
Secondary.args = {
	type: 'banner',
};

export const Left = (args: BannerProps, { loaded: { controller } }: { loaded: { controller: SearchController } }) => (
	<Banner {...args} content={controller?.store?.merchandising?.content} />
);
Left.loaders = [
	async () => {
		await snapInstance.search();
		return {
			controller: snapInstance,
		};
	},
];
Left.args = {
	type: 'left',
};
