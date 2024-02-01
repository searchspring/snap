/** @jsx jsx */
import { h, Fragment } from 'preact';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { useState } from 'preact/hooks';
import { observer } from 'mobx-react-lite';
import deepmerge from 'deepmerge';
import { Carousel, CarouselProps } from '../../Molecules/Carousel';
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

const CSS = {
	bundledRecommendations: ({ slidesPerView, stackedCTA }: any) =>
		css({
			'.ss__bundled-recommendations__wrapper': {
				display: 'flex',
				maxWidth: '100%',
				margin: '0',
				padding: '0',
			},

			'.ss__bundled-recommendations__wrapper__seed': {
				width: `calc(100% / ${slidesPerView + (stackedCTA ? 0 : 1)})`,
			},

			'.ss__bundled-recommendations__wrapper__cta': {
				width: `${stackedCTA ? '100%' : `calc(100% / ${slidesPerView + 1})`}`,

				textAlign: 'center',

				'& .ss__bundled-recommendations__wrapper__cta__subtotal__prices': {
					display: 'block',
				},
			},

			'.ss__bundled-recommendations__wrapper__carousel': {
				width: `calc(calc(100% / ${slidesPerView + (stackedCTA ? 0 : 1)}) * ${slidesPerView - 1})`,
				padding: '0px 15px',
			},

			'.ss__bundled-recommendations__wrapper--seed-in-carousel': {
				'.ss__bundled-recommendations__wrapper__cta': {
					width: `calc(100% / ${slidesPerView + (stackedCTA ? 0 : 1)})`,
				},

				'.ss__bundled-recommendations__wrapper__carousel': {
					width: `calc(calc(100% / ${slidesPerView + (stackedCTA ? 0 : 1)}) * ${slidesPerView})`,
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

			'.ss__bundled-recommendations__wrapper__selector': {
				display: 'flex',
				flexDirection: 'row',
				alignItems: 'center',
				position: 'relative',

				'& .ss__bundled-recommendations__wrapper__selector__result-wrapper__seed-badge': {
					position: 'absolute',
					top: '0',
					left: '0',
					zIndex: '1',
				},

				'& .ss__bundled-recommendations__wrapper__selector__qty__input': {
					boxSizing: 'border-box',
					width: '100%',
				},

				'& .ss__bundled-recommendations__wrapper__selector__icon': {
					position: 'absolute',
					right: '-1em',
					top: '140px',
				},

				'& .ss__bundled-recommendations__wrapper__selector__result-wrapper': {
					display: 'flex',
					flexDirection: 'column',
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
			stackedCTA: true,
		},
		768: {
			slidesPerView: 3,
			slidesPerGroup: 3,
			spaceBetween: 10,
		},
		1024: {
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
		seedText: 'Seed Product',
		seedSeparatorIconOnly: true,
		loop: false,
		ctaIcon: true,
		addToCartButtonText: 'Add All To Cart',
		stackedCTA: false,
		// global theme
		...globalTheme?.components?.recommendation,
		...properties,
		// props
		...properties.theme?.components?.recommendation,
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
		loop,
		results,
		seedInCarousel,
		pagination,
		nextButton,
		prevButton,
		hideButtons,
		preselectedCount,
		seperatorIcon,
		showCheckboxes,
		seedText,
		showQuantityPicker,
		quantityPickerText,
		onAddToCart,
		seedSeparatorIconOnly,
		resultComponent,
		ctaSlot,
		addToCartButtonText,
		disableStyles,
		peekaboo,
		ctaIcon,
		stackedCTA,
		style,
		className,
		...additionalProps
	} = props;

	if (!controller || controller.type !== 'recommendation') {
		throw new Error(`<Recommendation> Component requires 'controller' prop with an instance of RecommendationController`);
	}

	//need to make a clone of products to show to prevent infinite re-renders when changing selected items
	const products = results || controller.store?.results;
	const resultsToRender: Product[] = [...products];

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

	const slidesPerView = props.slidesPerView;
	const styling: { css?: StylingCSS } = {};
	if (!disableStyles) {
		styling.css = [CSS.bundledRecommendations({ slidesPerView, stackedCTA }), style];
	} else if (style) {
		styling.css = [style];
	}

	const initialSelectedItems: Product[] = [];

	const _preSelectedCount = typeof preselectedCount == 'number' ? preselectedCount : slidesPerView;

	if (_preSelectedCount) {
		resultsToRender?.forEach((result, idx) => {
			if (idx < _preSelectedCount) {
				initialSelectedItems.push(result);
			}
		});
	}

	const [selectedItems, setSelectedItems] = useState<Product[]>(initialSelectedItems);

	let bundlePrice = 0;
	let bundleStrikePrice = 0;

	//set current price/bundle price based on whats selected
	resultsToRender?.forEach((result) => {
		selectedItems.forEach((item) => {
			if (item.id && item.id.indexOf(result.id) > -1) {
				bundlePrice += (result.display.mappings.core?.price || 0) * result.quantity;
				bundleStrikePrice += (result.display.mappings.core?.msrp || result.display.mappings.core?.price || 0) * result.quantity;
			}
		});
	});

	const modifiedBreakpoints: BreakpointsProps = { ...breakpoints };

	Object.keys(props.breakpoints!).forEach((breakpoint: any) => {
		const obj = props.breakpoints![breakpoint];

		if (!seedInCarousel && resultsToRender.length) {
			modifiedBreakpoints[breakpoint] = {
				...obj,
				slidesPerView: obj.slidesPerView! - 1 + (peekaboo ? 0.5 : 0),
				slidesPerGroup: obj.slidesPerGroup! - 1,
			};

			if (resultsToRender[0].id == products[0].id) {
				resultsToRender?.shift();
			}
		} else if (peekaboo) {
			modifiedBreakpoints[breakpoint] = {
				...obj,
				slidesPerView: obj.slidesPerView! + 0.5,
			};
		}
	});

	const onInputChange = (product: Product, qty: string) => {
		//numify
		const quantity = Number(qty || 1);

		//update the store
		const index = products.findIndex((result: any) => result.id == product.id);
		(products[index] as Product).setQuantity && (products[index] as Product).setQuantity(quantity);
	};

	const onProductSelect = (product: Product) => {
		if (product) {
			const idx = selectedItems.findIndex((result) => result.id == product.id);

			//is it in the selected items?
			if (idx > -1) {
				//already selected, deselect it now
				selectedItems.splice(idx, 1);
				const newIds = [...selectedItems];

				// ensure something is selected (use seed)
				if (newIds.length == 0) {
					newIds.push(seed);
				}

				setSelectedItems(newIds);
			} else {
				//add it to the list;
				const newIds = [...selectedItems];
				newIds.push(product);
				setSelectedItems(newIds);
			}
		}
	};

	const addToCart = (e: any) => {
		// profile click for add to cart (what was added, sku/price/qty)
		controller.track.addBundleToCart(e, selectedItems, bundlePrice);

		//call the function passed
		onAddToCart && onAddToCart(selectedItems);
	};

	return resultsToRender?.length ? (
		<CacheProvider>
			<div {...styling} className={classnames('ss__bundled-recommendations', { 'ss__bundled-recommendations--stacked': stackedCTA }, className)}>
				<RecommendationProfileTracker controller={controller}>
					{title && (
						<h3 className="ss__bundled-recommendations__title">
							<span>{title}</span>
						</h3>
					)}

					<div
						className={classnames('ss__bundled-recommendations__wrapper', {
							'ss__bundled-recommendations__wrapper--seed-in-carousel': seedInCarousel,
						})}
					>
						{!seedInCarousel && (
							<div className="ss__bundled-recommendations__wrapper__seed">
								<BundleSelector
									seedText={seedText}
									onCheck={() => onProductSelect(seed)}
									checked={selectedItems.findIndex((item) => item.id == seed.id) > -1}
									icon={seperatorIcon}
									onInputChange={(e) => onInputChange(seed, e.target.value)}
									quantity={showQuantityPicker ? (seed as Product).quantity : undefined}
									quantityPickerText={quantityPickerText}
									showCheckboxes={showCheckboxes}
									theme={props.theme}
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
								{...subProps.carousel}
								{...additionalProps}
								{...displaySettings}
							>
								{resultsToRender.map((result, idx) => {
									const selected = selectedItems.findIndex((item) => item.id == result.id) > -1;

									if (idx == 0 && seedInCarousel) {
										return (
											<div className="ss__bundled-recommendation__wrapper__seed">
												<BundleSelector
													seedText={seedText}
													icon={seperatorIcon}
													onCheck={() => onProductSelect(result)}
													quantityPickerText={quantityPickerText}
													checked={selected}
													onInputChange={(e) => onInputChange(result, e.target.value)}
													quantity={showQuantityPicker ? result.quantity : undefined}
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
											</div>
										);
									} else {
										return (
											<BundleSelector
												icon={seedSeparatorIconOnly ? false : seperatorIcon}
												onCheck={() => onProductSelect(result)}
												checked={selected}
												onInputChange={(e) => onInputChange(result, e.target.value)}
												quantity={showQuantityPicker ? result.quantity : undefined}
												quantityPickerText={quantityPickerText}
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
						{!stackedCTA && (
							<BundledCTA
								ctaSlot={ctaSlot}
								selectedItems={selectedItems}
								bundlePrice={bundlePrice}
								bundleStrikePrice={bundleStrikePrice}
								onAddToCartClick={(e: any) => addToCart(e)}
								addToCartText={addToCartButtonText}
								icon={ctaIcon}
							/>
						)}
					</div>
					{stackedCTA && (
						<BundledCTA
							ctaSlot={ctaSlot}
							selectedItems={selectedItems}
							bundlePrice={bundlePrice}
							bundleStrikePrice={bundleStrikePrice}
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
});

export interface BundledRecommendationProps extends ComponentProps {
	results?: Product[];
	controller: RecommendationController;
	onAddToCart: (items: Product[]) => void;
	addToCartButtonText?: string;
	title?: JSX.Element | string;
	breakpoints?: BreakpointsProps;
	prevButton?: JSX.Element | string;
	nextButton?: JSX.Element | string;
	hideButtons?: boolean;
	loop?: boolean;
	pagination?: boolean;
	resultComponent?: JSX.Element;
	preselectedCount?: number;
	showQuantityPicker?: boolean;
	quantityPickerText?: string;
	showCheckboxes?: boolean;
	seedInCarousel?: boolean;
	seedText?: string;
	seedSeparatorIconOnly?: boolean;
	seperatorIcon?: string | Partial<IconProps> | boolean;
	stackedCTA?: boolean;
	ctaIcon?: string | Partial<IconProps> | boolean;
	ctaSlot?: JSX.Element;
	peekaboo?: boolean;
}

interface BundleRecommendationSubProps {
	result: Partial<ResultProps>;
	carousel: Partial<CarouselProps>;
}
