import { h } from 'preact';

import { ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs/blocks';

import { RecommendationProfileTracker, RecommendationProfileTrackerProps } from './RecommendationProfileTracker';
import { componentArgs } from '../../../utilities';
import Readme from '../RecommendationProfileTracker/readme.md';
import { Snapify } from '../../../utilities/snapify';
import type { RecommendationController } from '@searchspring/snap-controller';
import { Carousel } from '../../Molecules/Carousel';
import { Result } from '../../Molecules/Result';
export default {
	title: `Atoms/RecommendationProfileTracker`,
	component: RecommendationProfileTracker,
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
		results: {
			description: 'Results store reference, overrides controller.store.results',
			type: { required: false },
			table: {
				type: {
					summary: 'Results store object',
				},
			},
			control: { type: 'none' },
		},

		...componentArgs,
	},
};

const snapInstance = Snapify.recommendation({ id: 'Recommendation', tag: 'trending', globals: { siteId: '8uyt2m' } });

export const Default = (
	props: RecommendationProfileTrackerProps,
	{ loaded: { controller } }: { loaded: { controller: RecommendationController } }
) => {
	return (
		<RecommendationProfileTracker {...props} controller={controller}>
			<h2>Recommended for You</h2>
			<Carousel>
				{controller.store.results.map((result: any, idx: number) => {
					return <Result result={result} key={idx} />;
				})}
			</Carousel>
		</RecommendationProfileTracker>
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
