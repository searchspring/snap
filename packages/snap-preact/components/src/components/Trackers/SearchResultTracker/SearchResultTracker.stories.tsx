import { h } from 'preact';

import { ArgsTable, PRIMARY_STORY, Markdown } from '@storybook/blocks';

import { SearchResultTracker, SearchResultTrackerProps } from './SearchResultTracker';
import { componentArgs, highlightedCode } from '../../../utilities';
import Readme from './readme.md';
import { Snapify } from '../../../utilities/snapify';
import { Result } from '../../Molecules/Result';
import type { SearchController } from '@searchspring/snap-controller';
import type { Product } from '@searchspring/snap-store-mobx';

export default {
	title: 'Trackers/Search/Result',
	component: SearchResultTracker,
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
			<div style={{ maxWidth: '250px' }}>
				<Story />
			</div>
		),
	],
	argTypes: {
		controller: {
			description: 'Recommendation Controller reference',
			type: { required: true },
			table: {
				type: {
					summary: 'Controller',
				},
			},
			control: { type: 'none' },
		},
		result: {
			description: 'Result store Product reference',
			type: { required: true },
			table: {
				type: {
					summary: 'result store Product object',
				},
			},
			control: { type: 'none' },
		},

		...componentArgs,
	},
};

const snapInstance = Snapify.search({ id: 'SearchResultTracker', globals: { siteId: '8uyt2m', search: { query: { string: '*' } } } });

export const Default = (props: SearchResultTrackerProps, { loaded: { controller } }: { loaded: { controller: SearchController } }) => {
	const result = controller?.store?.results[0] as Product;
	return (
		<SearchResultTracker {...props} controller={controller} result={result}>
			<Result result={result} />
		</SearchResultTracker>
	);
};

Default.loaders = [
	async () => {
		await snapInstance.search();
		return {
			controller: snapInstance,
		};
	},
];
