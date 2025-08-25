import { h } from 'preact';

import { ArgsTable, PRIMARY_STORY, Markdown } from '@storybook/blocks';

import { ResultTracker, ResultTrackerProps } from './ResultTracker';
import { componentArgs, highlightedCode } from '../../../utilities';
import Readme from '../ResultTracker/readme.md';
import { Snapify } from '../../../utilities/snapify';
import type { SearchController } from '@searchspring/snap-controller';
import { Result } from '../../Molecules/Result';
import { Product } from '@searchspring/snap-store-mobx';

export default {
	title: 'Trackers/Result',
	component: ResultTracker,
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
			description: 'Controller reference',
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

export const Default = (props: ResultTrackerProps, { loaded: { controller } }: { loaded: { controller: SearchController } }) => {
	const firstResult = controller?.store?.results[0] as Product;
	return (
		<ResultTracker {...props} controller={controller} result={firstResult}>
			<Result result={firstResult} />
		</ResultTracker>
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
