import { h } from 'preact';

import { Breadcrumbs } from './Breadcrumbs';
import { componentArgs } from '../../../utilities';
import { ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs/blocks';

import Readme from '../Breadcrumbs/readme.md';

export default {
	title: `Atoms/Breadcrumbs`,
	component: Breadcrumbs,
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
		data: {
			description: 'Breadcrumb data object',
			type: { required: true },
			table: {
				type: {
					summary: 'object',
				},
			},
			control: { type: 'object' },
		},
		separator: {
			defaultValue: '>',
			description: 'Breadcrumb delimiter',
			table: {
				type: {
					summary: 'string, JSX',
				},
				defaultValue: { summary: '>' },
			},
			control: { type: 'text' },
		},
		...componentArgs,
	},
};

const Template = (args) => <Breadcrumbs {...args} />;

export const categoryPage = Template.bind({});
categoryPage.args = {
	data: [
		{
			url: '/',
			label: 'Home',
		},
		{
			url: '/',
			label: 'Collections',
		},
		{
			url: '/',
			label: 'Appliances',
		},
		{
			label: 'Fridge',
		},
	],
	separator: '/',
};

export const SearchPage = Template.bind({});
SearchPage.args = {
	data: [
		{
			url: '/',
			label: 'Home',
		},
		{
			label: 'Search',
		},
	],
};
