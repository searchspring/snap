import { h } from 'preact';

import { ArgsTable, PRIMARY_STORY, Markdown } from '@storybook/blocks';

import { RecommendationProfileTracker, RecommendationProfileTrackerProps } from './RecommendationProfileTracker';
import { componentArgs, highlightedCode } from '../../../../utilities';
import Readme from '../ProfileTracker/readme.md';
import { Snapify } from '../../../../utilities/snapify';
import type { RecommendationController } from '@searchspring/snap-controller';
import { Carousel } from '../../../Molecules/Carousel';
import { Result } from '../../../Molecules/Result';

export default {
	title: 'Trackers/Recommendation/Profile',
	component: RecommendationProfileTracker,
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
