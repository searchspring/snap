/** @jsx jsx */
import { h, Fragment, ComponentChildren } from 'preact';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';
import deepmerge from 'deepmerge';

import type { RecommendationController } from '@searchspring/snap-controller';
import type { SearchResultStore, Product } from '@searchspring/snap-store-mobx';
import type { SwiperOptions } from 'swiper';

import { Carousel, CarouselProps, defaultCarouselBreakpoints, defaultVerticalCarouselBreakpoints } from '../../Molecules/Carousel';
import { Result, ResultProps } from '../../Molecules/Result';
import { defined } from '../../../utilities';
import { Theme, useTheme, CacheProvider, ThemeProvider } from '../../../providers';
import { ComponentProps, BreakpointsProps, StylingCSS } from '../../../types';
import { useDisplaySettings } from '../../../hooks/useDisplaySettings';
import { RecommendationProfileTracker } from '../../Trackers/Recommendation/ProfileTracker';
import { RecommendationResultTracker } from '../../Trackers/Recommendation/ResultTracker';
import { ResultLayout, ResultLayoutTypes } from '../../Layouts/ResultLayout';

const CSS = {
	recommendation: ({ vertical }: Partial<RecommendationProps>) =>
		css({
			height: vertical ? '100%' : undefined,
			'.ss__result__image-wrapper': {
				height: vertical ? '85%' : undefined,
			},
		}),
};

export const Recommendation = observer((properties: RecommendationProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	let props: RecommendationProps = {
		// default props
		breakpoints: properties.vertical
			? JSON.parse(JSON.stringify(defaultVerticalCarouselBreakpoints))
			: JSON.parse(JSON.stringify(defaultCarouselBreakpoints)),
		pagination: false,
		loop: true,
		// global theme
		...globalTheme?.components?.recommendation,
		...properties,
		// props
		...properties.theme?.components?.recommendation,
	};

	const displaySettings = useDisplaySettings(props.breakpoints!);
	if (displaySettings && Object.keys(displaySettings).length) {
		// merge deeply the themeDefaults with the theme props and the displaySettings theme props (do not merge arrays, but replace them)
		const theme = deepmerge(props?.theme || {}, displaySettings?.theme || {}, { arrayMerge: (destinationArray, sourceArray) => sourceArray });

		props = {
			...props,
			...displaySettings,
			theme,
		};
	}

	const {
		title,
		controller,
		children,
		breakpoints,
		loop,
		results,
		pagination,
		nextButton,
		prevButton,
		hideButtons,
		resultLayout,
		disableStyles,
		style,
		className,
		vertical,
		...additionalProps
	} = props;

	if (!controller || controller.type !== 'recommendation') {
		throw new Error(`<Recommendation> Component requires 'controller' prop with an instance of RecommendationController`);
	}

	const resultsToRender: Product[] = results || controller.store?.results;

	if (Array.isArray(children) && children.length !== resultsToRender.length) {
		controller.log.error(
			`<Recommendation> Component received invalid number of children. Must match length of 'results' prop or 'controller.store.results'`
		);
		return <Fragment></Fragment>;
	}

	const subProps: RecommendationSubProps = {
		carousel: {
			// default props
			className: 'ss__recommendation__Carousel',
			// inherited props
			...defined({
				disableStyles,
				vertical,
			}),
			// component theme overrides
			theme: props?.theme,
		},
		result: {
			// default props
			className: 'ss__recommendation__result',
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
		},
	};

	const styling: { css?: StylingCSS } = {};
	if (!disableStyles) {
		styling.css = [CSS.recommendation({ vertical }), style];
	} else if (style) {
		styling.css = [style];
	}

	return children || resultsToRender?.length ? (
		<ThemeProvider theme={properties.theme || {}}>
			<CacheProvider>
				<div {...styling} className={classnames('ss__recommendation', className)}>
					<RecommendationProfileTracker controller={controller}>
						{title && <h3 className="ss__recommendation__title">{title}</h3>}
						<Carousel
							prevButton={prevButton}
							nextButton={nextButton}
							hideButtons={hideButtons}
							loop={loop}
							pagination={pagination}
							breakpoints={breakpoints}
							{...subProps.carousel}
							{...additionalProps}
							{...displaySettings}
						>
							{Array.isArray(children) && children.length
								? children.map((child: any, idx: number) => (
										<RecommendationResultTracker controller={controller} result={resultsToRender[idx]}>
											{child}
										</RecommendationResultTracker>
								  ))
								: resultsToRender.map((result) => (
										<RecommendationResultTracker controller={controller} result={result}>
											{resultLayout && controller ? (
												<ResultLayout controller={controller} result={result} layout={resultLayout} />
											) : (
												<Result {...subProps.result} controller={controller} result={result} />
											)}
										</RecommendationResultTracker>
								  ))}
						</Carousel>
					</RecommendationProfileTracker>
				</div>
			</CacheProvider>
		</ThemeProvider>
	) : (
		<Fragment></Fragment>
	);
});

export type RecommendationProps = {
	title?: JSX.Element | string;
	breakpoints?: BreakpointsProps;
	prevButton?: JSX.Element | string;
	nextButton?: JSX.Element | string;
	hideButtons?: boolean;
	loop?: boolean;
	results?: SearchResultStore;
	pagination?: boolean;
	controller: RecommendationController;
	children?: ComponentChildren;
	vertical?: boolean;
	resultLayout?: ResultLayoutTypes;
} & Omit<SwiperOptions, 'breakpoints'> &
	ComponentProps;

interface RecommendationSubProps {
	result: Partial<ResultProps>;
	carousel: Partial<CarouselProps>;
}
