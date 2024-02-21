/** @jsx jsx */
import { h, Fragment } from 'preact';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { useRef } from 'preact/hooks';
import { observer } from 'mobx-react-lite';
import deepmerge from 'deepmerge';
import { Carousel, CarouselProps as _CarouselProps } from '../../Molecules/Carousel';
import { Result, ResultProps } from '../../Molecules/Result';
import { cloneWithProps, defined } from '../../../utilities';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, BreakpointsProps, StylingCSS } from '../../../types';
import { useDisplaySettings } from '../../../hooks/useDisplaySettings';
import { RecommendationProfileTracker } from '../../Trackers/Recommendation/ProfileTracker';
import { RecommendationResultTracker } from '../../Trackers/Recommendation/ResultTracker';
import { IconProps } from '../../Atoms/Icon';
import type { RecommendationController } from '@searchspring/snap-controller';
import type { Product } from '@searchspring/snap-store-mobx';
import { BundleSelector } from './BundleSelector';
import { BundledCTA } from './BundleCTA';
import { useEffect } from 'react';

const CSS = {
	bundledRecommendations: ({ slidesPerView, ctaInline, vertical, peekaboo, seperatorIcon }: any) =>
		css({
			'.ss__bundled-recommendations__wrapper': {
				display: 'flex',
				maxWidth: '100%',
				margin: '0',
				padding: '0',
			},

			'.ss__bundled-recommendations__wrapper__selector--seed': {
				width: `${vertical ? '100%' : 'auto'}`,
				margin: `${!seperatorIcon ? 'auto !important' : 'initial'}`,
			},

			'.ss__bundled-recommendations__wrapper__seed-container': {
				width: `calc(100% / ${slidesPerView + peekaboo + (!ctaInline ? 0 : 1)})`,
			},

			'.ss__bundled-recommendations__wrapper__cta': {
				width: `${!ctaInline ? '100%' : `calc(100% / ${slidesPerView + peekaboo + 1})`}`,

				textAlign: 'center',

				'& .ss__bundled-recommendations__wrapper__cta__subtotal__prices': {
					display: 'block',
				},
			},

			'.ss__bundled-recommendations__wrapper__carousel': {
				width: `calc(calc(100% / ${slidesPerView + peekaboo + (!ctaInline ? 0 : 1)}) * ${slidesPerView + peekaboo - 1})`,
				padding: '0px 15px',
			},

			'.ss__bundled-recommendations__wrapper--seed-in-carousel': {
				'.ss__bundled-recommendations__wrapper__cta': {
					width: `calc(100% / ${slidesPerView + peekaboo + (!ctaInline ? 0 : 1)})`,
				},

				'.ss__bundled-recommendations__wrapper__carousel': {
					width: `calc(calc(100% / ${slidesPerView + peekaboo + (!ctaInline ? 0 : 1)}) * ${slidesPerView + peekaboo})`,
					padding: '0',
				},
			},

			'.swiper-slide, .swiper-slide-visible.swiper-last-visible-slide': {
				'.ss__bundled-recommendations__wrapper__selector__icon': {
					display: 'none',
				},
			},

			'.swiper-slide-visible': {
				'.ss__bundled-recommendations__wrapper__selector__icon': {
					display: 'block',
				},
			},

			'.ss__bundled-recommendations__wrapper--vertical': {
				flexDirection: 'column',
			},

			'.ss__bundled-recommendations__wrapper__selector': {
				alignItems: 'baseline',
				position: 'relative',

				'& .ss__bundled-recommendations__wrapper__selector__result-wrapper__seed-badge': {
					position: 'absolute',
					top: '0',
					left: '0',
					zIndex: '1',
				},

				'& .ss__bundled-recommendations__wrapper__selector__icon': {
					position: 'absolute',
					right: '-1em',
					top: '140px',
				},

				'& .ss__bundled-recommendations__wrapper__selector__result-wrapper': {
					alignItems: 'center',
					position: 'relative',
					margin: '0px 15px',
				},
				'& .ss__bundled-recommendations__wrapper__selector__result-wrapper__checkbox': {
					position: 'absolute',
					top: '0',
					right: '0',
					zIndex: '1',
					cursor: 'pointer',
				},
			},
		}),
};

