import { h } from 'preact';

import { ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs/blocks';

import { ResultLayout } from './ResultLayout';
import { componentArgs } from '../../../utilities';
import { Snapify } from '../../../utilities/snapify';

// import Readme from './readme.md';
import type { SearchController } from '@searchspring/snap-controller';

export default {
	title: `Organisms/ResultLayout`,
	component: ResultLayout,
	parameters: {
		docs: {
			page: () => (
				<div>
					{/* <Readme /> */}
					<ArgsTable story={PRIMARY_STORY} />
				</div>
			),
		},
	},
	decorators: [
		(Story: any) => (
			<div
				style={{
					maxWidth: '900px',
				}}
			>
				<Story />
			</div>
		),
	],
	argTypes: {
		controller: {
			type: { required: true },
			table: {
				type: {
					summary: 'Autocomplete | Search | Recommendation controller object',
				},
			},
			control: { type: 'none' },
		},
		result: {
			type: { required: true },
			description: 'Single Product from the Results store reference',
			table: {
				type: {
					summary: 'Product object',
				},
			},
			control: { type: 'none' },
		},
		layout: {
			type: { required: true },
			description: 'Results layout descriptor object or function',
			table: {
				type: {
					summary: 'LayoutElem, LayoutElem[], LayoutElemFunc',
				},
			},
			control: {
				type: 'object',
			},
		},

		...componentArgs,
	},
};

const snapInstance = Snapify.search({ id: 'Results', globals: { siteId: '8uyt2m' } });

export const Grid = (args: any, { loaded: { controller } }: { loaded: { controller: SearchController } }) => {
	return <ResultLayout {...args} controller={controller} result={controller?.store?.results[0]} />;
};

Grid.args = {
	layout: {
		component: 'Button',
		props: {
			content: 'click me',
		},
	},
};

Grid.loaders = [
	async () => {
		await snapInstance.search();
		return {
			controller: snapInstance,
		};
	},
];
