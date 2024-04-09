import { h, Fragment, ComponentChildren } from 'preact';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react';

import type { SwiperOptions } from 'swiper/types';

import type { RecommendationController } from '@searchspring/snap-controller';
import type { Product } from '@searchspring/snap-store-mobx';

import { Carousel, CarouselProps, defaultCarouselBreakpoints, defaultVerticalCarouselBreakpoints } from '../../Molecules/Carousel';
import { Result, ResultProps } from '../../Molecules/Result';
import { defined, mergeProps } from '../../../utilities';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, BreakpointsProps, StylingCSS, ResultComponent } from '../../../types';
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
	const stylingProps = props;

	if (styleScript && !disableStyles) {
		styling.css = [styleScript(stylingProps), style];
	} else if (!disableStyles) {
		styling.css = [CSS.recommendation(stylingProps), style];
	} else if (style) {
		styling.css = [style];
	}

	return children || resultsToRender?.length ? (
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
			</div>
		</CacheProvider>
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
	results?: Product[];
	pagination?: boolean;
	controller: RecommendationController;
	children?: ComponentChildren;
	vertical?: boolean;
	resultComponent?: ResultComponent;
} & Omit<SwiperOptions, 'breakpoints'> &
	ComponentProps;

interface RecommendationSubProps {
	result: Partial<ResultProps>;
	carousel: Partial<CarouselProps>;
}
