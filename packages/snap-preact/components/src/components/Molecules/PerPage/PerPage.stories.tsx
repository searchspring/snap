import { h } from 'preact';

import { ArgsTable, PRIMARY_STORY, Markdown } from '@storybook/blocks';

import { componentArgs, highlightedCode } from '../../../utilities';
import { Snapify } from '../../../utilities/snapify';
import Readme from '../PerPage/readme.md';
import type { SearchController } from '@searchspring/snap-controller';
import { PerPage, PerPageProps } from './PerPage';

export default {
	title: 'Molecules/PerPage',
	component: PerPage,
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
		pagination: {
			description: 'reference to the SearchPaginationStore',
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

const snapInstance = Snapify.search({ id: 'PerPage', globals: { siteId: '8uyt2m' } });

export const Default = (args: PerPageProps, { loaded: { controller } }: { loaded: { controller: SearchController } }) => {
	return <PerPage {...args} pagination={controller?.store?.pagination} />;
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
	label: 'Per Page',
};

const snapInstanceList = Snapify.search({
	id: 'PerPage-list',
	globals: { siteId: '8uyt2m' },
	settings: {
		pagination: {
			pageSizeOptions: [
				{ label: '24', value: 12 },
				{ label: '48', value: 24 },
				{ label: '72', value: 48 },
			],
		},
	},
});

export const List = (args: PerPageProps, { loaded: { controller } }: { loaded: { controller: SearchController } }) => {
	return <PerPage {...args} pagination={controller?.store?.pagination} />;
};

List.loaders = [
	async () => {
		await snapInstanceList.search();
		return {
			controller: snapInstanceList,
		};
	},
];
List.args = {
	label: '',
	type: 'list',
};

export const Radio = (args: PerPageProps, { loaded: { controller } }: { loaded: { controller: SearchController } }) => {
	return <PerPage {...args} pagination={controller?.store?.pagination} />;
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
	label: 'Per Page',
	type: 'radio',
};
