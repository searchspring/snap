import { h } from 'preact';

import { Banner, BannerProps } from './Banner';

import { componentArgs } from '../../../utilities';
import { Snapify } from '../../../utilities/snapify';
import { ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs/blocks';

// @ts-ignore
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

const snapInstance = Snapify.search({ globals: { siteId: 'scmq7n', search: { query: { string: 'glasses' } } } });

const Template = (args: BannerProps, { loaded: { controller } }) => <Banner {...args} content={controller?.store?.merchandising?.content} />;

export const Header = Template.bind({});
Header.loaders = [
	async () => ({
		controller: await snapInstance.search(),
	}),
];
Header.args = {
	type: 'header',
	// content: searchResponse.merchandising.content,
};

export const Footer = Template.bind({});
Footer.loaders = [
	async () => ({
		controller: await snapInstance.search(),
	}),
];
Footer.args = {
	type: 'footer',
};

// TODO add inline banner story after SNAPI support
// export const Inline = Template.bind({});
// Inline.loaders = [
// 	async () => ({
// 		controller: await snapInstance.search(),
// 	}),
// ];
// Inline.args = {
// 	type: 'inline',
// };
// Inline.decorators = [
// 	(Story) => (
// 		<div
// 			style={{
// 				display: 'inline-block',
// 				width: '250px',
// 			}}
// 		>
// 			<Story />
// 		</div>
// 	),
// ];

export const Banner_ = Template.bind({});
Banner_.loaders = [
	async () => ({
		controller: await snapInstance.search(),
	}),
];
Banner_.args = {
	type: 'banner',
};

export const Left = Template.bind({});
Left.loaders = [
	async () => ({
		controller: await snapInstance.search(),
	}),
];
Left.args = {
	type: 'left',
};
Left.decorators = [
	(Story) => (
		<div
			style={{
				display: 'inline-block',
				width: '150px',
			}}
		>
			<Story />
		</div>
	),
];
