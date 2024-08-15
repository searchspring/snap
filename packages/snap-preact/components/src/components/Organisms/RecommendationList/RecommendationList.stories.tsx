import { h } from 'preact';

import { ArgsTable, PRIMARY_STORY, Markdown } from '@storybook/blocks';

import { RecommendationList, RecommendationListProps } from './RecommendationList';
import { componentArgs, highlightedCode } from '../../../utilities';
import { Snapify } from '../../../utilities/snapify';

import Readme from './readme.md';
import type { RecommendationController } from '@searchspring/snap-controller';

export default {
	title: 'Organisms/RecommendationList',
	component: RecommendationList,
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
			description: 'Controller reference',
			table: {
				type: {
					summary: 'Controller',
				},
			},
			type: { required: true },
			control: { type: 'none' },
		},
		title: {
			description: 'Recommendation title',
			table: {
				type: {
					summary: 'string | JSX Element',
				},
				defaultValue: { summary: '' },
			},
			control: { type: 'text' },
		},
		results: {
			description: 'Results store reference',
			type: { required: false },
			table: {
				type: {
					summary: 'Results store object',
				},
			},
			control: { type: 'none' },
		},
		columns: {
			defaultValue: 4,
			description: 'Number of columns in results grid',
			table: {
				type: {
					summary: 'number',
				},
				defaultValue: { summary: 4 },
			},
			control: { type: 'number' },
		},
		rows: {
			description: 'Number of rows in results grid - adding this will put a hard limit on the results',
			table: {
				type: {
					summary: 'number',
				},
			},
			control: { type: 'number' },
		},
		gapSize: {
			defaultValue: '20px',
			description: 'Gap size between rows and columns',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: '20px' },
			},
			control: { type: 'text' },
		},
		breakpoints: {
			defaultValue: { summary: 'Breakpoint object' },
			description: 'Breakpoints options object',
			table: {
				type: {
					summary: 'object',
				},
			},
			control: { type: 'none' },
		},

		...componentArgs,
	},
};

const snapInstance = Snapify.recommendation({ id: 'RecommendationList', tag: 'trending', globals: { siteId: '8uyt2m' } });

export const Grid = (args: RecommendationListProps, { loaded: { controller } }: { loaded: { controller: RecommendationController } }) => {
	return <RecommendationList {...args} controller={controller} results={controller?.store?.results} columns={2} rows={4} />;
};

Grid.loaders = [
	async () => {
		await snapInstance.search();
		return {
			controller: snapInstance,
		};
	},
];

export const List = (args: RecommendationListProps, { loaded: { controller } }: { loaded: { controller: RecommendationController } }) => {
	return <RecommendationList {...args} controller={controller} results={controller?.store?.results} rows={1} />;
};

List.loaders = [
	async () => {
		await snapInstance.search();
		return {
			controller: snapInstance,
		};
	},
];
