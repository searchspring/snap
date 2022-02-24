/** @jsx jsx */
import { h, Fragment } from 'preact';
import { useState, useRef } from 'preact/hooks';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';
import deepmerge from 'deepmerge';
import SwiperCore, { Pagination, Navigation } from 'swiper/core';
import 'swiper/swiper.min.css';

import { Icon, IconProps } from '../../Atoms/Icon/Icon';
import { Swiper, SwiperSlide } from 'swiper/react';
import { defined } from '../../../utilities';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, BreakpointsProps } from '../../../types';
import { useDisplaySettings } from '../../../hooks/useDisplaySettings';

const CSS = {
	carousel: ({ theme, vertical }) =>
		css({
			display: 'flex',
			maxWidth: '100%',
			maxHeight: vertical ? '100%' : null,
			margin: 0,
			padding: 0,
			overflow: 'hidden',

			'&.ss__carousel-vertical': {
				flexDirection: 'column',
				'.swiper-slide': {
					/* Center slides vertically */
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
				},

				'.swiper-container': {
					flexDirection: 'row',
				},

				'.swiper-pagination': {
					width: 'auto',
					order: 0,
					flexDirection: 'column',
					margin: 0,
					padding: '10px',
				},

				'.swiper-pagination-bullet': {
					margin: '4px',
				},
			},
			'.swiper-pagination-bullet-active': {
				background: theme?.colors?.primary || 'inherit',
			},
			'.ss__carousel__next-wrapper, .ss__carousel__prev-wrapper': {
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				'&.ss__carousel__next-wrapper--hidden, &.ss__carousel__prev-wrapper--hidden': {
					display: 'none',
				},
			},
			'.ss__carousel__next, .ss__carousel__prev': {
				padding: '5px',
				cursor: 'pointer',
				lineHeight: 0,

				'&.swiper-button-disabled': {
					opacity: '0.3',
					cursor: 'default',
				},
			},
			'.swiper-container': {
				display: 'flex',
				flexDirection: 'column',
			},
			'.swiper-wrapper': {
				order: 0,
			},
			'.swiper-pagination': {
				display: 'flex',
				justifyContent: 'center',
				marginTop: '10px',
				width: '100%',
				order: 1,
				transition: '.3s opacity',
			},
			'.swiper-pagination-bullet': {
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

export const defaultVerticalCarouselBreakpoints = {
	0: {
		slidesPerView: 1,
		slidesPerGroup: 1,
		spaceBetween: 0,
	},
};

export const Carousel = observer((properties: CarouselProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const theme = { ...globalTheme, ...properties.theme };

	let props: CarouselProps = {
		// default props
		breakpoints: properties.vertical ? defaultVerticalCarouselBreakpoints : defaultCarouselBreakpoints,
		pagination: false,
		loop: true,
		autoAdjustSlides: true,
		// global theme
		...globalTheme?.components?.carousel,
		//props
		...properties,
		...properties.theme?.components?.carousel,
	};

	const displaySettings = useDisplaySettings(props.breakpoints);
	if (displaySettings && Object.keys(displaySettings).length) {
		const theme = deepmerge(props?.theme || {}, displaySettings?.theme || {});

		if (props.autoAdjustSlides && props.children.length < displaySettings.slidesPerView) {
			displaySettings.slidesPerView = props.children.length;
			displaySettings.slidesPerGroup = props.children.length;
			displaySettings.loop = false;
		}
		props = {
			...props,
			...displaySettings,
			theme,
		};
	}

	const {
		children,
		breakpoints,
		loop,
		pagination,
		nextButton,
		prevButton,
		hideButtons,
		vertical,
		autoAdjustSlides,
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
			theme: props.theme,
		},
	};

	SwiperCore.use([Pagination, Navigation]);

	const navigationPrevRef = useRef(null);
	const navigationNextRef = useRef(null);
	const rootComponentRef = useRef(null);

	const styling: { css?: any } = {};
	if (!disableStyles) {
		styling.css = [CSS.carousel({ theme, vertical }), style];
	} else if (style) {
		styling.css = [style];
	}
	return (
		children && (
			<CacheProvider>
				<div
					ref={rootComponentRef as React.RefObject<HTMLDivElement>}
					{...styling}
					className={classnames('ss__carousel', vertical ? 'ss__carousel-vertical' : '', className)}
				>
					<div className={classnames('ss__carousel__prev-wrapper', { 'ss__carousel__prev-wrapper--hidden': hideButtons })}>
						<div
							className="ss__carousel__prev"
							ref={navigationPrevRef as React.RefObject<HTMLDivElement>}
							onClick={onPrevButtonClick && ((e) => onPrevButtonClick(e))}
						>
							{prevButton || <Icon icon={vertical ? 'angle-up' : 'angle-left'} {...subProps.icon} />}
						</div>
					</div>

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
						direction={vertical ? 'vertical' : 'horizontal'}
						loop={loop}
						pagination={
							pagination
								? {
										clickable: true,
								  }
								: false
						}
						{...additionalProps}
						{...displaySettings}
					>
						{children.map((child) => {
							return <SwiperSlide>{child}</SwiperSlide>;
						})}
					</Swiper>

					<div className={classnames('ss__carousel__next-wrapper', { 'ss__carousel__next-wrapper--hidden': hideButtons })}>
						<div
							className="ss__carousel__next"
							ref={navigationNextRef as React.RefObject<HTMLDivElement>}
							onClick={onNextButtonClick && ((e) => onNextButtonClick(e))}
						>
							{nextButton || <Icon icon={vertical ? 'angle-down' : 'angle-right'} {...subProps.icon} />}
						</div>
					</div>
				</div>
			</CacheProvider>
		)
	);
});

export interface CarouselProps extends ComponentProps {
	breakpoints?: BreakpointsProps;
	prevButton?: JSX.Element | string;
	nextButton?: JSX.Element | string;
	hideButtons?: boolean;
	loop?: boolean;
	vertical?: boolean;
	pagination?: boolean;
	autoAdjustSlides?: boolean;
	onClick?: (swiper, e) => void;
	onNextButtonClick?: (e) => void;
	onPrevButtonClick?: (e) => void;
	onInit?: (swiper) => void;
	children?: JSX.Element[];
}

interface CarouselSubProps {
	icon: IconProps;
}
