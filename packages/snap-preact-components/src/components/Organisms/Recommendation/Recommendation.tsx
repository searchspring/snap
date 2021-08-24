/** @jsx jsx */
import { h, Fragment } from 'preact';
import { useState, useRef } from 'preact/hooks';
import SwiperCore, { Pagination, Navigation } from 'swiper/core';
import 'swiper/swiper.min.css';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import type { RecommendationController } from '@searchspring/snap-controller';

import { Carousel, CarouselProps } from '../Carousel';
import { Icon, IconProps } from '../../Atoms/Icon/Icon';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Result, ResultProps } from '../../Molecules/Result';
import { defined } from '../../../utilities';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps } from '../../../types';
import { useIntersection } from '../../../hooks';

const CSS = {
	recommendation: ({ theme, style }) =>
		css({
			position: 'relative',
			padding: '0 20px',
			overflow: 'hidden',
			'& .swiper-pagination-bullet-active': {
				background: theme?.colors?.primary || 'inherit',
			},
			'& .ss__recommendation__title': {
				textAlign: 'center',
			},
			'& .ss__recommendation__next, .ss__recommendation__prev': {
				position: 'absolute',
				padding: '5px',
				bottom: 'calc(50% - 60px/2)',
				zIndex: '2',
				cursor: 'pointer',

				'&.swiper-button-disabled': {
					opacity: '0.3',
					cursor: 'default',
				},
			},
			'& .ss__recommendation__next': {
				right: '0',
			},
			'& .ss__recommendation__prev': {
				left: '0',
			},
			'& .swiper-pagination': {
				margin: '0',
				position: 'absolute',
				textAlign: 'center',
				transition: '.3s opacity',
				transform: 'translate3d(0, 0, 0)',
				zIndex: '10',
			},
			'& .swiper-container-horizontal>.swiper-pagination-bullets,.swiper-pagination-custom, .swiper-pagination-fraction': {
				bottom: '10px',
				left: '0',
				width: '100%',
			},
			'& .swiper-pagination-bullet': {
				width: '8px',
				height: '8px',
				display: 'inline-block',
				borderRadius: '50%',
				background: '#000',
				opacity: '.2',
				cursor: 'pointer',
				margin: '0 4px',
				'&.swiper-pagination-bullet-active': {
					opacity: '0.8',
					background: theme?.colors?.primary || '#000',
				},
			},
			...style,
		}),
};

export const defaultRecommendationBreakpoints = {
	0: {
		slidesPerView: 1,
		slidesPerGroup: 1,
		spaceBetween: 0,
	},
	480: {
		slidesPerView: 2,
		slidesPerGroup: 2,
		spaceBetween: 10,
	},
	768: {
		slidesPerView: 3,
		slidesPerGroup: 3,
		spaceBetween: 10,
	},
	1024: {
		slidesPerView: 4,
		slidesPerGroup: 4,
		spaceBetween: 10,
	},
	1200: {
		slidesPerView: 5,
		slidesPerGroup: 5,
		spaceBetween: 10,
	},
};

export const Recommendation = observer((properties: RecommendationProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const theme = { ...globalTheme, ...properties.theme };

	const props: RecommendationProps = {
		// default props
		breakpoints: defaultRecommendationBreakpoints,
		pagination: false,
		loop: true,
		// global theme
		...properties,
		...properties.theme?.components?.recommendation,
	};

	const { title, controller, children, breakpoints, loop, pagination, nextButton, prevButton, disableStyles, style, className, ...additionalProps } =
		props;

	if (!controller || controller.type !== 'recommendation') {
		throw new Error(`<Recommendation> Component requires 'controller' prop with an instance of RecommendationController`);
	}

	if (children && children.length !== controller.store.results.length) {
		controller.log.error(`<Recommendation> Component received invalid number of children`);
		return;
	}

	const results = controller.store?.results;

	const subProps: RecommendationSubProps = {
		carousel: {
			// default props
			className: 'ss__recommendation__Carousel',
			// global theme
			...globalTheme?.components?.carousel,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			...props.theme?.components?.carousel,
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
			...props.theme?.components?.result,
		},
		icon: {
			// default props
			className: 'ss__recommendation__icon',
			// global theme
			...globalTheme?.components?.icon,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			...theme?.components?.icon,
		},
	};

	const rootComponentRef = useRef(null);

	const [initialIndexes, setInitialIndexes] = useState([0, 0]);
	const inViewport = useIntersection(rootComponentRef, '0px', true);

	const sendProductImpression = (index, count) => {
		if (!inViewport) return;

		let resultLoopCount = [index, index + count];
		let resultLoopOverCount;
		if (index + count > results.length - 1) {
			resultLoopCount = [index];
			resultLoopOverCount = [0, index + count - results.length];
		}
		let resultsImpressions = results.slice(...resultLoopCount);
		if (resultLoopOverCount) {
			resultsImpressions = resultsImpressions.concat(results.slice(...resultLoopOverCount));
		}

		resultsImpressions.map((result) => {
			controller.track.product.impression(result);
		});
	};

	if (inViewport) {
		controller.track.impression();
		sendProductImpression(initialIndexes[0], initialIndexes[1]);
	}

	(children || results.length) && (controller as RecommendationController)?.track?.render();

	return (
		(children || results?.length) && (
			<CacheProvider>
				<div
					ref={rootComponentRef as React.RefObject<HTMLDivElement>}
					css={!disableStyles && CSS.recommendation({ theme, style })}
					className={classnames('ss__recommendation', className)}
				>
					{title && <h3 className="ss__recommendation__title">{title}</h3>}
					<Carousel
						onNextButtonClick={(e) => controller.track.click(e)}
						onPrevButtonClick={(e) => controller.track.click(e)}
						onBreakpoint={(realIndex, loopedSlides) => sendProductImpression(realIndex, loopedSlides)}
						onSlideChange={(realIndex, loopedSlides) => sendProductImpression(realIndex, loopedSlides)}
						onCarouselClick={(e, clickedIndex) => {
							controller.track.click(e);
							controller.track.product.click(e, results[clickedIndex]);
						}}
						onInit={(realIndex, loopedSlides) => setInitialIndexes([realIndex, loopedSlides])}
						loop={loop}
						breakpoints={breakpoints}
						pagination={pagination}
						{...subProps.carousel}
						{...additionalProps}
					>
						{children
							? children.map((child) => child)
							: results.map((result) => <Result controller={controller} result={result} {...subProps.result} />)}
					</Carousel>
				</div>
			</CacheProvider>
		)
	);
});

export interface RecommendationProps extends ComponentProps {
	title?: JSX.Element | string;
	breakpoints?: any;
	prevButton?: JSX.Element | string;
	nextButton?: JSX.Element | string;
	loop?: boolean;
	pagination?: boolean;
	controller: RecommendationController;
	children?: JSX.Element[];
}

interface RecommendationSubProps {
	result: ResultProps;
	carousel: CarouselProps;
	icon: IconProps;
}
