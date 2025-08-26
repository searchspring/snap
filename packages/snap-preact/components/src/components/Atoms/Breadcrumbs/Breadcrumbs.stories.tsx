import { h } from 'preact';

import { ArgsTable, PRIMARY_STORY, Markdown } from '@storybook/blocks';

import { BreadcrumbsProps, Breadcrumbs } from './Breadcrumbs';
import { componentArgs, highlightedCode } from '../../../utilities';
import Readme from '../Breadcrumbs/readme.md';
import { iconPaths } from '../Icon';

export default {
	title: 'Atoms/Breadcrumbs',
	component: Breadcrumbs,
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
	argTypes: {
		data: {
			description: 'Breadcrumb data object',
			table: {
				type: {
					summary: 'object | function',
				},
			},
			control: { type: 'object' },
		},
		separator: {
			description: 'Breadcrumb delimiter',
			table: {
				type: {
					summary: 'string, JSX, or false',
				},
				defaultValue: { summary: '>' },
			},
			control: { type: 'text' },
		},
		separatorIcon: {
			description: 'Separator Icon name',
			table: {
				type: {
					summary: 'string',
				},
			},
			options: [...Object.keys(iconPaths)],
			control: {
				type: 'select',
			},
		},
		...componentArgs,
	},
};

export const categoryPage = (args: BreadcrumbsProps) => <Breadcrumbs {...args} />;
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

export const SearchPage = (args: BreadcrumbsProps) => <Breadcrumbs {...args} />;
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
