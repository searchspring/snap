import { h } from 'preact';

import { ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs/blocks';

import { BreadcrumbProps, Breadcrumbs } from './Breadcrumbs';
import { componentArgs } from '../../../utilities';
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

export const categoryPage = (args: BreadcrumbProps) => <Breadcrumbs {...args} />;
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

export const SearchPage = (args: BreadcrumbProps) => <Breadcrumbs {...args} />;
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
