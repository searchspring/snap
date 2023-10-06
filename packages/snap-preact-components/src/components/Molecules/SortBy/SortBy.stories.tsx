import { h } from 'preact';
import { observer } from 'mobx-react';

import { ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs/blocks';

import { SortBy, SortByProps } from './SortBy';
import { componentArgs } from '../../../utilities';
import { Snapify } from '../../../utilities/snapify';
import Readme from '../SortBy/readme.md';
import type { SearchController } from '@searchspring/snap-controller';

export default {
	title: `Molecules/SortBy`,
	component: SortBy,
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
		type: {
			description: 'type of Select to render.',
			table: {
				type: {
					summary: '"Dropdown" | "List" | "Radio"',
				},
				defaultValue: { summary: 'Dropdown' },
			},
			control: { type: 'text' },
		},
		...componentArgs,
	},
};

const snapInstance = Snapify.search({ id: 'Select', globals: { siteId: '8uyt2m' } });

const ObservableSortBy = observer(({ args, controller }: { args: SortByProps; controller: SearchController }) => {
	return <SortBy {...args} sorting={controller?.store?.sorting} />;
});

export const Default = (args: SortByProps, { loaded: { controller } }: { loaded: { controller: SearchController } }) => {
	return <ObservableSortBy args={args} controller={controller} />;
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
	return <ObservableSortBy args={args} controller={controller} />;
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
	label: 'Sort By',
	type: 'List',
};

export const Radio = (args: SortByProps, { loaded: { controller } }: { loaded: { controller: SearchController } }) => {
	return <ObservableSortBy args={args} controller={controller} />;
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
	type: 'Radio',
};