export const BundledRecommendation = observer((properties: BundledRecommendationProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const defaultCarouselBreakpoints = {
		0: {
			slidesPerView: 2,
			slidesPerGroup: 2,
			spaceBetween: 10,
			ctaInline: false,
		},
		768: {
			slidesPerView: 3,
			slidesPerGroup: 3,
			spaceBetween: 10,
		},
		1200: {
			slidesPerView: 4,
			slidesPerGroup: 4,
			spaceBetween: 10,
		},
	};

	let props: BundledRecommendationProps = {
		// default props
		breakpoints: JSON.parse(JSON.stringify(defaultCarouselBreakpoints)),
		showCheckboxes: true,
		seperatorIcon: 'plus-thin',
		seedText: 'This Product',
		seedSeparatorIconOnly: true,
		ctaIcon: true,
		addToCartButtonText: 'Add All To Cart',
		ctaInline: true,
		// global theme
		...globalTheme?.components?.bundledRecommendation,
		...properties,
		// props
		...properties.theme?.components?.bundledRecommendation,
	};

	const displaySettings = useDisplaySettings(props.breakpoints!);
	if (displaySettings && Object.keys(displaySettings).length) {
		const theme = deepmerge(props?.theme || {}, displaySettings?.theme || {}, { arrayMerge: (destinationArray, sourceArray) => sourceArray });
		props = {
			...props,
			...displaySettings,
			theme,
		};
	}

	const {
		title,
		controller,
		breakpoints,
		results,
		carousel,
		preselectedCount,
		seperatorIcon,
		showCheckboxes,
		limit,
		seedText,
		vertical,
		onAddToCart,
		seedSeparatorIconOnly,
		resultComponent,
		ctaSlot,
		addToCartButtonText,
		disableStyles,
		ctaIcon,
		ctaInline,
		style,
		className,
		...additionalProps
	} = props;

	const mergedCarouselProps = {
		enabled: true,
		loop: false,
		...carousel,
	};
	const { seedInCarousel, prevButton, nextButton, hideButtons, loop, pagination } = mergedCarouselProps;

	let peekaboo = 0;
	if (mergedCarouselProps.peekaboo) {
		if (typeof mergedCarouselProps.peekaboo == 'boolean' || mergedCarouselProps.peekaboo >= 1 || mergedCarouselProps.peekaboo <= 0) {
			// default
			peekaboo = 0.5;
		} else {
			peekaboo = mergedCarouselProps.peekaboo;
		}
	}

	const carouselEnabled = mergedCarouselProps.enabled;

	if (!controller || controller.type !== 'recommendation') {
		throw new Error(`<BundleRecommendation> Component requires 'controller' prop with an instance of RecommendationController`);
	}

	let resultsToRender: Product[] = results || controller.store?.results;

	if (limit) {
		resultsToRender = resultsToRender.slice(0, limit);
	}

	const cartStore = controller.store.cart;

	if (!cartStore) {
		throw new Error(`<BundleRecommendation> Component requires 'cartStore' to exist in the recommendation store`);
	}

	const seed = results ? results[0] : controller.store?.results[0];

	const subProps: BundleRecommendationSubProps = {
		carousel: {
			loop: loop,
			// default props
			className: 'ss__recommendation__carousel',
			// global theme
			...globalTheme?.components?.carousel,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
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
			theme: props?.theme,
		},
	};

	let slidesPerView = props.slidesPerView;
	if (resultsToRender.length < slidesPerView) {
		slidesPerView = resultsToRender.length;
	}

	const styling: { css?: StylingCSS } = {};
	if (!disableStyles) {
		styling.css = [CSS.bundledRecommendations({ slidesPerView, ctaInline, vertical, peekaboo, seperatorIcon }), style];
	} else if (style) {
		styling.css = [style];
	}

	const _preSelectedCount = typeof preselectedCount == 'number' ? preselectedCount : carouselEnabled ? slidesPerView : resultsToRender.length;

	//this resets the selected items if the results to render changes
	// so you dont end up with something selected that is no longer rendered
	useEffect(() => {
		cartStore.reset();

		if (_preSelectedCount) {
			resultsToRender?.forEach((result, idx) => {
				if (idx < _preSelectedCount) {
					cartStore.addItems([result]);
				}
			});
		}
	}, [resultsToRender.length]);

	const selectedItems = cartStore.items;

	const modifiedBreakpoints: BreakpointsProps = { ...breakpoints };

	if (carouselEnabled) {
		Object.keys(props.breakpoints!).forEach((breakpoint: any) => {
			const obj = props.breakpoints![breakpoint];

			let newSlidesPerView = obj.slidesPerView;
			let newSlidesPerGroup = obj.slidesPerGroup;

			const resultCount = seedInCarousel ? resultsToRender.length : resultsToRender.length - 1;

			if (resultCount) {
				if (resultCount >= obj.slidesPerView + peekaboo) {
					newSlidesPerView = obj.slidesPerView! - (!seedInCarousel ? 1 : 0) + peekaboo;
					if (!seedInCarousel) {
						newSlidesPerGroup = obj.slidesPerGroup! - 1;
					}
				} else {
					(newSlidesPerView = resultCount), (newSlidesPerGroup = resultCount);
				}
			}

			modifiedBreakpoints[breakpoint] = {
				...modifiedBreakpoints[breakpoint],
				slidesPerView: newSlidesPerView,
				slidesPerGroup: newSlidesPerGroup,
			};
		});
	}

	const onProductSelect = (product: Product) => {
		if (product) {
			const idx = selectedItems.findIndex((result) => result.id == product.id);
			//is it in the selected items?
			if (idx > -1) {
				//already selected, deselect it now
				cartStore.removeItems([product]);

				if (cartStore.items.length == 0) {
					//we dont call addItems here to prevent tracking
					cartStore.items.push(seed);
				}
			} else {
				//add it to the list;
				cartStore.addItems([product]);
			}
		}
	};

	const addToCart = (e: any) => {
		// add to cart tracking
		controller.track.addBundle(e, selectedItems);

		//call the function passed
		onAddToCart && onAddToCart(selectedItems);
	};

	const setSeedwidth = () => {
		if (seedRef.current) {
			// @ts-ignore - todo can this be typed appropriatly?
			const seedElem: HTMLElement = seedRef.current?.base;
			// @ts-ignore - todo can this be typed appropriatly?
			const carouselElem: HTMLElement = carouselRef.current?.base;

			const visibleSlide = carouselElem?.querySelector('.swiper-slide-visible .ss__bundled-recommendations__wrapper__selector') as HTMLElement;
			const width = visibleSlide?.offsetWidth;

			if (seedElem) {
				seedElem.style.width = `${width}px`;
			}
		}
	};

	const seedRef = useRef();
	const carouselRef = useRef();

	return resultsToRender?.length ? (
		<CacheProvider>
			<div {...styling} className={classnames('ss__bundled-recommendations', { 'ss__bundled-recommendations--stacked': !ctaInline }, className)}>
				<RecommendationProfileTracker controller={controller}>
					{title && (
						<h3 className="ss__bundled-recommendations__title">
							<span>{title}</span>
						</h3>
					)}

					<div
						className={classnames('ss__bundled-recommendations__wrapper', {
							'ss__bundled-recommendations__wrapper--seed-in-carousel': seedInCarousel,
							'ss__bundled-recommendations__wrapper--vertical': vertical,
						})}
					>
						{carouselEnabled ? (
							<Fragment>
								{!seedInCarousel && (
									<div className="ss__bundled-recommendations__wrapper__seed-container">
										<BundleSelector
											seedText={seedText}
											seed={true}
											onCheck={() => onProductSelect(seed)}
											checked={selectedItems.findIndex((item) => item.id == seed.id) > -1}
											icon={seperatorIcon}
											showCheckboxes={showCheckboxes}
											theme={props.theme}
											ref={seedRef}
										>
											<RecommendationResultTracker controller={controller} result={seed}>
												{resultComponent ? (
													cloneWithProps(resultComponent, {
														result: seed,
														seed: true,
														selected: selectedItems.findIndex((item) => item.id == seed.id) > -1,
														onProductSelect,
													})
												) : (
													<Result {...subProps.result} controller={controller} result={seed} />
												)}
											</RecommendationResultTracker>
										</BundleSelector>
									</div>
								)}
								<div className="ss__bundled-recommendations__wrapper__carousel">
									<Carousel
										prevButton={prevButton}
										nextButton={nextButton}
										hideButtons={hideButtons}
										loop={loop}
										pagination={pagination}
										breakpoints={modifiedBreakpoints}
										watchSlidesProgress={true}
										observer={true}
										vertical={vertical}
										onResize={() => setSeedwidth()}
										{...subProps.carousel}
										{...additionalProps}
										{...displaySettings}
										ref={carouselRef}
									>
										{resultsToRender.map((result, idx) => {
											const selected = selectedItems.findIndex((item) => item.id == result.id) > -1;

											if (idx == 0 && seedInCarousel) {
												return (
													<BundleSelector
														seedText={seedText}
														seed={true}
														icon={seperatorIcon}
														onCheck={() => onProductSelect(result)}
														checked={selected}
														showCheckboxes={showCheckboxes}
														theme={props.theme}
													>
														<RecommendationResultTracker controller={controller} result={result}>
															{resultComponent ? (
																cloneWithProps(resultComponent, { result: result, seed: true, selected, onProductSelect })
															) : (
																<Result {...subProps.result} controller={controller} result={result} />
															)}
														</RecommendationResultTracker>
													</BundleSelector>
												);
											} else if (idx == 0 && !seedInCarousel) {
												return <></>;
											} else {
												return (
													<BundleSelector
														icon={seedSeparatorIconOnly ? false : seperatorIcon}
														onCheck={() => onProductSelect(result)}
														checked={selected}
														showCheckboxes={showCheckboxes}
														theme={props.theme}
													>
														<RecommendationResultTracker controller={controller} result={result}>
															{resultComponent ? (
																cloneWithProps(resultComponent, { result: result, seed: false, selected, onProductSelect })
															) : (
																<Result {...subProps.result} controller={controller} result={result} />
															)}
														</RecommendationResultTracker>
													</BundleSelector>
												);
											}
										})}
									</Carousel>
								</div>
							</Fragment>
						) : (
							resultsToRender.map((result, idx) => {
								const selected = selectedItems.findIndex((item) => item.id == result.id) > -1;

								if (idx == 0 && seedInCarousel) {
									return (
										<BundleSelector
											seedText={seedText}
											seed={true}
											icon={seperatorIcon}
											onCheck={() => onProductSelect(result)}
											checked={selected}
											showCheckboxes={showCheckboxes}
											theme={props.theme}
										>
											<RecommendationResultTracker controller={controller} result={result}>
												{resultComponent ? (
													cloneWithProps(resultComponent, { result: result, seed: true, selected, onProductSelect })
												) : (
													<Result {...subProps.result} controller={controller} result={result} />
												)}
											</RecommendationResultTracker>
										</BundleSelector>
									);
								} else {
									return (
										<BundleSelector
											icon={seedSeparatorIconOnly ? false : seperatorIcon}
											onCheck={() => onProductSelect(result)}
											checked={selected}
											showCheckboxes={showCheckboxes}
											theme={props.theme}
										>
											<RecommendationResultTracker controller={controller} result={result}>
												{resultComponent ? (
													cloneWithProps(resultComponent, { result: result, seed: false, selected, onProductSelect })
												) : (
													<Result {...subProps.result} controller={controller} result={result} />
												)}
											</RecommendationResultTracker>
										</BundleSelector>
									);
								}
							})
						)}

						{ctaInline && (
							<BundledCTA
								ctaSlot={ctaSlot}
								cartStore={cartStore}
								onAddToCartClick={(e: any) => addToCart(e)}
								addToCartText={addToCartButtonText}
								icon={ctaIcon}
							/>
						)}
					</div>
					{!ctaInline && (
						<BundledCTA
							ctaSlot={ctaSlot}
							cartStore={cartStore}
							onAddToCartClick={(e: any) => addToCart(e)}
							addToCartText={addToCartButtonText}
							icon={ctaIcon}
						/>
					)}
				</RecommendationProfileTracker>
			</div>
		</CacheProvider>
	) : (
		<Fragment></Fragment>
	);
	return <></>;
});

interface CarouselProps {
	enabled?: boolean;
	peekaboo?: boolean | 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9;
	seedInCarousel?: boolean;
	prevButton?: JSX.Element | string;
	nextButton?: JSX.Element | string;
	hideButtons?: boolean;
	loop?: boolean;
	pagination?: boolean;
}

export interface BundledRecommendationProps extends ComponentProps {
	results?: Product[];
	limit?: number;
	controller: RecommendationController;
	onAddToCart: (items: Product[]) => void;
	addToCartButtonText?: string;
	title?: JSX.Element | string;
	breakpoints?: BreakpointsProps;
	resultComponent?: JSX.Element;
	preselectedCount?: number;
	showCheckboxes?: boolean;
	seedText?: string;
	seedSeparatorIconOnly?: boolean;
	seperatorIcon?: string | Partial<IconProps> | boolean;
	ctaInline?: boolean;
	ctaIcon?: string | Partial<IconProps> | boolean;
	ctaSlot?: JSX.Element;
	vertical?: boolean;
	carousel?: CarouselProps;
}

interface BundleRecommendationSubProps {
	result: Partial<ResultProps>;
	carousel: Partial<_CarouselProps>;
}
