/** @jsx jsx */
import { h, Fragment } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';
import SwiperCore, { Pagination, Navigation, A11y } from 'swiper/core';
import { SwiperOptions } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, StylingCSS } from '../../../types';
import { ResultLayout } from '../../Layouts/ResultLayout/ResultLayout';
import type { ResultLayoutElement, ResultLayoutFunc } from '../../Layouts/ResultLayout/ResultLayout';
import { AbstractController } from '@searchspring/snap-controller';

const CSS = {
	carouselLayout: ({ theme, vertical }: Partial<CarouselLayoutProps>) =>
		css({
			maxWidth: '100%',
			maxHeight: vertical ? '100%' : undefined,
			margin: 0,
			padding: 0,
			overflow: 'hidden',

			'.swiper-notification': {
				position: 'absolute',
				left: '100000000000000px',
			},

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

export const CarouselLayout = observer((properties: CarouselLayoutProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const theme = { ...globalTheme, ...properties.theme };

	const props: CarouselLayoutProps = {
		// default props
		pagination: false,
		loop: true,
		autoAdjustSlides: true,
		// global theme
		...globalTheme?.components?.carousel,
		//props
		...properties,
		...properties.theme?.components?.carousel,
	};

	if (props.autoAdjustSlides && props.slidesPerView && props.slides.length < props.slidesPerView) {
		props.slidesPerView = props.slides.length;
		props.slidesPerGroup = props.slides.length;
		props.loop = false;
	}

	const {
		loop,
		vertical,
		onInit,
		onClick,
		disableStyles,
		style,
		modules,
		slides,
		slideLayout,
		prevButtonSelector,
		nextButtonSelector,
		className,
		controller,
		...additionalProps
	} = props;

	let pagination = props.pagination;

	const swiperModulesUnfiltered = modules ? [Navigation, Pagination, A11y].concat(modules!) : [Navigation, Pagination, A11y];
	//remove any duplicates, in case user passes in Navigation or Pagination
	const swiperModules = swiperModulesUnfiltered.filter((module, pos) => swiperModulesUnfiltered.indexOf(module) === pos);

	SwiperCore.use(swiperModules);

	const styling: { css?: StylingCSS } = {};
	if (!disableStyles) {
		styling.css = [CSS.carouselLayout({ theme, vertical }), style];
	} else if (style) {
		styling.css = [style];
	}

	if (pagination) {
		if (typeof pagination == 'object') {
			pagination = {
				clickable: true,
				...pagination,
			};
		} else {
			pagination = {
				clickable: true,
			};
		}
	}

	return slides?.length ? (
		<CacheProvider>
			<div {...styling} className={classnames('ss__carousel', vertical ? 'ss__carousel-vertical' : '', className)}>
				<Swiper
					centerInsufficientSlides={true}
					onInit={(swiper) => {
						//@ts-ignore : someone should refactor this
						swiper.params.navigation.prevEl = prevButtonSelector;
						//@ts-ignore : someone should refactor this
						swiper.params.navigation.nextEl = nextButtonSelector;
						if (onInit) {
							onInit(swiper);
						}
					}}
					onClick={(swiper, e) => {
						onClick && onClick(swiper, e);
					}}
					direction={vertical ? 'vertical' : 'horizontal'}
					loop={loop}
					threshold={7}
					{...additionalProps}
					pagination={pagination}
				>
					{slides.map((slide) => {
						return (
							<SwiperSlide>
								<ResultLayout result={slide} layout={slideLayout} controller={controller} />
							</SwiperSlide>
						);
					})}
				</Swiper>
			</div>
		</CacheProvider>
	) : (
		<Fragment></Fragment>
	);
});

export type CarouselLayoutProps = {
	// TODO: tracking
	// enableTracking?: boolean;

	controller?: AbstractController;
	slides: any[];
	slideLayout: ResultLayoutElement[] | ResultLayoutFunc;
	prevButtonSelector?: string;
	nextButtonSelector?: string;
	slidesPerView?: number;
	slidesPerGroup?: number;
	spaceBetween?: number;
	loop?: boolean;
	vertical?: boolean;
	pagination?: boolean | SwiperOptions['pagination'];
	autoAdjustSlides?: boolean;
	onClick?: (swiper: SwiperCore, e: MouseEvent | TouchEvent | PointerEvent) => void;

	onInit?: (swiper: SwiperCore) => void;
	modules?: any[];
} & SwiperOptions &
	ComponentProps;
