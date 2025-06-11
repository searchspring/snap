import { h, Fragment } from 'preact';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { useRef, useEffect, useState } from 'preact/hooks';
import { observer } from 'mobx-react-lite';
import deepmerge from 'deepmerge';
import { Carousel, CarouselProps as CarouselProps } from '../../Molecules/Carousel';
import { Result, ResultProps } from '../../Molecules/Result';
import { defined, mergeProps, mergeStyles } from '../../../utilities';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, BreakpointsProps, ResultComponent, StyleScript, BreakpointsEntry } from '../../../types';
import { useDisplaySettings } from '../../../hooks/useDisplaySettings';
import { RecommendationProfileTracker } from '../../Trackers/Recommendation/ProfileTracker';
import { RecommendationResultTracker } from '../../Trackers/Recommendation/ResultTracker';
import { IconProps, IconType } from '../../Atoms/Icon';
import type { RecommendationController } from '@searchspring/snap-controller';
import type { Product } from '@searchspring/snap-store-mobx';
import { BundleSelector } from './BundleSelector';
import { BundledCTA, BundledCTAProps } from './BundleCTA';
import { Lang } from '../../../hooks';
import { useIntersection } from '../../../hooks';
import { componentNameToClassName } from '../../../utilities/componentNameToClassName';

