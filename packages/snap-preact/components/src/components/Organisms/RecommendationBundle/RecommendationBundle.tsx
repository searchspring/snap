import { h, Fragment } from 'preact';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { useRef } from 'preact/hooks';
import { observer } from 'mobx-react';
import deepmerge from 'deepmerge';
import { Carousel, CarouselProps as CarouselProps } from '../../Molecules/Carousel';
import { Result, ResultProps } from '../../Molecules/Result';
import { defined, mergeProps } from '../../../utilities';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, BreakpointsProps, StylingCSS, ResultComponent } from '../../../types';
import { useDisplaySettings } from '../../../hooks/useDisplaySettings';
import { RecommendationProfileTracker } from '../../Trackers/Recommendation/ProfileTracker';
import { RecommendationResultTracker } from '../../Trackers/Recommendation/ResultTracker';
import { IconProps, IconType } from '../../Atoms/Icon';
import type { RecommendationController } from '@searchspring/snap-controller';
import type { Product } from '@searchspring/snap-store-mobx';
import { BundleSelector } from './BundleSelector';
import { BundledCTA } from './BundleCTA';
import { useEffect } from 'react';

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

	const defaultProps: Partial<RecommendationBundleProps> = {
		// default props
		breakpoints: JSON.parse(JSON.stringify(defaultCarouselBreakpoints)),
		hideCheckboxes: false,
		separatorIcon: 'plus-thin',
		seedText: 'This Product',
		separatorIconSeedOnly: true,
		ctaIcon: 'bag',
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

	let props = mergeProps('recommendationBundle', globalTheme, defaultProps, properties);
	let displaySettings;
	if (!properties.theme?.name) {
		displaySettings = useDisplaySettings(props.breakpoints!);
		if (displaySettings && Object.keys(displaySettings).length) {
			const theme = deepmerge(props?.theme || {}, displaySettings?.theme || {}, { arrayMerge: (destinationArray, sourceArray) => sourceArray });
			props = {
				...props,
				...displaySettings,
				theme,
			};
		}
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
		ctaButtonText,
		ctaButtonSuccessText,
		ctaButtonSuccessTimeout,
		disableStyles,
		ctaIcon,
		ctaInline,
		style,
		className,
		styleScript,
		...additionalProps
	} = props;

	const mergedCarouselProps = {
		enabled: true,
		loop: false,
		spaceBetween: 10,
		...carousel,
	};
	const { seedInCarousel, prevButton, nextButton, hideButtons, loop, spaceBetween, pagination } = mergedCarouselProps;

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

	if (!(results && results.length) && !controller.store?.results?.length) {
		throw new Error(`<BundleRecommendation> Component has no results to render!`);
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
	} else if (resultsToRender.length < Number(slidesPerView)) {
		slidesPerView = resultsToRender.length;
	}

	const styling: { css?: StylingCSS } = {};
	const stylingProps = props;

	if (styleScript && !disableStyles) {
		styling.css = [styleScript(stylingProps), style];
	} else if (!disableStyles) {
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
				if (idx < Number(_preSelectedCount)) {
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
		controller.track.addBundle(e, selectedItems);

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

	return resultsToRender?.length ? (
		<CacheProvider>
			<div {...styling} className={classnames('ss__recommendation-bundle', { 'ss__recommendation-bundle--stacked': !ctaInline }, className)}>
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
								{!seedInCarousel && (
									<div className="ss__recommendation-bundle__wrapper__seed-container">
										<RecommendationResultTracker controller={controller} result={seed}>
											<BundleSelector
												seedText={seedText}
												seed={true}
												onCheck={() => onProductSelect(seed)}
												checked={selectedItems.findIndex((item) => item.id == seed.id) > -1}
												icon={separatorIcon}
												hideCheckboxes={hideCheckboxes}
												theme={props.theme}
												ref={seedRef}
											>
												{(() => {
													if (resultComponent && controller) {
														const ResultComponent = resultComponent;
														return (
															<ResultComponent
																controller={controller}
																result={seed}
																seed={true}
																selected={selectedItems.findIndex((item) => item.id == seed.id) > -1}
																onProductSelect={onProductSelect}
															/>
														);
													} else {
														return <Result {...subProps.result} controller={controller} result={seed} />;
													}
												})()}
											</BundleSelector>
										</RecommendationResultTracker>
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
											? resultsToRender.map((result, idx) => {
													const selected = selectedItems.findIndex((item) => item.id == result.id) > -1;

													if (idx == 0) {
														return (
															<RecommendationResultTracker controller={controller} result={result}>
																<BundleSelector
																	seedText={seedText}
																	seed={true}
																	icon={separatorIcon}
																	onCheck={() => onProductSelect(result)}
																	checked={selected}
																	hideCheckboxes={hideCheckboxes}
																	theme={props.theme}
																>
																	{(() => {
																		if (resultComponent && controller) {
																			const ResultComponent = resultComponent;
																			return (
																				<ResultComponent
																					controller={controller}
																					result={result}
																					seed={true}
																					selected={selected}
																					onProductSelect={onProductSelect}
																				/>
																			);
																		} else {
																			return <Result {...subProps.result} controller={controller} result={result} />;
																		}
																	})()}
																</BundleSelector>
															</RecommendationResultTracker>
														);
													} else {
														return (
															<RecommendationResultTracker controller={controller} result={result}>
																<BundleSelector
																	icon={separatorIconSeedOnly ? false : separatorIcon}
																	onCheck={() => onProductSelect(result)}
																	checked={selected}
																	hideCheckboxes={hideCheckboxes}
																	theme={props.theme}
																	className={idx + 1 == resultsToRender.length ? 'ss__recommendation-bundle__wrapper__selector--last' : ''}
																>
																	{(() => {
																		if (resultComponent && controller) {
																			const ResultComponent = resultComponent;
																			return (
																				<ResultComponent
																					controller={controller}
																					result={result}
																					seed={false}
																					selected={selected}
																					onProductSelect={onProductSelect}
																				/>
																			);
																		} else {
																			return <Result {...subProps.result} controller={controller} result={result} />;
																		}
																	})()}
																</BundleSelector>
															</RecommendationResultTracker>
														);
													}
											  })
											: resultsToRender
													.filter((result, idx) => idx !== 0)
													.map((result, idx, results) => {
														const selected = selectedItems.findIndex((item) => item.id == result.id) > -1;

														return (
															<RecommendationResultTracker controller={controller} result={result}>
																<BundleSelector
																	icon={separatorIconSeedOnly ? false : separatorIcon}
																	onCheck={() => onProductSelect(result)}
																	checked={selected}
																	hideCheckboxes={hideCheckboxes}
																	theme={props.theme}
																	className={idx + 1 == results.length ? 'ss__recommendation-bundle__wrapper__selector--last' : ''}
																>
																	{(() => {
																		if (resultComponent && controller) {
																			const ResultComponent = resultComponent;
																			return (
																				<ResultComponent
																					controller={controller}
																					result={result}
																					seed={false}
																					selected={selected}
																					onProductSelect={onProductSelect}
																				/>
																			);
																		} else {
																			return <Result {...subProps.result} controller={controller} result={result} />;
																		}
																	})()}
																</BundleSelector>
															</RecommendationResultTracker>
														);
													})}
									</Carousel>
								</div>
							</Fragment>
						) : (
							resultsToRender.map((result, idx) => {
								const selected = selectedItems.findIndex((item) => item.id == result.id) > -1;

								if (idx == 0) {
									return (
										<RecommendationResultTracker controller={controller} result={result}>
											<BundleSelector
												seedText={seedText}
												seed={true}
												icon={separatorIcon}
												onCheck={() => onProductSelect(result)}
												checked={selected}
												hideCheckboxes={hideCheckboxes}
												theme={props.theme}
											>
												{(() => {
													if (resultComponent && controller) {
														const ResultComponent = resultComponent;
														return (
															<ResultComponent
																controller={controller}
																result={result}
																seed={true}
																selected={selected}
																onProductSelect={onProductSelect}
															/>
														);
													} else {
														return <Result {...subProps.result} controller={controller} result={result} />;
													}
												})()}
											</BundleSelector>
										</RecommendationResultTracker>
									);
								} else {
									return (
										<RecommendationResultTracker controller={controller} result={result}>
											<BundleSelector
												icon={separatorIconSeedOnly ? false : separatorIcon}
												onCheck={() => onProductSelect(result)}
												checked={selected}
												hideCheckboxes={hideCheckboxes}
												theme={props.theme}
												className={idx + 1 == resultsToRender.length ? 'ss__recommendation-bundle__wrapper__selector--last' : ''}
											>
												{(() => {
													if (resultComponent && controller) {
														const ResultComponent = resultComponent;
														return (
															<ResultComponent
																controller={controller}
																result={result}
																seed={false}
																selected={selected}
																onProductSelect={onProductSelect}
															/>
														);
													} else {
														return <Result {...subProps.result} controller={controller} result={result} />;
													}
												})()}
											</BundleSelector>
										</RecommendationResultTracker>
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
			</div>
		</CacheProvider>
	) : (
		<Fragment></Fragment>
	);
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
	resultComponent?: ResultComponent<{ seed?: boolean; selected?: boolean; onProductSelect?: (product: Product) => void }>;
	preselectedCount?: number;
	hideCheckboxes?: boolean;
	seedText?: string;
	separatorIconSeedOnly?: boolean;
	separatorIcon?: IconType | Partial<IconProps> | false;
	ctaInline?: boolean;
	ctaIcon?: IconType | Partial<IconProps> | false;
	ctaButtonText?: string;
	ctaButtonSuccessText?: string;
	ctaButtonSuccessTimeout?: number;
	ctaSlot?: JSX.Element;
	vertical?: boolean;
	carousel?: BundleCarouselProps;
	slidesPerView?: number; // TODO: remove this prop?
}

interface RecommendationBundleSubProps {
	result: Partial<ResultProps>;
	carousel: Partial<CarouselProps>;
}
