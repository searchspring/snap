/** @jsx jsx */
import { h, Fragment } from 'preact';
import { useState, useRef } from 'preact/hooks';
import SwiperCore, { Pagination, Navigation } from 'swiper/core';
import 'swiper/swiper.min.css';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';
import { Icon, IconProps } from '../../Atoms/Icon/Icon';
import { Swiper, SwiperSlide } from 'swiper/react';
import { defined } from '../../../utilities';
import { Theme, useTheme } from '../../../providers/theme';
import { ComponentProps } from '../../../types';

const CSS = {
	carousel: ({ theme, style }) =>
		css({
			position: 'relative',
			padding: '0 20px',
			overflow: 'hidden',
			'& .swiper-pagination-bullet-active': {
				background: theme?.colors?.primary || 'inherit',
			},
			'& .ss__carousel__next, .ss__carousel__prev': {
				position: 'absolute',
				padding: '5px',
				bottom: 'calc(50% - 18px)',
				zIndex: '2',
				cursor: 'pointer',

				'&.swiper-button-disabled': {
					opacity: '0.3',
					cursor: 'default',
				},
			},
			'& .ss__carousel__next': {
				right: '0',
			},
			'& .ss__carousel__prev': {
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

export const defaultCarouselResponsive = {
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

export const Carousel = observer((properties: CarouselProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const theme = { ...globalTheme, ...properties.theme };

	const props: CarouselProps = {
		// default props
		breakpoints: defaultCarouselResponsive,
		pagination: false,
		loop: true,
		// global theme
		...properties,
		...properties.theme?.components?.carousel,
	};

	const {
		children,
		breakpoints,
		loop,
		pagination,
		nextButton,
		prevButton,
		onNextButtonClick,
		onPrevButtonClick,
		onCarouselClick,
		onBreakpoint,
		onSlideChange,
		onInit,
		disableStyles,
		style,
		className,
	} = props;

	const subProps: CarouselSubProps = {
		icon: {
			// default props
			className: 'ss__carousel__icon',
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

	SwiperCore.use([Pagination, Navigation]);

	const navigationPrevRef = useRef(null);
	const navigationNextRef = useRef(null);
	const rootComponentRef = useRef(null);
	return (
		children && (
			<div
				ref={rootComponentRef as React.RefObject<HTMLDivElement>}
				css={!disableStyles && CSS.carousel({ theme, style })}
				className={classnames('ss__carousel', className)}
			>
				<div
					className="ss__carousel__prev"
					ref={navigationPrevRef as React.RefObject<HTMLDivElement>}
					onClick={onPrevButtonClick && ((e) => onPrevButtonClick(e))}
				>
					{prevButton || <Icon icon="angle-left" {...subProps.icon} />}
				</div>
				<div
					className="ss__carousel__next"
					ref={navigationNextRef as React.RefObject<HTMLDivElement>}
					onClick={onNextButtonClick && ((e) => onNextButtonClick(e))}
				>
					{nextButton || <Icon icon="angle-right" {...subProps.icon} />}
				</div>
				<Swiper
					centerInsufficientSlides={true}
					onInit={(swiper) => {
						//@ts-ignore
						swiper.params.navigation.prevEl = navigationPrevRef.current ? navigationPrevRef.current : undefined;
						//@ts-ignore
						swiper.params.navigation.nextEl = navigationNextRef.current ? navigationNextRef.current : undefined;
						//@ts-ignore
						if (onInit) {
							//@ts-ignore
							onInit(swiper.realIndex, swiper.loopedSlides);
						}
					}}
					onBreakpoint={
						onBreakpoint &&
						((swiper) => {
							//@ts-ignore
							onBreakpoint(swiper.realIndex, swiper.loopedSlides);
						})
					}
					onSlideChange={
						onSlideChange &&
						((swiper) => {
							//@ts-ignore
							onSlideChange(swiper.realIndex, swiper.loopedSlides);
						})
					}
					onClick={
						onCarouselClick &&
						((swiper, e) => {
							const clickedIndex = swiper.realIndex + (swiper.clickedIndex - swiper.activeIndex);
							if (!Number.isNaN(clickedIndex)) {
								onCarouselClick(e, clickedIndex);
							}
						})
					}
					loop={loop}
					breakpoints={breakpoints}
					pagination={
						pagination
							? {
									clickable: true,
							  }
							: false
					}
				>
					{children.map((child) => {
						return <SwiperSlide>{child}</SwiperSlide>;
					})}
				</Swiper>
			</div>
		)
	);
});

export interface CarouselProps extends ComponentProps {
	breakpoints?: any;
	prevButton?: JSX.Element | string;
	nextButton?: JSX.Element | string;
	loop?: boolean;
	pagination?: boolean;
	onNextButtonClick?: (e) => void;
	onPrevButtonClick?: (e) => void;
	onCarouselClick?: (e, idx) => void;
	onSlideChange?: (idx, loopedSlides) => void;
	onBreakpoint?: (idx, loopedSlides) => void;
	onInit?: (idx, loopedSlides) => void;
	children?: JSX.Element[];
}

interface CarouselSubProps {
	icon: IconProps;
}