const defaultStyles: StyleScript<RecommendationBundleProps> = ({ vertical, separatorIcon, carousel, ctaInline, alias: inherits }) => {
	let classNamePrefix = 'ss__recommendation-bundle';
	if (inherits) {
		classNamePrefix = `ss__${componentNameToClassName(inherits)}`;
	}

	return css({
		[`.${classNamePrefix}__wrapper`]: {
			display: 'flex',
			maxWidth: '100%',
			margin: '0',
			padding: '0',
		},

		[`.${classNamePrefix}__wrapper__selector--seed`]: {
			width: `${vertical ? '100%' : 'auto'}`,
			margin: `${!separatorIcon ? 'auto !important' : 'initial'}`,
		},

		[`.${classNamePrefix}__wrapper__seed-container`]: {
			width: vertical ? '100%' : `calc(100% / ${carousel?.slidesPerView! + (!ctaInline ? 0 : 1)})`,
		},

		[`.${classNamePrefix}__wrapper__cta`]: {
			width: vertical ? '100%' : `${!ctaInline ? '100%' : `calc(100% / ${carousel?.slidesPerView! + 1})`}`,

			textAlign: 'center',

			[`.${classNamePrefix}__wrapper__cta__subtotal__prices`]: {
				display: 'block',
			},

			[`.${classNamePrefix}__wrapper__cta__button--added`]: {
				cursor: 'none',
				pointerEvents: 'none',
				opacity: '.7',
			},
		},

		[`.${classNamePrefix}__wrapper__carousel`]: {
			boxSizing: 'border-box',
			width: vertical ? '100%' : `calc(calc(100% / ${carousel?.slidesPerView! + (!ctaInline ? 0 : 1)}) * ${carousel?.slidesPerView! - 1})`,
		},

		[`.${classNamePrefix}__wrapper--seed-in-carousel`]: {
			[`.${classNamePrefix}__wrapper__cta`]: {
				width: vertical ? '100%' : `calc(100% / ${carousel?.slidesPerView! + (!ctaInline ? 0 : 1)})`,
			},

			[`.${classNamePrefix}__wrapper__carousel`]: {
				width: vertical ? '100%' : `calc(calc(100% / ${carousel?.slidesPerView! + (!ctaInline ? 0 : 1)}) * ${carousel?.slidesPerView})`,
				padding: '0',
			},
		},

		'.swiper-slide, .swiper-slide-visible.swiper-last-visible-slide': {
			[`.${classNamePrefix}__wrapper__selector__icon`]: {
				display: 'none',
			},
		},

		'.swiper-slide-visible': {
			[`.${classNamePrefix}__wrapper__selector__icon`]: {
				display: 'block',
			},
		},

		[`.${classNamePrefix}__wrapper--vertical`]: {
			flexDirection: 'column',
		},

		[`.${classNamePrefix}__wrapper__selector`]: {
			alignItems: 'baseline',
			position: 'relative',

			[`&.${classNamePrefix}__wrapper__selector--last`]: {
				[`.${classNamePrefix}__wrapper__selector__icon`]: {
					display: 'none',
				},
			},

			[`.${classNamePrefix}__wrapper__selector__result-wrapper__seed-badge`]: {
				position: 'absolute',
				top: '0',
				left: '0',
				zIndex: '1',
			},

			[`.${classNamePrefix}__wrapper__selector__icon`]: {
				position: 'absolute',
				right: '-1em',
				top: '140px',
			},

			[`.${classNamePrefix}__wrapper__selector__result-wrapper`]: {
				alignItems: 'center',
				position: 'relative',
				margin: `0px ${5 + (Number(carousel?.spaceBetween) || 0)}px`,
			},
			[`.${classNamePrefix}__wrapper__selector__result-wrapper__checkbox`]: {
				position: 'absolute',
				top: '0',
				right: '0',
				//needs to be above 100 to get above badges
				zIndex: '101',
				cursor: 'pointer',
			},
		},
	});
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
		onAddToCart: (e, items) => controller?.addToCart && controller.addToCart(items),
		title: properties.controller?.store?.profile?.display?.templateParameters?.title,
		...properties,
		// props
		...properties.theme?.components?.recommendationBundle,
	};

	//mergeprops only uses names that are passed via properties, so this cannot be put in the defaultProps
	const _properties = {
		name: properties.controller?.store?.profile?.tag?.toLowerCase(),
		...properties,
	};

	let props = mergeProps(_properties.alias || 'recommendationBundle', globalTheme, defaultProps, _properties);

	let classNamePrefix = 'ss__recommendation-bundle';
	if (props.alias) {
		classNamePrefix = `ss__${componentNameToClassName(props.alias)}`;
	}

	let displaySettings: BreakpointsEntry | undefined;
	if (!(properties.theme?.name || globalTheme.name)) {
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
		hideSeed,
		ctaButtonText,
		ctaButtonSuccessText,
		ctaButtonSuccessTimeout,
		disableStyles,
		ctaIcon,
		ctaInline,
		hideSeedText,
		lazyRender,
		className,
		style: _,
		styleScript: __,
		themeStyleScript: ___,
		treePath,
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
		throw new Error(`<BundleRecommendation> Component requires 'controller' prop with an instance of RecommendationController`);
	}

	let resultsToRender: Product[] = results || controller.store?.results;

	if (limit) {
		resultsToRender = resultsToRender.slice(0, hideSeed ? limit + 1 : limit);
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
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
			treePath,
		},
		result: {
			// default props
			className: 'ss__recommendation__result',
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
			treePath,
		},
	};

	let slidesPerView = props.carousel?.slidesPerView || props.slidesPerView;
	if (!slidesPerView) {
		slidesPerView = 2;
	} else if (resultsToRender.length < Number(slidesPerView)) {
		slidesPerView = resultsToRender.length;
	}

	const styling = mergeStyles<RecommendationBundleProps>({ ...props, carousel: { ...mergedCarouselProps, slidesPerView } }, defaultStyles);

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
		const adjustSlides = (obj: BreakpointsEntry) => {
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

			return {
				slidesPerView: newSlidesPerView,
				slidesPerGroup: newSlidesPerGroup,
			};
		};

		//no breakpoint props allowed in templates
		if (!(properties.theme?.name || globalTheme.name)) {
			Object.keys(props.breakpoints!).forEach((breakpoint) => {
				const obj = props.breakpoints![breakpoint as keyof typeof props.breakpoints];

				const { slidesPerView: adjustedSlidesPerView, slidesPerGroup: adjustedSlidesPerGroup } = adjustSlides(obj);

				modifiedBreakpoints[breakpoint as keyof typeof props.breakpoints] = {
					...modifiedBreakpoints[breakpoint as keyof typeof props.breakpoints],
					slidesPerView: adjustedSlidesPerView,
					slidesPerGroup: adjustedSlidesPerGroup,
				};
			});
		} else {
			const { slidesPerView: adjustedSlidesPerView, slidesPerGroup: adjustedSlidesPerGroup } = adjustSlides({
				...mergedCarouselProps,
				slidesPerView: slidesPerView,
			});

			displaySettings = {
				...mergedCarouselProps,
				slidesPerView: adjustedSlidesPerView,
				slidesPerGroup: adjustedSlidesPerGroup,
			};
		}
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

			const visibleSlide = carouselElem?.querySelector(`.swiper-slide-visible .${classNamePrefix}__wrapper__selector`) as HTMLElement;
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

	//initialize lang
	const defaultLang: Partial<RecommendationBundleLang> = {
		seedText: {
			value: seedText,
		},
		ctaButtonText: {
			value: ctaButtonText,
		},
		ctaButtonSuccessText: {
			value: ctaButtonSuccessText,
		},
	};

	//deep merge with props.lang
	const lang = deepmerge(defaultLang, props.lang || {});

	if (hideSeedText) {
		delete lang.seedText.value;
	}

	return resultsToRender?.length ? (
		<CacheProvider>
			<div {...styling} ref={recsRef} className={classnames(classNamePrefix, { [`${classNamePrefix}--stacked`]: !ctaInline }, className)}>
				{isVisible ? (
					<RecommendationProfileTracker controller={controller}>
						{title && (
							<h3 className={`${classNamePrefix}__title`}>
								<span>{title}</span>
							</h3>
						)}

						<div
							className={classnames(`${classNamePrefix}__wrapper`, {
								[`${classNamePrefix}__wrapper--seed-in-carousel`]: seedInCarousel,
								[`${classNamePrefix}__wrapper--vertical`]: vertical,
							})}
						>
							{carouselEnabled ? (
								<Fragment>
									{!seedInCarousel && !hideSeed && (
										<div className={`${classNamePrefix}__wrapper__seed-container`}>
											<RecommendationResultTracker controller={controller} result={seed} track={{ impression: false }}>
												<BundleSelector
													seedText={seedText}
													seed={true}
													title={seed.display.mappings.core?.name}
													onCheck={() => onProductSelect(seed)}
													checked={selectedItems.findIndex((item) => item.id == seed.id) > -1}
													icon={separatorIcon}
													hideCheckboxes={hideCheckboxes}
													theme={props.theme}
													ref={seedRef}
													treePath={treePath}
													classNamePrefix={classNamePrefix}
													lang={{ seedText: lang.seedText }}
												>
													{(() => {
														if (resultComponent && controller) {
															const ResultComponent = resultComponent;
															return (
																<ResultComponent
																	controller={controller}
																	seed={true}
																	selected={selectedItems.findIndex((item) => item.id == seed.id) > -1}
																	onProductSelect={onProductSelect}
																	result={seed}
																	treePath={treePath}
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
									<div className={`${classNamePrefix}__wrapper__carousel`}>
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
																	<RecommendationResultTracker controller={controller} result={result} track={{ impression: false }}>
																		<BundleSelector
																			seedText={seedText}
																			seed={true}
																			title={result.display.mappings.core?.name}
																			icon={separatorIcon}
																			onCheck={() => onProductSelect(result)}
																			checked={selected}
																			hideCheckboxes={hideCheckboxes}
																			theme={props.theme}
																			treePath={treePath}
																			classNamePrefix={classNamePrefix}
																			lang={{ seedText: lang.seedText }}
																		>
																			{(() => {
																				if (resultComponent && controller) {
																					const ResultComponent = resultComponent;
																					return (
																						<ResultComponent
																							controller={controller}
																							seed={true}
																							selected={selected}
																							onProductSelect={onProductSelect}
																							result={result}
																							treePath={treePath}
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
																			title={result.display.mappings.core?.name}
																			onCheck={() => onProductSelect(result)}
																			checked={selected}
																			hideCheckboxes={hideCheckboxes}
																			theme={props.theme}
																			treePath={treePath}
																			classNamePrefix={classNamePrefix}
																			className={idx + 1 == resultsToRender.length ? `${classNamePrefix}__wrapper__selector--last` : ''}
																		>
																			{(() => {
																				if (resultComponent && controller) {
																					const ResultComponent = resultComponent;
																					return (
																						<ResultComponent
																							controller={controller}
																							seed={false}
																							selected={selected}
																							onProductSelect={onProductSelect}
																							result={result}
																							treePath={treePath}
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
																		title={result.display.mappings.core?.name}
																		onCheck={() => onProductSelect(result)}
																		checked={selected}
																		hideCheckboxes={hideCheckboxes}
																		theme={props.theme}
																		treePath={treePath}
																		classNamePrefix={classNamePrefix}
																		className={idx + 1 == results.length ? `${classNamePrefix}__wrapper__selector--last` : ''}
																	>
																		{(() => {
																			if (resultComponent && controller) {
																				const ResultComponent = resultComponent;
																				return (
																					<ResultComponent
																						controller={controller}
																						seed={false}
																						selected={selected}
																						onProductSelect={onProductSelect}
																						result={result}
																						treePath={treePath}
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
								resultsToRender
									.filter((result, idx) => (hideSeed && idx == 0 ? false : true))
									.map((result, idx) => {
										const selected = selectedItems.findIndex((item) => item.id == result.id) > -1;

										if (idx == 0 && !hideSeed) {
											return (
												<RecommendationResultTracker controller={controller} result={result} track={{ impression: false }}>
													<BundleSelector
														seedText={seedText}
														seed={true}
														title={result.display.mappings.core?.name}
														icon={separatorIcon}
														onCheck={() => onProductSelect(result)}
														checked={selected}
														hideCheckboxes={hideCheckboxes}
														theme={props.theme}
														treePath={treePath}
														classNamePrefix={classNamePrefix}
														lang={{ seedText: lang.seedText }}
													>
														{(() => {
															if (resultComponent && controller) {
																const ResultComponent = resultComponent;
																return (
																	<ResultComponent
																		controller={controller}
																		seed={true}
																		selected={selected}
																		onProductSelect={onProductSelect}
																		result={result}
																		treePath={treePath}
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
														title={result.display.mappings.core?.name}
														onCheck={() => onProductSelect(result)}
														checked={selected}
														hideCheckboxes={hideCheckboxes}
														theme={props.theme}
														treePath={treePath}
														classNamePrefix={classNamePrefix}
														className={idx + 1 == resultsToRender.length ? `${classNamePrefix}__wrapper__selector--last` : ''}
													>
														{(() => {
															if (resultComponent && controller) {
																const ResultComponent = resultComponent;
																return (
																	<ResultComponent
																		controller={controller}
																		seed={false}
																		selected={selected}
																		onProductSelect={onProductSelect}
																		result={result}
																		treePath={treePath}
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
									onAddToCart={(e) => addToCart(e as unknown as MouseEvent)}
									ctaButtonText={ctaButtonText}
									ctaButtonSuccessText={ctaButtonSuccessText}
									ctaButtonSuccessTimeout={ctaButtonSuccessTimeout}
									ctaIcon={ctaIcon}
									treePath={treePath}
									classNamePrefix={classNamePrefix}
									lang={{
										ctaButtonSuccessText: lang.ctaButtonSuccessText,
										ctaButtonText: lang.ctaButtonText,
									}}
								/>
							)}
						</div>
						{!ctaInline && (
							<BundledCTA
								ctaSlot={ctaSlot}
								cartStore={cartStore}
								onAddToCart={(e) => addToCart(e as unknown as MouseEvent)}
								ctaButtonText={ctaButtonText}
								ctaButtonSuccessText={ctaButtonSuccessText}
								ctaButtonSuccessTimeout={ctaButtonSuccessTimeout}
								ctaIcon={ctaIcon}
								treePath={treePath}
								classNamePrefix={classNamePrefix}
								lang={{
									ctaButtonSuccessText: lang.ctaButtonSuccessText,
									ctaButtonText: lang.ctaButtonText,
								}}
							/>
						)}
					</RecommendationProfileTracker>
				) : (
					<RecommendationProfileTracker controller={controller}>
						{resultsToRender.map((result) => (
							<RecommendationResultTracker controller={controller} result={result}>
								<></>
							</RecommendationResultTracker>
						))}
					</RecommendationProfileTracker>
				)}
			</div>
		</CacheProvider>
	) : (
		<Fragment></Fragment>
	);
});

type BundleCarouselProps = {
	controller?: RecommendationController;
	enabled?: boolean;
	seedInCarousel?: boolean;
} & Partial<CarouselProps>;

export interface RecommendationBundleProps extends ComponentProps {
	controller: RecommendationController;
	results?: Product[];
	limit?: number;
	onAddToCart?: (e: MouseEvent, items: Product[]) => void;
	title?: JSX.Element | string;
	breakpoints?: BreakpointsProps;
	resultComponent?: ResultComponent<{
		controller: RecommendationController;
		seed?: boolean;
		selected?: boolean;
		onProductSelect?: (product: Product) => void;
	}>;
	preselectedCount?: number;
	hideCheckboxes?: boolean;
	hideSeed?: boolean;
	seedText?: string;
	hideSeedText?: boolean;
	separatorIconSeedOnly?: boolean;
	separatorIcon?: IconType | Partial<IconProps> | false;
	ctaInline?: boolean;
	ctaIcon?: IconType | Partial<IconProps> | false;
	ctaButtonText?: string;
	ctaButtonSuccessText?: string;
	ctaButtonSuccessTimeout?: number;
	ctaSlot?: JSX.Element | React.FunctionComponent<BundledCTAProps>;
	vertical?: boolean;
	carousel?: BundleCarouselProps;
	slidesPerView?: number; // TODO: remove this prop?
	lang?: Partial<RecommendationBundleLang>;
	lazyRender?: {
		enabled: boolean;
		offset?: string;
	};
	alias?: string;
}

export interface RecommendationBundleLang {
	seedText: Lang<never>;
	ctaButtonText: Lang<never>;
	ctaButtonSuccessText: Lang<never>;
}

interface RecommendationBundleSubProps {
	result: Partial<ResultProps>;
	carousel: Partial<CarouselProps>;
}
