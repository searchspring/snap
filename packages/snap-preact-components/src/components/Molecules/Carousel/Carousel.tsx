/** @jsx jsx */
import { h, Fragment } from 'preact';
import { useState, useRef } from 'preact/hooks';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';
import deepmerge from 'deepmerge';
import SwiperCore, { Pagination, Navigation } from 'swiper/core';

import { Icon, IconProps } from '../../Atoms/Icon/Icon';
import { Swiper, SwiperSlide } from 'swiper/react';
import { defined } from '../../../utilities';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, BreakpointsProps, StylingCSS } from '../../../types';
import { useDisplaySettings } from '../../../hooks/useDisplaySettings';

const CSS = {
	carousel: ({ theme, vertical }: Partial<CarouselProps>) =>
		css({
			display: 'flex',
			maxWidth: '100%',
			maxHeight: vertical ? '100%' : undefined,
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
				marginLeft: 'auto',
				marginRight: 'auto',
				position: 'relative',
				overflow: 'hidden',
				listStyle: 'none',
				padding: 0,
				zIndex: '1',
			},
			'.swiper-container-vertical': {
				'.swiper-wrapper': {
					flexDirection: 'column',
				},
			},
			'.swiper-wrapper': {
				order: 0,
				position: 'relative',
				width: '100%',
				height: '100%',
				zIndex: '1',
				display: 'flex',
				transitionProperty: 'transform',
				boxSizing: 'content-box',
			},
			'.swiper-slide': {
				flexShrink: 0,
				width: '100%',
				height: '100%',
				position: 'relative',
				transitionProperty: 'transform',
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
			'.swiper-container-pointer-events': {
				touchAction: 'pan-y',
				'&.swiper-container-vertical': {
					touchAction: 'pan-x',
				},
			},
			'.swiper-slide-invisible-blank': {
				visibility: 'hidden',
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
		breakpoints: properties.vertical
			? JSON.parse(JSON.stringify(defaultVerticalCarouselBreakpoints))
			: JSON.parse(JSON.stringify(defaultCarouselBreakpoints)),
		pagination: false,
		loop: true,
		autoAdjustSlides: true,
		// global theme
		...globalTheme?.components?.carousel,
		//props
		...properties,
		...properties.theme?.components?.carousel,
	};

	const displaySettings = useDisplaySettings(props.breakpoints!);
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
		modules,
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
	const swiperModules = modules ? [Navigation, Pagination].concat(modules!) : [Navigation, Pagination];

	SwiperCore.use(swiperModules);

	const navigationPrevRef = useRef(null);
	const navigationNextRef = useRef(null);
	const rootComponentRef = useRef(null);

	const styling: { css?: StylingCSS } = {};
	if (!disableStyles) {
		styling.css = [CSS.carousel({ theme, vertical }), style];
	} else if (style) {
		styling.css = [style];
	}
	return children?.length ? (
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
					threshold={7}
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
	) : (
		<Fragment></Fragment>
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
	onClick?: (swiper: SwiperCore, e: MouseEvent | TouchEvent | PointerEvent) => void;
	onNextButtonClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
	onPrevButtonClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
	onInit?: (swiper: SwiperCore) => void;
	modules?: any[];
	children: JSX.Element[];
}

interface CarouselSubProps {
	icon: IconProps;
}
