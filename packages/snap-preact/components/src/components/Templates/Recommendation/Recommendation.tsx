import { h, Fragment, ComponentChildren } from 'preact';
import { useState, useRef } from 'preact/hooks';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react';
import deepmerge from 'deepmerge';

import type { SwiperOptions } from 'swiper/types';

import type { RecommendationController } from '@searchspring/snap-controller';
import type { Product } from '@searchspring/snap-store-mobx';

import { Carousel, CarouselProps, defaultCarouselBreakpoints, defaultVerticalCarouselBreakpoints } from '../../Molecules/Carousel';
import { Result, ResultProps } from '../../Molecules/Result';
import { defined, mergeProps } from '../../../utilities';
import { useIntersection } from '../../../hooks';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, BreakpointsProps, RootNodeProperties, ResultComponent } from '../../../types';
import { useDisplaySettings } from '../../../hooks/useDisplaySettings';
import { RecommendationProfileTracker } from '../../Trackers/Recommendation/ProfileTracker';
import { RecommendationResultTracker } from '../../Trackers/Recommendation/ResultTracker';
import { Lang, useLang } from '../../../hooks';

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

	const defaultProps: Partial<RecommendationProps> = {
		breakpoints: properties.vertical
			? JSON.parse(JSON.stringify(defaultVerticalCarouselBreakpoints))
			: JSON.parse(JSON.stringify(defaultCarouselBreakpoints)),
		pagination: false,
		loop: true,
	};

	let props = mergeProps('recommendation', globalTheme, defaultProps, properties);
	let displaySettings;

	if (!properties.theme?.name && props.breakpoints) {
		// breakpoint settings are calculated in ThemeStore for snap templates

		displaySettings = useDisplaySettings(props.breakpoints);
		if (displaySettings && Object.keys(displaySettings).length) {
			// merge deeply the themeDefaults with the theme props and the displaySettings theme props (do not merge arrays, but replace them)

			props = {
				...props,
				...displaySettings,
			};
		}
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
		resultComponent,
		disableStyles,
		style,
		className,
		styleScript,
		lazyRender,
		vertical,
		treePath,
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
			// inherited props
			...defined({
				disableStyles,
				vertical,
			}),
			// component theme overrides
			theme: props?.theme,
			treePath,
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
			treePath,
		},
	};

	const styling: RootNodeProperties = { 'ss-name': props.name };
	const stylingProps = props;

	if (styleScript && !disableStyles) {
		styling.css = [styleScript(stylingProps), style];
	} else if (!disableStyles) {
		styling.css = [CSS.recommendation(stylingProps), style];
	} else if (style) {
		styling.css = [style];
	}

	const [isVisible, setIsVisible] = useState(false);

	const recsRef = useRef(null);
	const inView = mergedlazyRender?.enabled ? useIntersection(recsRef, `${mergedlazyRender.offset} 0px ${mergedlazyRender.offset} 0px`, true) : true;
	if (inView) {
		setIsVisible(true);
	}

	//initialize lang
	const defaultLang: Partial<RecommendationLang> = {
		titleText: {
			value: `${title}`,
		},
	};

	//deep merge with props.lang
	const lang = deepmerge(defaultLang, props.lang || {});
	const mergedLang = useLang(lang as any, {});

	return (Array.isArray(children) && children.length) || resultsToRender?.length ? (
		<CacheProvider>
			<div {...styling} className={classnames('ss__recommendation', className)} ref={recsRef}>
				{isVisible ? (
					<RecommendationProfileTracker controller={controller}>
						{title && (
							<h3 className="ss__recommendation__title" {...mergedLang.titleText?.all}>
								{title}
							</h3>
						)}
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
											{(() => {
												if (resultComponent && controller) {
													const ResultComponent = resultComponent;
													return <ResultComponent controller={controller} result={result} />;
												} else {
													return <Result key={result.id} {...subProps.result} controller={controller} result={result} />;
												}
											})()}
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
		<></>
	);
});

export type RecommendationProps = {
	controller: RecommendationController;
	title?: JSX.Element | string;
	breakpoints?: BreakpointsProps;
	prevButton?: JSX.Element | string;
	nextButton?: JSX.Element | string;
	hideButtons?: boolean;
	loop?: boolean;
	results?: Product[];
	pagination?: boolean;
	children?: ComponentChildren;
	vertical?: boolean;
	resultComponent?: ResultComponent;
	lang?: Partial<RecommendationLang>;
	lazyRender?: {
		enabled: boolean;
		offset?: string;
	};
} & Omit<SwiperOptions, 'breakpoints'> &
	ComponentProps;

export interface RecommendationLang {
	titleText?: Lang<{
		controller: RecommendationController;
	}>;
}
interface RecommendationSubProps {
	result: Partial<ResultProps>;
	carousel: Partial<CarouselProps>;
}
