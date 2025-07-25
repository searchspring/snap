/** @jsx jsx */
import { h, Fragment } from 'preact';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { useRef, useEffect, useState } from 'preact/hooks';
import { observer } from 'mobx-react';
import deepmerge from 'deepmerge';
import { Carousel, CarouselProps as CarouselProps } from '../../Molecules/Carousel';
import { Result, ResultProps } from '../../Molecules/Result';
import { cloneWithProps, defined } from '../../../utilities';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, BreakpointsProps, StylingCSS } from '../../../types';
import { useDisplaySettings } from '../../../hooks/useDisplaySettings';
import { RecommendationProfileTracker } from '../../Trackers/Recommendation/ProfileTracker';
import { ResultTracker } from '../../Trackers/ResultTracker';
import { IconProps } from '../../Atoms/Icon';
import type { RecommendationController } from '@searchspring/snap-controller';
import type { Product } from '@searchspring/snap-store-mobx';
import { BundleSelector } from './BundleSelector';
import { BundledCTA } from './BundleCTA';
import { useIntersection } from '../../../hooks';

const CSS = {
	recommendationBundle: ({ slidesPerView, spaceBetween, ctaInline, vertical, separatorIcon }: any) =>
		css({
			'.ss__recommendation-bundle__wrapper': {
				display: 'flex',
				maxWidth: '100%',
				margin: '0',
				padding: '0',
			},

			'.ss__recommendation-bundle__wrapper__selector--seed': {
				width: `${vertical ? '100%' : 'auto'}`,
				margin: `${!separatorIcon ? 'auto !important' : 'initial'}`,
			},

			'.ss__recommendation-bundle__wrapper__seed-container': {
				width: vertical ? '100%' : `calc(100% / ${slidesPerView + (!ctaInline ? 0 : 1)})`,
			},

			'.ss__recommendation-bundle__wrapper__cta': {
				width: vertical ? '100%' : `${!ctaInline ? '100%' : `calc(100% / ${slidesPerView + 1})`}`,

				textAlign: 'center',

				'& .ss__recommendation-bundle__wrapper__cta__subtotal__prices': {
					display: 'block',
				},
			},

			'.ss__recommendation-bundle__wrapper__carousel': {
				boxSizing: 'border-box',
				width: vertical ? '100%' : `calc(calc(100% / ${slidesPerView + (!ctaInline ? 0 : 1)}) * ${slidesPerView - 1})`,
			},

			'.ss__recommendation-bundle__wrapper--seed-in-carousel': {
				'.ss__recommendation-bundle__wrapper__cta': {
					width: vertical ? '100%' : `calc(100% / ${slidesPerView + (!ctaInline ? 0 : 1)})`,
				},

				'.ss__recommendation-bundle__wrapper__carousel': {
					width: vertical ? '100%' : `calc(calc(100% / ${slidesPerView + (!ctaInline ? 0 : 1)}) * ${slidesPerView})`,
					padding: '0',
				},
			},

			'.swiper-slide, .swiper-slide-visible.swiper-last-visible-slide': {
				'.ss__recommendation-bundle__wrapper__selector__icon': {
					display: 'none',
				},
			},

			'.swiper-slide-visible': {
				'.ss__recommendation-bundle__wrapper__selector__icon': {
					display: 'block',
				},
			},

			'.ss__recommendation-bundle__wrapper--vertical': {
				flexDirection: 'column',
			},

			'.ss__recommendation-bundle__wrapper__selector': {
				alignItems: 'baseline',
				position: 'relative',

				'&.ss__recommendation-bundle__wrapper__selector--last': {
					'& .ss__recommendation-bundle__wrapper__selector__icon': {
						display: 'none',
					},
				},

				'& .ss__recommendation-bundle__wrapper__selector__result-wrapper__seed-badge': {
					position: 'absolute',
					top: '0',
					left: '0',
					zIndex: '1',
				},

				'& .ss__recommendation-bundle__wrapper__selector__icon': {
					position: 'absolute',
					right: '-1em',
					top: '140px',
				},

				'& .ss__recommendation-bundle__wrapper__selector__result-wrapper': {
					alignItems: 'center',
					position: 'relative',
					margin: `0px ${5 + (spaceBetween || 0)}px`,
				},
				'& .ss__recommendation-bundle__wrapper__selector__result-wrapper__checkbox': {
					position: 'absolute',
					top: '0',
					right: '0',
					zIndex: '1',
					cursor: 'pointer',
				},
			},
		}),
};

