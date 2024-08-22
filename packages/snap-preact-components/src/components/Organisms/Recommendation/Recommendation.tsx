/** @jsx jsx */
import { h, Fragment, ComponentChildren } from 'preact';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react';
import deepmerge from 'deepmerge';
import { useState, useRef } from 'preact/hooks';
import type { RecommendationController } from '@searchspring/snap-controller';
import type { Product } from '@searchspring/snap-store-mobx';

import { Carousel, CarouselProps, defaultCarouselBreakpoints, defaultVerticalCarouselBreakpoints } from '../../Molecules/Carousel';
import { Result, ResultProps } from '../../Molecules/Result';
import { defined } from '../../../utilities';
import { useIntersection } from '../../../hooks';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, BreakpointsProps, StylingCSS } from '../../../types';
import { useDisplaySettings } from '../../../hooks/useDisplaySettings';
import { RecommendationProfileTracker } from '../../Trackers/Recommendation/ProfileTracker';
import { RecommendationResultTracker } from '../../Trackers/Recommendation/ResultTracker';

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
		disableStyles,
		style,
		className,
		lazyRender,
		vertical,
		...additionalProps
	} = props;

	const mergedlazyRender = {
		enabled: true,
		offset: '10%',
		...lazyRender,
	};

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
			// global theme
			...globalTheme?.components?.carousel,
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
			// global theme
			...globalTheme?.components?.result,
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

	const [isVisible, setIsVisible] = useState(false);

	const recsRef = useRef(null);
	const inView = mergedlazyRender?.enabled ? useIntersection(recsRef, `${mergedlazyRender.offset} 0px ${mergedlazyRender.offset} 0px`, true) : true;
	if (inView) {
		setIsVisible(true);
	}

	return children || resultsToRender?.length ? (
		<CacheProvider>
			<div {...styling} className={classnames('ss__recommendation', className)} ref={recsRef}>
				{isVisible ? (
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
											<Result {...subProps.result} controller={controller} result={result} />
										</RecommendationResultTracker>
								  ))}
						</Carousel>
					</RecommendationProfileTracker>
				) : (
					<RecommendationProfileTracker controller={controller}>
						{Array.isArray(children) && children.length
							? children.map((child: any, idx: number) => (
									<RecommendationResultTracker controller={controller} result={resultsToRender[idx]}>
										<></>
									</RecommendationResultTracker>
							  ))
							: resultsToRender.map((result) => (
									<RecommendationResultTracker controller={controller} result={result}>
										<></>
									</RecommendationResultTracker>
							  ))}
					</RecommendationProfileTracker>
				)}
			</div>
		</CacheProvider>
	) : (
		<Fragment></Fragment>
	);
});

export interface RecommendationProps extends ComponentProps {
	title?: JSX.Element | string;
	breakpoints?: BreakpointsProps;
	prevButton?: JSX.Element | string;
	nextButton?: JSX.Element | string;
	hideButtons?: boolean;
	loop?: boolean;
	results?: Product[];
	pagination?: boolean;
	controller: RecommendationController;
	children?: ComponentChildren;
	vertical?: boolean;
	lazyRender?: {
		enabled: boolean;
		offset?: string;
	};
}

interface RecommendationSubProps {
	result: ResultProps;
	carousel: CarouselProps;
}
