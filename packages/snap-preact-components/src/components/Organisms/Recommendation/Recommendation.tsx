/** @jsx jsx */
import { h } from 'preact';
import { useRef } from 'preact/hooks';
import SwiperCore, { Pagination, Navigation } from 'swiper/core';
import 'swiper/swiper.min.css';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import type { SearchController, AutocompleteController, RecommendationController } from '@searchspring/snap-controller';

import { Icon } from '../../Atoms/Icon/Icon';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Result, ResultProps } from '../../Molecules/Result';
import { defined } from '../../../utilities';
import { Theme, useTheme } from '../../../providers/theme';
import { ComponentProps, Result as ResultType } from '../../../types';
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
				'& .ss__icon': {
					fill: theme?.colors?.primary || 'inherit',
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

export const defaultRecommendationResponsive = {
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
		breakpoints: defaultRecommendationResponsive,
		results: [],
		nextButton: <Icon icon="angle-right" />,
		prevButton: <Icon icon="angle-left" />,
		pagination: false,
		loop: true,
		// global theme
		...globalTheme?.components?.recommendation,
		// props
		...properties,
		...properties.theme?.components?.recommendation,
	};

	const {
		title,
		controller,
		children,
		results,
		breakpoints,
		loop,
		pagination,
		nextButton,
		prevButton,
		disableStyles,
		style,
		className,
		additionalProps,
	} = props;

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

	SwiperCore.use([Pagination, Navigation]);

	const navigationPrevRef = useRef(null);
	const navigationNextRef = useRef(null);
	const rootComponentRef = useRef(null);

	const inViewport = useIntersection(rootComponentRef, '0px', true);
	if (inViewport) {
		(controller as RecommendationController)?.track?.impression();
	}
	(controller as RecommendationController)?.track?.render();

	return (
		(children || results?.length) && (
			<div
				ref={rootComponentRef}
				css={!disableStyles && CSS.recommendation({ theme, style })}
				className={classnames('ss__recommendation', className)}
			>
				{title && <h3 className="ss__recommendation__title">{title}</h3>}
				<div className="ss__recommendation__prev" ref={navigationPrevRef}>
					{prevButton}
				</div>
				<div className="ss__recommendation__next" ref={navigationNextRef}>
					{nextButton}
				</div>
				<Swiper
					centerInsufficientSlides={true}
					onInit={(swiper) => {
						//@ts-ignore
						swiper.params.navigation.prevEl = navigationPrevRef.current ? navigationPrevRef.current : undefined;
						//@ts-ignore
						swiper.params.navigation.nextEl = navigationNextRef.current ? navigationNextRef.current : undefined;
					}}
					loop={loop}
					breakpoints={breakpoints}
					pagination={
						pagination
							? {
									clickable: true,
							  }
							: false
					}
					{...additionalProps}
				>
					{children
						? children.map((child) => <SwiperSlide>{child}</SwiperSlide>)
						: results.map((result) => (
								<SwiperSlide>
									<Result controller={controller} result={result} {...subProps.result} />
								</SwiperSlide>
						  ))}
				</Swiper>
			</div>
		)
	);
});

export interface RecommendationProps extends ComponentProps {
	title?: JSX.Element | string;
	results?: ResultType[];
	breakpoints?: any;
	prevButton?: JSX.Element | string;
	nextButton?: JSX.Element | string;
	loop?: boolean;
	pagination?: boolean;
	controller?: SearchController | AutocompleteController | RecommendationController;
	children?: JSX.Element[];
}

interface RecommendationSubProps {
	result: ResultProps;
}