export const RecommendationBundle = observer((properties: RecommendationBundleProps): JSX.Element => {
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

	let props: RecommendationBundleProps = {
		// default props
		breakpoints: JSON.parse(JSON.stringify(defaultCarouselBreakpoints)),
		hideCheckboxes: false,
		separatorIcon: 'plus-thin',
		seedText: 'This Product',
		separatorIconSeedOnly: true,
		ctaIcon: true,
		ctaButtonText: 'Add All To Cart',
		ctaButtonSuccessText: 'Bundle Added!',
		ctaButtonSuccessTimeout: 2000,
		ctaInline: true,
		// global theme
		...globalTheme?.components?.recommendationBundle,
		...properties,
		// props
		...properties.theme?.components?.recommendationBundle,
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
		separatorIcon,
		hideCheckboxes,
		limit,
		seedText,
		vertical,
		onAddToCart,
		separatorIconSeedOnly,
		resultComponent,
		ctaSlot,
		hideSeed,
		ctaButtonText,
		ctaButtonSuccessText,
		ctaButtonSuccessTimeout,
		disableStyles,
		ctaIcon,
		ctaInline,
		style,
		lazyRender,
		className,
		...additionalProps
	} = props;

	const mergedlazyRender = {
		enabled: true,
		offset: '10%',
		...lazyRender,
	};

	const mergedCarouselProps = {
		enabled: true,
		loop: false,
		spaceBetween: 10,
		...carousel,
	};
	const { seedInCarousel, prevButton, nextButton, hideButtons, loop, spaceBetween, pagination } = mergedCarouselProps;

	const carouselEnabled = mergedCarouselProps.enabled;

	if (!controller || controller.type !== 'recommendation') {
		throw new Error(`<RecommendationBundle> Component requires 'controller' prop with an instance of RecommendationController`);
	}

	let resultsToRender: Product[] = results || controller.store?.results;

	if (limit) {
		resultsToRender = resultsToRender.slice(0, hideSeed ? limit + 1 : limit);
	}

	const cartStore = controller.store.cart;

	if (!cartStore) {
		throw new Error(`<RecommendationBundle> Component requires 'cartStore' to exist in the recommendation store`);
	}

	if (!(results && results.length) && !controller.store?.results?.length) {
		controller.log.error(`<RecommendationBundle> Component has no results to render!`);
		return <Fragment></Fragment>;
	}

	const seed = results ? results[0] : controller.store?.results[0];

	const subProps: RecommendationBundleSubProps = {
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

	let slidesPerView = props.carousel?.slidesPerView || props.slidesPerView;
	if (!slidesPerView) {
		slidesPerView = 2;
	} else if (resultsToRender.length < slidesPerView) {
		slidesPerView = resultsToRender.length;
	}

	const styling: { css?: StylingCSS } = {};
	if (!disableStyles) {
		styling.css = [CSS.recommendationBundle({ slidesPerView, spaceBetween, ctaInline, vertical, separatorIcon }), style];
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

			// fallback in case slides per view/group were not provided in breakpoint...
			const objSlidesPerView = obj.carousel?.slidesPerView || obj.slidesPerView || 2;
			const objSlidesPerGroup = obj.carousel?.slidesPerGroup || obj.slidesPerGroup || 2;

			let newSlidesPerView = objSlidesPerView;
			let newSlidesPerGroup = objSlidesPerGroup;

			const resultCount = seedInCarousel ? resultsToRender.length : resultsToRender.length - 1;

			if (resultCount) {
				if (resultCount >= objSlidesPerView) {
					newSlidesPerView = objSlidesPerView - (!seedInCarousel ? 1 : 0);
					if (!seedInCarousel) {
						newSlidesPerGroup = objSlidesPerGroup! - 1 || 1;
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
	const addToCart = (e: MouseEvent) => {
		// add to cart tracking
		controller.addToCart(selectedItems);

		//call the function passed
		onAddToCart && onAddToCart(e, selectedItems);
	};

	const setSeedwidth = () => {
		if (seedRef.current) {
			// @ts-ignore - todo can this be typed appropriatly?
			const seedElem: HTMLElement = seedRef.current?.base;
			// @ts-ignore - todo can this be typed appropriatly?
			const carouselElem: HTMLElement = carouselRef.current?.base;

			const visibleSlide = carouselElem?.querySelector('.swiper-slide-visible .ss__recommendation-bundle__wrapper__selector') as HTMLElement;
			const width = visibleSlide?.offsetWidth;

			if (seedElem) {
				seedElem.style.width = `${width}px`;
			}
		}
	};

	const seedRef = useRef();
	const carouselRef = useRef();
	const [isVisible, setIsVisible] = useState(false);
	const recsRef = useRef(null);
	const inView = mergedlazyRender?.enabled ? useIntersection(recsRef, `${mergedlazyRender.offset} 0px ${mergedlazyRender.offset} 0px`, true) : true;
	if (inView) {
		setIsVisible(true);
	}

	return resultsToRender?.length ? (
		<CacheProvider>
			<div
				{...styling}
				ref={recsRef}
				className={classnames('ss__recommendation-bundle', { 'ss__recommendation-bundle--stacked': !ctaInline }, className)}
			>
				{isVisible ? (
					<RecommendationProfileTracker controller={controller}>
						{title && (
							<h3 className="ss__recommendation-bundle__title">
								<span>{title}</span>
							</h3>
						)}

						<div
							className={classnames('ss__recommendation-bundle__wrapper', {
								'ss__recommendation-bundle__wrapper--seed-in-carousel': seedInCarousel,
								'ss__recommendation-bundle__wrapper--vertical': vertical,
							})}
						>
							{carouselEnabled ? (
								<Fragment>
									{!seedInCarousel && !hideSeed && (
										<div className="ss__recommendation-bundle__wrapper__seed-container">
											<ResultTracker controller={controller} result={seed} track={{ impression: false }}>
												<BundleSelector
													seedText={seedText}
													seed={true}
													onCheck={(e) => {
														e.stopPropagation();
														onProductSelect(seed);
													}}
													checked={selectedItems.findIndex((item) => item.id == seed.id) > -1}
													icon={separatorIcon}
													hideCheckboxes={hideCheckboxes}
													theme={props.theme}
													ref={seedRef}
												>
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
												</BundleSelector>
											</ResultTracker>
										</div>
									)}
									<div className="ss__recommendation-bundle__wrapper__carousel">
										<Carousel
											prevButton={prevButton}
											nextButton={nextButton}
											hideButtons={hideButtons}
											loop={loop}
											spaceBetween={spaceBetween}
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
											{seedInCarousel
												? resultsToRender
														.filter((result, idx) => (hideSeed && idx == 0 ? false : true))
														.map((result, idx) => {
															const selected = selectedItems.findIndex((item) => item.id == result.id) > -1;

															if (idx == 0 && !hideSeed) {
																return (
																	<ResultTracker controller={controller} result={result} track={{ impression: false }}>
																		<BundleSelector
																			seedText={seedText}
																			seed={true}
																			icon={separatorIcon}
																			onCheck={(e) => {
																				e.stopPropagation();
																				onProductSelect(result);
																			}}
																			checked={selected}
																			hideCheckboxes={hideCheckboxes}
																			theme={props.theme}
																		>
																			{resultComponent ? (
																				cloneWithProps(resultComponent, { result: result, seed: true, selected, onProductSelect })
																			) : (
																				<Result {...subProps.result} controller={controller} result={result} />
																			)}
																		</BundleSelector>
																	</ResultTracker>
																);
															} else {
																return (
																	<ResultTracker controller={controller} result={result}>
																		<BundleSelector
																			icon={separatorIconSeedOnly ? false : separatorIcon}
																			onCheck={(e) => {
																				e.stopPropagation();
																				onProductSelect(result);
																			}}
																			checked={selected}
																			hideCheckboxes={hideCheckboxes}
																			theme={props.theme}
																			className={idx + 1 == resultsToRender.length ? 'ss__recommendation-bundle__wrapper__selector--last' : ''}
																		>
																			{resultComponent ? (
																				cloneWithProps(resultComponent, { result: result, seed: false, selected, onProductSelect })
																			) : (
																				<Result {...subProps.result} controller={controller} result={result} />
																			)}
																		</BundleSelector>
																	</ResultTracker>
																);
															}
														})
												: resultsToRender
														.filter((result, idx) => idx !== 0)
														.map((result, idx, results) => {
															const selected = selectedItems.findIndex((item) => item.id == result.id) > -1;

															return (
																<ResultTracker controller={controller} result={result}>
																	<BundleSelector
																		icon={separatorIconSeedOnly ? false : separatorIcon}
																		onCheck={(e) => {
																			e.stopPropagation();
																			onProductSelect(result);
																		}}
																		checked={selected}
																		hideCheckboxes={hideCheckboxes}
																		theme={props.theme}
																		className={idx + 1 == results.length ? 'ss__recommendation-bundle__wrapper__selector--last' : ''}
																	>
																		{resultComponent ? (
																			cloneWithProps(resultComponent, { result: result, seed: false, selected, onProductSelect })
																		) : (
																			<Result {...subProps.result} controller={controller} result={result} />
																		)}
																	</BundleSelector>
																</ResultTracker>
															);
														})}
										</Carousel>
									</div>
								</Fragment>
							) : (
								resultsToRender
									.filter((result, idx) => (hideSeed && idx == 0 ? false : true))
									.map((result, idx) => {
										const selected = selectedItems.findIndex((item) => item.id == result.id) > -1;

										if (idx == 0 && !hideSeed) {
											return (
												<ResultTracker controller={controller} result={result} track={{ impression: false }}>
													<BundleSelector
														seedText={seedText}
														seed={true}
														icon={separatorIcon}
														onCheck={(e) => {
															e.stopPropagation();
															onProductSelect(result);
														}}
														checked={selected}
														hideCheckboxes={hideCheckboxes}
														theme={props.theme}
													>
														{resultComponent ? (
															cloneWithProps(resultComponent, { result: result, seed: true, selected, onProductSelect })
														) : (
															<Result {...subProps.result} controller={controller} result={result} />
														)}
													</BundleSelector>
												</ResultTracker>
											);
										} else {
											return (
												<ResultTracker controller={controller} result={result}>
													<BundleSelector
														icon={separatorIconSeedOnly ? false : separatorIcon}
														onCheck={(e) => {
															e.stopPropagation();
															onProductSelect(result);
														}}
														checked={selected}
														hideCheckboxes={hideCheckboxes}
														theme={props.theme}
														className={idx + 1 == resultsToRender.length ? 'ss__recommendation-bundle__wrapper__selector--last' : ''}
													>
														{resultComponent ? (
															cloneWithProps(resultComponent, { result: result, seed: false, selected, onProductSelect })
														) : (
															<Result {...subProps.result} controller={controller} result={result} />
														)}
													</BundleSelector>
												</ResultTracker>
											);
										}
									})
							)}

							{ctaInline && (
								<BundledCTA
									ctaSlot={ctaSlot}
									cartStore={cartStore}
									onAddToCart={(e: any) => addToCart(e)}
									ctaButtonText={ctaButtonText}
									ctaButtonSuccessText={ctaButtonSuccessText}
									ctaButtonSuccessTimeout={ctaButtonSuccessTimeout}
									ctaIcon={ctaIcon}
								/>
							)}
						</div>
						{!ctaInline && (
							<BundledCTA
								ctaSlot={ctaSlot}
								cartStore={cartStore}
								onAddToCart={(e: any) => addToCart(e)}
								ctaButtonText={ctaButtonText}
								ctaButtonSuccessText={ctaButtonSuccessText}
								ctaButtonSuccessTimeout={ctaButtonSuccessTimeout}
								ctaIcon={ctaIcon}
							/>
						)}
					</RecommendationProfileTracker>
				) : (
					<RecommendationProfileTracker controller={controller}>
						{resultsToRender.map((result) => (
							<ResultTracker controller={controller} result={result}>
								<></>
							</ResultTracker>
						))}
					</RecommendationProfileTracker>
				)}
			</div>
		</CacheProvider>
	) : (
		<Fragment></Fragment>
	);
	return <></>;
});

type BundleCarouselProps = {
	enabled?: boolean;
	seedInCarousel?: boolean;
} & Partial<CarouselProps>;

export interface RecommendationBundleProps extends ComponentProps {
	results?: Product[];
	limit?: number;
	controller: RecommendationController;
	onAddToCart: (e: MouseEvent, items: Product[]) => void;
	title?: JSX.Element | string;
	breakpoints?: BreakpointsProps;
	resultComponent?: JSX.Element;
	preselectedCount?: number;
	hideCheckboxes?: boolean;
	hideSeed?: boolean;
	seedText?: string;
	separatorIconSeedOnly?: boolean;
	separatorIcon?: string | Partial<IconProps> | boolean;
	ctaInline?: boolean;
	ctaIcon?: string | Partial<IconProps> | boolean;
	ctaButtonText?: string;
	ctaButtonSuccessText?: string;
	ctaButtonSuccessTimeout?: number;
	ctaSlot?: JSX.Element;
	vertical?: boolean;
	carousel?: BundleCarouselProps;
	lazyRender?: {
		enabled: boolean;
		offset?: string;
	};
}

interface RecommendationBundleSubProps {
	result: Partial<ResultProps>;
	carousel: Partial<CarouselProps>;
}
