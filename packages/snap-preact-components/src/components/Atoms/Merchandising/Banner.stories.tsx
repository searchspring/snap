import { h } from 'preact';

import { ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs/blocks';

import { Banner, BannerProps } from './Banner';
import { componentArgs } from '../../../utilities';
import { Snapify } from '../../../utilities/snapify';
import Readme from '../Merchandising/readme.md';

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

const Template = (args: BannerProps, { loaded: { controller } }) => <Banner {...args} content={controller?.store?.merchandising?.content} />;

export const Header = Template.bind({});
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

export const Footer = Template.bind({});
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

export const Secondary = Template.bind({});
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

export const Left = Template.bind({});
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
