import { h, Fragment, ComponentChildren } from 'preact';
import { useRef, useEffect } from 'preact/hooks';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react';
import deepmerge from 'deepmerge';
import { Swiper, SwiperSlide } from 'swiper/react';
import { defined, mergeProps } from '../../../utilities';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import { Icon, IconProps } from '../../Atoms/Icon/Icon';
import type { Swiper as SwiperTypes } from 'swiper';
import type { SwiperOptions } from 'swiper/types';
import type { PaginationOptions } from 'swiper/types/modules/pagination';
import type { NavigationOptions } from 'swiper/types/modules/navigation';

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
				background: theme?.variables?.color?.primary || 'inherit',
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
					background: theme?.variables?.color?.primary || '#000',
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
	const defaultProps: Partial<CarouselProps> = {
		breakpoints: properties.vertical
			? JSON.parse(JSON.stringify(defaultVerticalCarouselBreakpoints))
			: JSON.parse(JSON.stringify(defaultCarouselBreakpoints)),
		pagination: false,
		loop: true,
		autoAdjustSlides: false,
		// global theme
		...globalTheme?.components?.carousel,
		//props
		...properties,
		...properties.theme?.components?.carousel,
	};

	let props = mergeProps('carousel', globalTheme, defaultProps, properties);
	Object.keys(props.breakpoints!).forEach((breakpoint) => {
		const breakPointProps = props.breakpoints![breakpoint as keyof typeof props.breakpoints];
		// make certain props numbers
		if (breakPointProps.slidesPerView) breakPointProps.slidesPerView = Number(breakPointProps.slidesPerView) || 1;
		if (breakPointProps.slidesPerGroup) breakPointProps.slidesPerGroup = Number(breakPointProps.slidesPerGroup) || 1;
	});

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
		onBeforeInit,
		onAfterInit,
		onNextButtonClick,
		onPrevButtonClick,
		onClick,
		disableStyles,
		style,
		styleScript,
		modules,
		className,
		...additionalProps
	} = props;

	let pagination = props.pagination;
	let navigation = props.navigation;

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
	const stylingProps = props;

	if (styleScript && !disableStyles) {
		styling.css = [styleScript(stylingProps), style];
	} else if (!disableStyles) {
		styling.css = [CSS.carousel(stylingProps), style];
	} else if (style) {
		styling.css = [style];
	}

	useEffect(() => {
		//backwards compatability for legacy styles
		if (rootComponentRef.current) {
			const rootElem: HTMLElement = rootComponentRef.current;
			const swiperElem = rootElem.querySelector('.swiper');
			swiperElem?.classList.add('swiper-container', 'swiper-container-pointer-events');

			swiperElem?.classList.contains('swiper-vertical') && swiperElem.classList.add('swiper-container-vertical');
			swiperElem?.classList.contains('swiper-horizontal') && swiperElem.classList.add('swiper-container-horizontal');
		}

		//add usable class to last visible slide.
		attachClasstoLastVisibleSlide();
	}, [properties]);

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

	if (navigation && typeof navigation == 'object') {
		navigation = {
			nextEl: '.ss_carousel_DNE',
			prevEl: '.ss_carousel_DNE',
			...navigation,
		};
	} else {
		navigation = {
			nextEl: '.ss_carousel_DNE',
			prevEl: '.ss_carousel_DNE',
		};
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
						{prevButton || <Icon icon={vertical ? 'angle-up' : 'angle-left'} {...subProps.icon} name={'previousButton'} />}
					</div>
				</div>

				<Swiper
					centerInsufficientSlides={true}
					onBeforeInit={(swiper) => {
						//@ts-ignore : someone should refactor this
						swiper.params.navigation.prevEl = navigationPrevRef.current ? navigationPrevRef.current : undefined;
						//@ts-ignore : someone should refactor this
						swiper.params.navigation.nextEl = navigationNextRef.current ? navigationNextRef.current : undefined;

						if (onBeforeInit) {
							onBeforeInit(swiper);
						}
					}}
					onInit={(swiper) => {
						if (onInit) {
							onInit(swiper);
						}
					}}
					onAfterInit={(swiper) => {
						//@ts-ignore : someone should refactor this
						swiper.navigation.onPrevClick = (e: any) => {
							e.preventDefault();
							if (swiper.isBeginning && !swiper.params.loop && !swiper.params.rewind) return;
							swiper.slidePrev();
							swiper.emit('navigationPrev');
						};

						//@ts-ignore : someone should refactor this
						swiper.navigation.onNextClick = (e: any) => {
							e.preventDefault();
							if (swiper.isEnd && !swiper.params.loop && !swiper.params.rewind) return;
							swiper.slideNext();
							swiper.emit('navigationNext');
						};

						if (onAfterInit) {
							onAfterInit(swiper);
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
					{...additionalProps}
					{...displaySettings}
					controller={undefined} // prevent passing controller in additionalProps (causes unnecessary swiper updates and errors)
					navigation={navigation}
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
					{children.map((child: ComponentChildren) => {
						return <SwiperSlide>{child}</SwiperSlide>;
					})}
				</Swiper>

				<div className={classnames('ss__carousel__next-wrapper', { 'ss__carousel__next-wrapper--hidden': hideButtons })}>
					<div
						className="ss__carousel__next"
						ref={navigationNextRef as React.RefObject<HTMLDivElement>}
						onClick={onNextButtonClick && ((e) => onNextButtonClick(e))}
					>
						{nextButton || <Icon icon={vertical ? 'angle-down' : 'angle-right'} {...subProps.icon} name={'nextButton'} />}
					</div>
				</div>
			</div>
		</CacheProvider>
	) : (
		<Fragment></Fragment>
	);
});

export type CarouselProps = {
	breakpoints?: BreakpointsProps;
	prevButton?: JSX.Element | string;
	nextButton?: JSX.Element | string;
	hideButtons?: boolean;
	loop?: boolean;
	vertical?: boolean;
	pagination?: boolean | PaginationOptions;
	navigation?: boolean | NavigationOptions;
	autoAdjustSlides?: boolean;
	onClick?: (swiper: SwiperTypes, e: MouseEvent | TouchEvent | PointerEvent) => void;
	onNextButtonClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
	onPrevButtonClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
	onBeforeInit?: (swiper: SwiperTypes) => void;
	onInit?: (swiper: SwiperTypes) => void;
	onAfterInit?: (swiper: SwiperTypes) => void;
	modules?: any[];
	children: JSX.Element[];
	onResize?: () => void;
	onTransitionEnd?: () => void;
} & Omit<SwiperOptions, 'breakpoints'> &
	ComponentProps;

interface CarouselSubProps {
	icon: IconProps;
}
