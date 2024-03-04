/** @jsx jsx */
import { h, Fragment } from 'preact';
import { useRef, useEffect } from 'preact/hooks';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';
import deepmerge from 'deepmerge';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import { Icon, IconProps } from '../../Atoms/Icon/Icon';
import type { Swiper as SwiperTypes } from 'swiper';
import type { PaginationOptions } from 'swiper/types/modules/pagination';
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
			'.swiper': {
				display: 'flex',
				flexDirection: 'column',
				marginLeft: 'auto',
				marginRight: 'auto',
				position: 'relative',
				overflow: 'hidden',
				listStyle: 'none',
				padding: 0,
				zIndex: '1',
				width: '100%',
			},
			'.swiper-vertical > .swiper-wrapper': {
				flexDirection: 'column',
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
			'.swiper-slide-invisible-blank': {
				visibility: 'hidden',
			},
			'.swiper-horizontal': {
				touchAction: 'pan-y',
			},
			'.swiper-vertical': {
				touchAction: 'pan-x',
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
		const theme = deepmerge(props?.theme || {}, displaySettings?.theme || {}, { arrayMerge: (destinationArray, sourceArray) => sourceArray });

		if (props.autoAdjustSlides && props.children.length < displaySettings.slidesPerView!) {
			displaySettings.slidesPerView = props.children.length;
			displaySettings.slidesPerGroup = props.children.length;
		}
		props = {
			...props,
			...displaySettings,
			theme,
		};
	}

	const {
		children,
		loop,
		nextButton,
		prevButton,
		hideButtons,
		vertical,
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

	let pagination = props.pagination;

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

	const swiperModulesUnfiltered = Array.isArray(modules) ? [Navigation, Pagination, A11y].concat(modules) : [Navigation, Pagination, A11y];
	//remove any duplicates, in case user passes in Navigation or Pagination
	const swiperModules = swiperModulesUnfiltered.filter((module, pos) => swiperModulesUnfiltered.indexOf(module) === pos);

	const navigationPrevRef = useRef(null);
	const navigationNextRef = useRef(null);
	const rootComponentRef = useRef(null);

	const styling: { css?: StylingCSS } = {};
	if (!disableStyles) {
		styling.css = [CSS.carousel({ theme, vertical }), style];
	} else if (style) {
		styling.css = [style];
	}

	useEffect(() => {
		//backwards compatability for legacy styles
		const swipers = document.querySelectorAll('.swiper');
		swipers.forEach((elem: any) => {
			elem.classList.add('swiper-container', 'swiper-container-pointer-events');
		});

		const verticalSwipers = document.querySelectorAll('.swiper-vertical');
		verticalSwipers.forEach((elem: any) => {
			elem.classList.add('swiper-container-vertical');
		});

		const horizontalSwipers = document.querySelectorAll('.swiper-horizontal');
		horizontalSwipers.forEach((elem: any) => {
			elem.classList.add('swiper-container-horizontal');
		});

		const nativeArrows = document.querySelectorAll('.ss__carousel .swiper-button-prev, .ss__carousel .swiper-button-next');
		nativeArrows.forEach((elem) => {
			elem.remove();
		});

		//add usable class to last visible slide.
		attachClasstoLastVisibleSlide();
	}, []);

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

	const attachClasstoLastVisibleSlide = () => {
		if (rootComponentRef.current) {
			const swiperElem: HTMLElement = rootComponentRef.current;
			const slides_visible = swiperElem?.querySelectorAll('.swiper-slide-visible');

			slides_visible.forEach((element, idx) => {
				element.classList.remove('swiper-last-visible-slide');
				if (idx == slides_visible.length - 1) {
					element.classList.add('swiper-last-visible-slide');
				}
			});
		}
	};

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
					onBeforeInit={(swiper) => {
						//@ts-ignore : someone should refactor this
						swiper.params.navigation.prevEl = navigationPrevRef.current ? navigationPrevRef.current : undefined;
						//@ts-ignore : someone should refactor this
						swiper.params.navigation.nextEl = navigationNextRef.current ? navigationNextRef.current : undefined;
					}}
					onInit={(swiper) => {
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
					loopAddBlankSlides={false}
					modules={swiperModules}
					navigation
					{...additionalProps}
					{...displaySettings}
					pagination={pagination}
					onResize={() => {
						if (additionalProps.onResize) {
							additionalProps.onResize();
						}
						attachClasstoLastVisibleSlide();
					}}
					onTransitionEnd={() => {
						if (additionalProps.onTransitionEnd) {
							additionalProps.onTransitionEnd();
						}
						attachClasstoLastVisibleSlide();
					}}
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
	spaceBetween?: number;
	vertical?: boolean;
	pagination?: boolean | PaginationOptions;
	autoAdjustSlides?: boolean;
	onClick?: (swiper: SwiperTypes, e: MouseEvent | TouchEvent | PointerEvent) => void;
	onNextButtonClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
	onPrevButtonClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
	onInit?: (swiper: SwiperTypes) => void;
	modules?: any[];
	children: JSX.Element[];
}

interface CarouselSubProps {
	icon: IconProps;
}
