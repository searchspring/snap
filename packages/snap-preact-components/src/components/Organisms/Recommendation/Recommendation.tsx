/** @jsx jsx */
import { h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';
import Carousel, { Dots, slidesToShowPlugin } from '@brainhubeu/react-carousel';
import '@brainhubeu/react-carousel/lib/style.css';

import type { SearchController, AutocompleteController, RecommendationController } from '@searchspring/snap-controller';

import { Result, ResultProps } from '../../Molecules/Result';
import { defined } from '../../../utilities';
import { Theme, useTheme } from '../../../providers/theme';
import { ComponentProps, Result as ResultType } from '../../../types';

const CSS = {
	filterSummary: ({ style }) =>
		css({
			...style,
		}),
};

export const Recommendation = observer((properties: RecommendationProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const props: RecommendationProps = {
		// default props
		title: 'Product Recommendations',
		results: [],
		// global theme
		...globalTheme?.components?.recommendation,
		// props
		...properties,
		...properties.theme?.components?.recommendation,
	};

	const { title, controller, results, disableStyles } = props;

	const subProps: RecommendationSubProps = {
		result: {
			// default props
			className: 'ss__recommendation__result',
			// global theme
			...globalTheme?.components?.result,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			...props.theme?.components?.result,
		},
	};

	console.log('getting results?', results);

	return (
		results?.length && (
			<div>
				<h1>{title}</h1>
				<Carousel
					plugins={[
						'infinite',
						'arrows',
						{
							resolve: slidesToShowPlugin,
							options: {
								numberOfSlides: 3,
							},
						},
					]}
				>
					{results.slice(0, 6).map((result) => (
						<Result controller={controller} result={result} />
					))}
				</Carousel>
			</div>
		)
	);
});

export interface RecommendationProps extends ComponentProps {
	title?: string;
	results: ResultType[];
	controller?: SearchController | AutocompleteController | RecommendationController;
}

interface RecommendationSubProps {
	result: ResultProps;
}
