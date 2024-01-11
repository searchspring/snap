import { h } from 'preact';

import { ArgsTable, PRIMARY_STORY, Markdown } from '@storybook/blocks';

import { RecommendationResultTracker, RecommendationResultTrackerProps } from './RecommendationResultTracker';
import { componentArgs, highlightedCode } from '../../../../utilities';
import Readme from '../ResultTracker/readme.md';
import { Snapify } from '../../../../utilities/snapify';
import type { RecommendationController } from '@searchspring/snap-controller';
import { Result } from '../../../Molecules/Result';

export default {
	title: 'Trackers/Recommendation/Result',
	component: RecommendationResultTracker,
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

const snapInstance = Snapify.recommendation({ id: 'Recommendation', tag: 'trending', globals: { siteId: '8uyt2m' } });

export const Default = (
	props: RecommendationResultTrackerProps,
	{ loaded: { controller } }: { loaded: { controller: RecommendationController } }
) => {
	return (
		<RecommendationResultTracker {...props} controller={controller} result={controller?.store?.results[0]}>
			<Result result={controller?.store?.results[0]} />
		</RecommendationResultTracker>
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
