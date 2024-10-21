import { h } from 'preact';

import { ArgsTable, PRIMARY_STORY, Markdown } from '@storybook/blocks';

import { SortBy, SortByProps } from './SortBy';
import { componentArgs, highlightedCode } from '../../../utilities';
import { Snapify } from '../../../utilities/snapify';
import Readme from '../SortBy/readme.md';
import type { SearchController } from '@searchspring/snap-controller';
export default {
	title: 'Molecules/SortBy',
	component: SortBy,
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
		sorting: {
			description: 'reference to the SearchSortingStore',
			type: { required: true },
			table: {
				type: {
					summary: 'reference to the SearchSortingStore',
				},
			},
			control: { type: 'none' },
		},
		controller: {
			description: 'reference to the Search Controller',
			table: {
				type: {
					summary: 'reference to the Search Controller',
				},
			},
			control: { type: 'none' },
		},
		label: {
			description: 'Header label text to render.',
			table: {
				type: {
					summary: 'string',
				},
			},
			control: { type: 'text' },
		},
		hideLabel: {
			description: 'hide header label',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		type: {
			description: 'type of Select to render.',
			table: {
				type: {
					summary: '"dropdown" | "list" | "radio"',
				},
				defaultValue: { summary: 'dropdown' },
			},
			options: ['dropdown', 'list', 'radio'],
			control: {
				type: 'select',
			},
		},
		...componentArgs,
	},
};

const snapInstance = Snapify.search({ id: 'SortBy', globals: { siteId: '8uyt2m' } });

export const Default = (args: SortByProps, { loaded: { controller } }: { loaded: { controller: SearchController } }) => {
	return <SortBy {...args} sorting={controller?.store?.sorting} />;
};

Default.loaders = [
	async () => {
		await snapInstance.search();
		return {
			controller: snapInstance,
		};
	},
];
Default.args = {
	label: 'Sort By',
};

export const List = (args: SortByProps, { loaded: { controller } }: { loaded: { controller: SearchController } }) => {
	return <SortBy {...args} sorting={controller?.store?.sorting} />;
};

List.loaders = [
	async () => {
		await snapInstance.search();
		return {
			controller: snapInstance,
		};
	},
];
List.args = {
	label: '',
	type: 'list',
};

export const Radio = (args: SortByProps, { loaded: { controller } }: { loaded: { controller: SearchController } }) => {
	return <SortBy {...args} sorting={controller?.store?.sorting} />;
};

Radio.loaders = [
	async () => {
		await snapInstance.search();
		return {
			controller: snapInstance,
		};
	},
];
Radio.args = {
	label: 'Sort By',
	type: 'radio',
};
