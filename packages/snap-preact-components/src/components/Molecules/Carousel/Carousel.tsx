/** @jsx jsx */
import { h, Fragment } from 'preact';
import { useState, useRef } from 'preact/hooks';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';
import SwiperCore, { Pagination, Navigation } from 'swiper/core';
import 'swiper/swiper.min.css';

import { Icon, IconProps } from '../../Atoms/Icon/Icon';
import { Swiper, SwiperSlide } from 'swiper/react';
import { defined } from '../../../utilities';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps } from '../../../types';

const CSS = {
	carousel: ({ theme }) =>
		css({
			display: 'flex',
			maxWidth: '100%',
			margin: 0,
			padding: 0,
			overflow: 'hidden',
			'& .swiper-pagination-bullet-active': {
				background: theme?.colors?.primary || 'inherit',
			},
			'& .ss__carousel__next-wrapper, .ss__carousel__prev-wrapper': {
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
			},
			'& .ss__carousel__next, .ss__carousel__prev': {
				padding: '5px',
				cursor: 'pointer',

				'&.swiper-button-disabled': {
					opacity: '0.3',
					cursor: 'default',
				},
			},
			'& .swiper-container': {
				display: 'flex',
				flexDirection: 'column',
			},
			'& .swiper-wrapper': {
				order: 0,
			},
			'& .swiper-pagination': {
				marginTop: '10px',
				width: '100%',
				order: 1,
				textAlign: 'center',
				transition: '.3s opacity',
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
		}),
};

export const defaultCarouselBreakpoints = {
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
		breakpoints: defaultCarouselBreakpoints,
		pagination: false,
		loop: true,
		// global theme
		...globalTheme?.components?.carousel,
		//props
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
		hideButtons,
		onInit,
		onNextButtonClick,
		onPrevButtonClick,
		onClick,
		disableStyles,
		style,
		className,
		...additionalProps
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
			<CacheProvider>
				<div
					ref={rootComponentRef as React.RefObject<HTMLDivElement>}
					css={!disableStyles ? [CSS.carousel({ theme }), style] : [style]}
					className={classnames('ss__carousel', className)}
				>
					{!hideButtons && (
						<div className="ss__carousel__prev-wrapper">
							<div
								className="ss__carousel__prev"
								ref={navigationPrevRef as React.RefObject<HTMLDivElement>}
								onClick={onPrevButtonClick && ((e) => onPrevButtonClick(e))}
							>
								{prevButton || <Icon icon="angle-left" {...subProps.icon} />}
							</div>
						</div>
					)}

					<Swiper
						centerInsufficientSlides={true}
						onInit={(swiper) => {
							//@ts-ignore
							swiper.params.navigation.prevEl = navigationPrevRef.current ? navigationPrevRef.current : undefined;
							//@ts-ignore
							swiper.params.navigation.nextEl = navigationNextRef.current ? navigationNextRef.current : undefined;
							if (onInit) {
								onInit(swiper);
							}
						}}
						onClick={(swiper, e) => {
							onClick && onClick(swiper, e);
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
						{children.map((child) => {
							return <SwiperSlide>{child}</SwiperSlide>;
						})}
					</Swiper>

					{!hideButtons && (
						<div className="ss__carousel__next-wrapper">
							<div
								className="ss__carousel__next"
								ref={navigationNextRef as React.RefObject<HTMLDivElement>}
								onClick={onNextButtonClick && ((e) => onNextButtonClick(e))}
							>
								{nextButton || <Icon icon="angle-right" {...subProps.icon} />}
							</div>
						</div>
					)}
				</div>
			</CacheProvider>
		)
	);
});

export interface CarouselProps extends ComponentProps {
	breakpoints?: any;
	prevButton?: JSX.Element | string;
	nextButton?: JSX.Element | string;
	hideButtons?: boolean;
	loop?: boolean;
	pagination?: boolean;
	onClick?: (swiper, e) => void;
	onNextButtonClick?: (e) => void;
	onPrevButtonClick?: (e) => void;
	onInit?: (swiper) => void;
	children?: JSX.Element[];
}

interface CarouselSubProps {
	icon: IconProps;
}
