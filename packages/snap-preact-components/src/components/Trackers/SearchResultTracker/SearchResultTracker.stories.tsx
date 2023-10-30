import { h } from 'preact';

import { ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs/blocks';

import { SearchResultTracker, SearchResultTrackerProps } from './SearchResultTracker';
import { componentArgs } from '../../../utilities';
import Readme from './readme.md';
import { Snapify } from '../../../utilities/snapify';
import type { SearchController } from '@searchspring/snap-controller';
import { Result } from '../../Molecules/Result';

export default {
	title: `Trackers/SearchResultTracker`,
	component: SearchResultTracker,
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

const snapInstance = Snapify.search({ id: 'Tracker', globals: { siteId: '8uyt2m', search: { query: { string: '*' } } } });

export const Default = (props: SearchResultTrackerProps, { loaded: { controller } }: { loaded: { controller: SearchController } }) => {
	return (
		<SearchResultTracker {...props} controller={controller} result={controller?.store?.results[0]}>
			<Result result={controller?.store?.results[0]} />
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
