import { h } from 'preact';

import { ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs/blocks';

import { ResultTracker, ResultTrackerProps } from './ResultTracker';
import { componentArgs } from '../../../utilities';
import Readme from './readme.md';
import { Snapify } from '../../../utilities/snapify';
import type { RecommendationController } from '@searchspring/snap-controller';
import { Result } from '../../Molecules/Result';

export default {
	title: `Trackers/Result`,
	component: ResultTracker,
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

export const Default = (props: ResultTrackerProps, { loaded: { controller } }: { loaded: { controller: RecommendationController } }) => {
	return (
		<ResultTracker {...props} controller={controller} result={controller?.store?.results[0]}>
			<Result result={controller?.store?.results[0]} />
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
