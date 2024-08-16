import { h, Fragment } from 'preact';
import { useEffect } from 'preact/hooks';

import { observer } from 'mobx-react';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import deepmerge from 'deepmerge';

import type { AutocompleteController, RecommendationControllerConfig } from '@searchspring/snap-controller';
import { ContentType } from '@searchspring/snap-store-mobx';
import type { Term } from '@searchspring/snap-store-mobx';

import { Icon, IconProps } from '../../Atoms/Icon/Icon';
import { Results, ResultsProps } from '../../Organisms/Results';
import { Banner, BannerProps } from '../../Atoms/Merchandising/Banner';
import { Facets, FacetsProps } from '../../Organisms/Facets';
import { defined, cloneWithProps, mergeProps } from '../../../utilities';
import { createHoverProps } from '../../../toolbox';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, FacetDisplay, BreakpointsProps, RootNodeProperties, ResultComponent } from '../../../types';
import { useDisplaySettings } from '../../../hooks/useDisplaySettings';
import { Lang, useA11y, useLang } from '../../../hooks';

// import { useSnap } from '../../../providers';
// import { useComponent } from '../../../hooks';
// import { useCreateController } from '../../../hooks/useCreateController';
// import type { RecommendationController } from '@searchspring/snap-controller';
// import type { FunctionalComponent } from 'preact';
// import type { SnapTemplates } from '../../../../../src';

const CSS = {
	Autocomplete: ({
		inputViewportOffsetBottom,
		hideFacets,
		horizontalTerms,
		noResults,
		contentSlot,
		viewportMaxHeight,
		vertical,
		width,
		theme,
	}: Partial<AutocompleteProps> & { inputViewportOffsetBottom: number; noResults: boolean }) =>
		css({
			'&, & *, & *:before, & *:after': {
				boxSizing: 'border-box',
			},

			display: 'flex',
			flexDirection: vertical ? 'column' : 'row',
			flexWrap: horizontalTerms && !vertical ? 'wrap' : undefined,
			position: 'absolute',
			zIndex: '10002',
			border: '1px solid #ebebeb',
			background: '#ffffff',
			width: width,
			maxWidth: '100vw',
			maxHeight: viewportMaxHeight && inputViewportOffsetBottom ? `calc(100vh - ${inputViewportOffsetBottom + 10}px)` : undefined,
			overflowY: viewportMaxHeight && horizontalTerms && !vertical ? 'scroll' : undefined,

			'& .ss__autocomplete__close-button': {
				color: '#c5c5c5',
				fontSize: '.8em',
			},
			'& .ss__autocomplete__close-button:focus': {
				top: '0px !important',
				left: '0px !important',
				zIndex: '1',
			},

			'&.ss__autocomplete--only-terms': {
				width: `${vertical || horizontalTerms || Boolean(contentSlot) ? width : '150px'}`,
			},

			'.ss__autocomplete__title--trending, .ss__autocomplete__title--history, .ss__autocomplete__title--terms': {
				fontWeight: 'normal',
				margin: 0,
				color: '#c5c5c5',
				textTransform: 'uppercase',
				padding: '10px',
				'& h5': {
					fontSize: '.8em',
					margin: 0,
				},
			},

			'.ss__autocomplete__title--facets': {
				order: vertical ? 2 : undefined,
			},

			'& .ss__autocomplete__terms': {
				display: 'flex',
				flexDirection: 'column',
				flex: `1 1 auto`,
				maxWidth: `${vertical || horizontalTerms ? 'auto' : '150px'}`,
				minWidth: '150px',
				order: 1,
				background: '#f8f8f8',

				'& .ss__autocomplete__terms__options': {
					display: vertical || horizontalTerms ? 'flex' : undefined,
					justifyContent: 'space-evenly',
					flexWrap: 'wrap',

					'& .ss__autocomplete__terms__option': {
						flexGrow: vertical || horizontalTerms ? '1' : undefined,
						textAlign: vertical || horizontalTerms ? 'center' : undefined,
						wordBreak: 'break-all',

						'& a': {
							display: 'block',
							padding: vertical || horizontalTerms ? '10px 30px' : '10px',

							'& em': {
								fontStyle: 'normal',
							},
						},

						'&.ss__autocomplete__terms__option--active': {
							background: '#fff',

							'& a': {
								fontWeight: 'bold',
								color: theme?.variables?.color?.primary,
							},
						},
					},
				},
			},

			'& .ss__autocomplete__facets': {
				display: 'flex',
				flex: `0 0 150px`,
				flexDirection: vertical ? 'row' : 'column',
				columnGap: '20px',
				order: 2,
				padding: vertical ? '10px 20px' : '10px',
				overflowY: vertical ? undefined : 'auto',
				'& .ss__autocomplete__facet': {
					flex: vertical ? '0 1 150px' : undefined,
				},
				'.ss__facet-hierarchy-options__option.ss__facet-hierarchy-options__option--filtered~.ss__facet-hierarchy-options__option:not(.ss__facet-hierarchy-options__option--filtered)':
					{
						paddingLeft: 0,
					},
				'.ss__facet-hierarchy-options__option.ss__facet-hierarchy-options__option--filtered:hover': {
					cursor: 'pointer',
				},
				'.ss__facet-palette-options__icon': {
					display: 'none',
				},
			},
			'& .ss__autocomplete__content': {
				display: 'flex',
				flex: `1 1 ${hideFacets ? 'auto' : '0%'}`,
				flexDirection: 'column',
				justifyContent: 'space-between',
				order: 3,
				overflowY: 'auto',
				margin: noResults ? '0 auto' : undefined,
				padding: vertical ? '10px 20px' : '10px',

				'& .ss__banner.ss__banner--header, .ss__banner.ss__banner--banner': {
					marginBottom: '10px',
				},
				'& .ss__banner.ss__banner--footer': {
					margin: '10px 0',
				},
				'& .ss__autocomplete__content__results': {
					minHeight: '0%',
				},
				'& .ss__autocomplete__content__info': {
					padding: '10px',
					textAlign: noResults ? 'center' : 'right',

					'& a': {
						fontWeight: 'bold',
						color: theme?.variables?.color?.primary,

						'& .ss__icon': {
							marginLeft: '5px',
						},
					},
				},
			},
		}),
};

export const Autocomplete = observer((properties: AutocompleteProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const defaultProps: Partial<AutocompleteProps> = {
		termsTitle: '',
		trendingTitle: 'Popular Searches',
		historyTitle: 'Previously Searched',
		facetsTitle: '',
		contentTitle: '',
		width: '100%',
	};

	let props = mergeProps('autocomplete', globalTheme, defaultProps, properties);

	const valueProps = createHoverProps();

	const facetClickEvent = (e: React.MouseEvent<Element, MouseEvent>) => {
		properties.onFacetOptionClick && properties.onFacetOptionClick(e);

		// remove focus from input (close the autocomplete)
		controller?.setFocused && controller?.setFocused();
	};

	const termClickEvent = (e: React.MouseEvent<Element, MouseEvent>) => {
		properties.onTermClick && properties.onTermClick(e);

		// remove focus from input (close the autocomplete)
		controller?.setFocused && controller?.setFocused();
	};

	const themeFunctionalityProps: Theme = {
		components: {
			facet: {
				valueProps,
				previewOnFocus: true,
			},
			facetGridOptions: {
				onClick: facetClickEvent,
			},
			facetHierarchyOptions: {
				onClick: facetClickEvent,
			},
			facetListOptions: {
				onClick: facetClickEvent,
			},
			facetPaletteOptions: {
				onClick: facetClickEvent,
			},
		},
	};

	if (!globalTheme?.name) {
		// breakpoint settings are calculated in ThemeStore for snap templates
		props.breakpoints = props.breakpoints || {
			0: {
				columns: 2,
				rows: 1,
				hideFacets: props.hideFacets ?? true,
				vertical: props.vertical ?? true,
				hideHistory: props.hideHistory ?? true,
				hideTrending: props.hideTrending ?? true,
			},
			540: {
				columns: 3,
				rows: 1,
				vertical: props.vertical ?? true,
				hideHistory: props.hideHistory ?? true,
				hideTrending: props.hideTrending ?? true,
			},
			768: {
				columns: 2,
				rows: 3,
			},
		};

		const themeDefaults: Theme = {
			components: {
				facet: {
					limit: 6,
					disableOverflow: true,
					disableCollapse: true,
				},
				facetGridOptions: {
					columns: 3,
				},
				facetHierarchyOptions: {
					hideCount: true,
				},
				facetListOptions: {
					hideCheckbox: true,
					hideCount: true,
				},
				facetPaletteOptions: {
					hideLabel: true,
					columns: 3,
				},
				result: {
					hideBadge: true,
				},
			},
		};

		const displaySettings = useDisplaySettings(props.breakpoints) || {};

		// merge deeply the themeDefaults with the theme props and the displaySettings theme props (do not merge arrays, but replace them)
		const theme = deepmerge.all([themeDefaults, themeFunctionalityProps, props?.theme || {}, displaySettings?.theme || {}], {
			arrayMerge: (destinationArray, sourceArray) => sourceArray,
		});

		props = {
			...props,
			...displaySettings,
			theme,
		};
	} else {
		// snap templates
		props.theme = deepmerge.all([themeFunctionalityProps, props?.theme || {}], { arrayMerge: (destinationArray, sourceArray) => sourceArray });
	}

	let input: string | Element | null = props.input;
	let inputViewportOffsetBottom = 0;
	if (input) {
		if (typeof input === 'string') {
			input = document.querySelector(input);
		}
		const rect = (input as Element)?.getBoundingClientRect();
		inputViewportOffsetBottom = rect?.bottom || 0;
	}

	const {
		hideTerms,
		hideFacets,
		hideContent,
		hideBanners,
		hideLink,
		hideHistory,
		hideTrending,
		retainTrending,
		retainHistory,
		vertical,
		termsTitle,
		trendingTitle,
		historyTitle,
		facetsTitle,
		contentTitle,
		termsSlot,
		facetsSlot,
		contentSlot,
		resultsSlot,
		noResultsSlot,
		linkSlot,
		resultComponent,
		onTermClick,
		// templates,
		disableStyles,
		className,
		style,
		controller,
		styleScript,
		treePath,
	} = props;

	const subProps: AutocompleteSubProps = {
		facets: {
			// default props
			limit: 3,
			// inherited props
			...defined({
				disableStyles,
			}),
			theme: props.theme,
			treePath,
		},
		banner: {
			// default props
			className: 'ss__autocomplete__banner',
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props.theme,
			treePath,
		},
		results: {
			// default props
			className: 'ss__autocomplete__results',
			breakpoints: props.breakpoints,
			resultComponent: resultComponent,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props.theme,
			treePath,
		},
		icon: {
			// default props
			className: 'ss__autocomplete__icon',
			icon: 'angle-right',
			size: '10px',
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props.theme,
			treePath,
		},
	};

	const { search, terms, trending, results, merchandising, pagination, loaded, filters, facets, state, loading } = controller.store;
	const history = controller.store.history || [];

	// you can pass in a selector or the actual input element,
	// if its the selector, we need to bind it to the controller here.
	if (controller && typeof input == 'string') {
		input = document.querySelector(input);
		// only bind on componentdidmount
		useEffect(() => {
			controller.bind();
		}, []);
	}

	const visible =
		Boolean(input === state.focusedInput) &&
		(terms.length > 0 || trending?.length > 0 || history?.length > 0 || (state.input && controller.store.loaded));

	const trendingActive = trending?.filter((term) => term.active).pop();
	const historyActive = history?.filter((term) => term.active).pop();

	let showTrending = false;
	if (trending?.length && ((retainTrending && controller.store.loaded) || (!results.length && !state.input))) {
		showTrending = true;
	}

	let showHistory = false;
	if (history?.length && ((retainHistory && controller.store.loaded) || (!results.length && !state.input))) {
		showHistory = true;
	}

	if (!state.input && (historyActive || trendingActive)) {
		if (history?.length) showHistory = true;
		if (trending?.length) showTrending = true;
	}

	const facetsToShow = facets.length ? facets.filter((facet) => facet.display !== FacetDisplay.SLIDER) : [];
	const onlyTerms = (trending?.length || history.length) && !loaded && !loading;

	// results logic
	let showResults = Boolean(results.length > 0 || Object.keys(merchandising.content).length > 0 || search?.query?.string);

	if ((hideTrending && trendingActive) || (hideHistory && historyActive)) {
		showResults = false;
	}

	const styling: RootNodeProperties = { 'ss-name': props.name };
	const stylingProps = {
		...props,
		inputViewportOffsetBottom,
		noResults: Boolean(search?.query?.string && results.length === 0),
	};

	// add styleScript to styling
	if (styleScript && !disableStyles) {
		styling.css = [styleScript(stylingProps), style];
	} else if (!disableStyles) {
		styling.css = [CSS.Autocomplete(stylingProps), style];
	} else if (style) {
		styling.css = [style];
	}

	const reset = () => {
		controller.setFocused();
		controller.reset();
	};

	// TODO: move to new Autocomplete component
	// let recommendationTemplateComponent: (() => FunctionalComponent<{ controller: RecommendationController }>) | undefined;
	// let recsController: RecommendationController | undefined;
	// if (templates?.recommendation?.template) {
	// 	const snap = useSnap() as SnapTemplate	s;
	// 	const mergedConfig = Object.assign(
	// 		{
	// 			id: 'trending',
	// 			tag: 'trending',
	// 			branch: 'production',
	// 		},
	// 		templates.recommendation!.config
	// 	);
	// 	if(snap) {
	// 		recsController = useCreateController<RecommendationController>(snap, 'recommendation', mergedConfig);
	// 		if (!recsController?.store?.loaded && recsController?.store.error?.type !== 'error') {
	// 			recsController?.search();
	// 		}
	// 		recommendationTemplateComponent = useComponent(snap, templates.recommendation!.template);
	// 	}
	// }
	// const RecommendationTemplateComponent = recommendationTemplateComponent as unknown as FunctionalComponent<{ controller: RecommendationController }>;

	//initialize lang
	const defaultLang: Partial<AutocompleteLang> = {
		trendingTitle: {
			value: trendingTitle,
		},
		termsTitle: {
			value: termsTitle,
		},
		contentTitle: {
			value: contentTitle,
		},
		historyTitle: {
			value: historyTitle,
		},
		closeButton: {
			value: 'Close Autocomplete',
			attributes: {
				'aria-label': 'close autocomplete',
			},
		},
		facetsTitle: {
			value: facetsTitle,
		},
		noResultsText: {
			value: `<p>No results found for "${search.originalQuery?.string || search.query?.string}".</p><p>Please try another search.</p>`,
		},
		contentInfo: {
			value: `See ${pagination.totalResults} ${filters.length > 0 ? 'filtered' : ''} result${pagination.totalResults == 1 ? '' : 's'} for "${
				search.query?.string
			}"`,
		},
	};

	//deep merge with props.lang
	const lang = deepmerge(defaultLang, props.lang || {});
	const mergedLang = useLang(lang as any, {
		controller,
	});
	return visible ? (
		<CacheProvider>
			<div
				{...styling}
				className={classnames('ss__autocomplete', className, { 'ss__autocomplete--only-terms': onlyTerms })}
				onClick={(e) => e.stopPropagation()}
				ref={(e) => useA11y(e, 0, true, reset)}
			>
				<span
					role={'link'}
					ref={(e) => useA11y(e)}
					onClick={() => reset()}
					className="ss__autocomplete__close-button"
					style={{ position: 'absolute', top: '-10000000px', left: '-1000000px' }}
					{...mergedLang.closeButton?.all}
				></span>

				{!hideTerms && (showTrending || terms.length > 0 || termsSlot || (!hideHistory && history.length > 0)) && (
					<div className={classnames('ss__autocomplete__terms', { 'ss__autocomplete__terms-trending': showTrending })}>
						{termsSlot ? (
							cloneWithProps(termsSlot, {
								terms,
								trending,
								termsTitle,
								trendingTitle,
								showTrending,
								history,
								historyTitle,
								valueProps,
								emIfy,
								onTermClick,
								controller,
								treePath,
							})
						) : (
							<>
								{terms.length > 0 ? (
									<div className="ss__autocomplete__terms__suggestions">
										{termsTitle || lang.termsTitle.value ? (
											<div className="ss__autocomplete__title ss__autocomplete__title--terms ss__autocomplete__title--suggestions">
												<h5 {...mergedLang.termsTitle?.all}></h5>
											</div>
										) : null}
										<div className="ss__autocomplete__terms__options" role={'list'} aria-label={termsTitle}>
											{terms.map((term, idx) => {
												//initialize lang
												const defaultLang: Partial<AutocompleteLang> = {
													suggestionsTerm: {
														attributes: {
															'aria-label': `item ${idx + 1} of ${terms.length}, ${term.value}`,
														},
													},
												};

												//deep merge with props.lang
												const suggestionLang = deepmerge(defaultLang, props.lang || {});
												const suggestionTermLangObj = useLang(suggestionLang as any, {
													controller,
													term,
													index: idx,
												});

												return (
													<div
														className={classnames('ss__autocomplete__terms__option', {
															'ss__autocomplete__terms__option--active': term.active,
														})}
													>
														<a
															onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => termClickEvent(e)}
															href={term.url.href}
															{...createHoverProps(term.preview)}
															role="link"
															{...suggestionTermLangObj.suggestionsTerm?.all}
														>
															{emIfy(term.value, state.input || '')}
														</a>
													</div>
												);
											})}
										</div>
									</div>
								) : null}

								{showTrending && !hideTrending ? (
									<div className="ss__autocomplete__terms__trending">
										{trendingTitle || lang.trendingTitle.value ? (
											<div className="ss__autocomplete__title ss__autocomplete__title--trending">
												<h5 {...mergedLang.trendingTitle?.all}></h5>
											</div>
										) : null}
										<div className="ss__autocomplete__terms__options" role={'list'} aria-label={trendingTitle}>
											{trending.map((term, idx) => {
												//initialize lang
												const defaultLang: Partial<AutocompleteLang> = {
													trendingTerm: {
														attributes: {
															'aria-label': `item ${idx + 1} of ${trending.length}, ${term.value}`,
														},
													},
												};

												//deep merge with props.lang
												const trendingLang = deepmerge(defaultLang, props.lang || {});
												const trendingTermLangObj = useLang(trendingLang as any, {
													controller,
													term,
													index: idx,
												});

												return (
													<div
														className={classnames('ss__autocomplete__terms__option', {
															'ss__autocomplete__terms__option--active': term.active,
														})}
													>
														<a
															onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => termClickEvent(e)}
															href={term.url.href}
															{...createHoverProps(term.preview)}
															role="link"
															{...trendingTermLangObj.trendingTerm?.all}
														>
															{emIfy(term.value, state.input || '')}
														</a>
													</div>
												);
											})}
										</div>
									</div>
								) : null}

								{showHistory && !hideHistory ? (
									<div className="ss__autocomplete__terms__history">
										{historyTitle || lang.historyTitle.value ? (
											<div className="ss__autocomplete__title ss__autocomplete__title--history">
												<h5 {...mergedLang.historyTitle?.all}></h5>
											</div>
										) : null}
										<div className="ss__autocomplete__terms__options" role={'list'} aria-label={historyTitle}>
											{history.map((term, idx) => {
												//initialize lang
												const defaultLang: Partial<AutocompleteLang> = {
													historyTerm: {
														attributes: {
															'aria-label': `item ${idx + 1} of ${history.length}, ${term.value}`,
														},
													},
												};

												//deep merge with props.lang
												const historyLang = deepmerge(defaultLang, props.lang || {});
												const historyTermLangObj = useLang(historyLang as any, {
													controller,
													term,
													index: idx,
												});

												return (
													<div
														className={classnames('ss__autocomplete__terms__option', {
															'ss__autocomplete__terms__option--active': term.active,
														})}
													>
														<a
															onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => termClickEvent(e)}
															href={term.url.href}
															{...createHoverProps(term.preview)}
															role="link"
															{...historyTermLangObj.historyTerm?.all}
														>
															{emIfy(term.value, state.input || '')}
														</a>
													</div>
												);
											})}
										</div>
									</div>
								) : null}
							</>
						)}
					</div>
				)}

				{!hideFacets &&
					(facetsSlot ? (
						<div className="ss__autocomplete__facets">
							{cloneWithProps(facetsSlot, { facets: facetsToShow, merchandising, facetsTitle, hideBanners, controller, valueProps, treePath })}
						</div>
					) : (
						facetsToShow.length > 0 && (
							<>
								{(facetsTitle || lang.facetsTitle.value) && vertical ? (
									<div className={classnames('ss__autocomplete__title', 'ss__autocomplete__title--facets')}>
										<h5 {...mergedLang.facetsTitle?.all}></h5>
									</div>
								) : null}
								<div className="ss__autocomplete__facets">
									{(facetsTitle || lang.facetsTitle.value) && !vertical ? (
										<div className={classnames('ss__autocomplete__title', 'ss__autocomplete__title--facets')}>
											<h5 {...mergedLang.facetsTitle?.all}></h5>
										</div>
									) : null}
									<Facets {...subProps.facets} facets={facetsToShow} />
									{!hideBanners ? <Banner {...subProps.banner} content={merchandising.content} type={ContentType.LEFT} name={'left'} /> : null}
								</div>
							</>
						)
					))}

				{!hideContent ? (
					contentSlot ? (
						<div className="ss__autocomplete__content">
							{cloneWithProps(contentSlot, { results, merchandising, search, pagination, filters, controller, treePath })}
						</div>
					) : showResults ? (
						<div className="ss__autocomplete__content">
							<>
								{!hideBanners ? <Banner {...subProps.banner} content={merchandising.content} type={ContentType.HEADER} name={'header'} /> : null}
								{!hideBanners ? <Banner {...subProps.banner} content={merchandising.content} type={ContentType.BANNER} name={'banner'} /> : null}
								{results.length > 0 ? (
									<div className="ss__autocomplete__content__results">
										{resultsSlot ? (
											cloneWithProps(resultsSlot, { results, contentTitle, controller, treePath })
										) : (
											<>
												{(contentTitle || lang.contentTitle.value) && results.length > 0 ? (
													<div className={classnames('ss__autocomplete__title', 'ss__autocomplete__title--content')}>
														<h5 {...mergedLang.contentTitle?.all}></h5>
													</div>
												) : null}
												<Results results={results} {...subProps.results} controller={controller} />
											</>
										)}
									</div>
								) : (
									<div className="ss__autocomplete__content__no-results">
										{noResultsSlot ? (
											cloneWithProps(noResultsSlot, { search, pagination, controller, treePath })
										) : (
											<div {...mergedLang.noResultsText?.all}></div>
										)}
									</div>
								)}

								{!hideBanners ? <Banner {...subProps.banner} content={merchandising.content} type={ContentType.FOOTER} name={'footer'} /> : null}

								{/* {RecommendationTemplateComponent && recsController?.store?.loaded && (
									<div className="ss__autocomplete__content__recommendations">
										<RecommendationTemplateComponent controller={recsController} />
									</div>
								)} */}

								{!hideLink ? (
									linkSlot ? (
										cloneWithProps(linkSlot, { search, results, pagination, filters, controller, treePath })
									) : search?.query?.string && results.length > 0 ? (
										<div className="ss__autocomplete__content__info">
											<a
												href={state.url.href}
												onClick={() => controller?.setFocused && controller.setFocused()}
												{...mergedLang.contentInfo.attributes}
											>
												<span {...mergedLang.contentInfo.value}></span>
												<Icon {...subProps.icon} />
											</a>
										</div>
									) : null
								) : null}
							</>
						</div>
					) : null
				) : null}
			</div>
		</CacheProvider>
	) : (
		<Fragment></Fragment>
	);
});

const emIfy = (term: string, search: string) => {
	if (term && search) {
		const match = term.match(escapeRegExp(search));
		if (search && term && match && typeof match.index == 'number') {
			const beforeMatch = term.slice(0, match.index);
			const afterMatch = term.slice(match.index + search.length, term.length);
			return (
				<>
					{beforeMatch ? <em>{beforeMatch}</em> : ''}
					{search}
					{afterMatch ? <em>{afterMatch}</em> : ''}
				</>
			);
		}
	}

	return (
		<>
			<em>{term}</em>
		</>
	);
};

const escapeRegExp = (string: string): string => {
	return string?.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

interface AutocompleteSubProps {
	facets: Partial<FacetsProps>;
	banner: Partial<BannerProps>;
	results: Partial<ResultsProps>;
	icon: Partial<IconProps>;
}

export interface AutocompleteProps extends ComponentProps {
	input: Element | string;
	controller: AutocompleteController;
	hideTerms?: boolean;
	hideFacets?: boolean;
	hideContent?: boolean;
	hideBanners?: boolean;
	hideLink?: boolean;
	hideHistory?: boolean;
	hideTrending?: boolean;
	retainHistory?: boolean;
	retainTrending?: boolean;
	horizontalTerms?: boolean;
	vertical?: boolean;
	termsTitle?: string;
	trendingTitle?: string;
	historyTitle?: string;
	facetsTitle?: string;
	contentTitle?: string;
	viewportMaxHeight?: boolean;
	termsSlot?: JSX.Element | JSX.Element[];
	facetsSlot?: JSX.Element | JSX.Element[];
	contentSlot?: JSX.Element | JSX.Element[];
	resultsSlot?: JSX.Element | JSX.Element[];
	noResultsSlot?: JSX.Element | JSX.Element[];
	linkSlot?: JSX.Element | JSX.Element[];
	breakpoints?: BreakpointsProps;
	width?: string;
	resultComponent?: ResultComponent;
	onFacetOptionClick?: (e: React.MouseEvent<Element, MouseEvent>) => void;
	onTermClick?: (e: React.MouseEvent<Element, MouseEvent>) => void;
	templates?: {
		recommendation?: {
			enabled: boolean;
			component?: 'Recommendation'; // Need a type for allowed recommendation component names (that would exist in the library)
			resultComponent?: string;
			config?: Partial<RecommendationControllerConfig>;
		};
	};
	lang?: Partial<AutocompleteLang>;
}

export interface AutocompleteLang {
	termsTitle: Lang<{
		controller: AutocompleteController;
	}>;
	trendingTitle: Lang<{
		controller: AutocompleteController;
	}>;
	historyTitle: Lang<{
		controller: AutocompleteController;
	}>;
	facetsTitle: Lang<{
		controller: AutocompleteController;
	}>;
	contentTitle: Lang<{
		controller: AutocompleteController;
	}>;
	closeButton: Lang<{
		controller: AutocompleteController;
	}>;
	trendingTerm: Lang<{
		controller: AutocompleteController;
		term: Term;
		index: number;
	}>;
	suggestionsTerm: Lang<{
		controller: AutocompleteController;
		term: Term;
		index: number;
	}>;
	historyTerm: Lang<{
		controller: AutocompleteController;
		term: Term;
		index: number;
	}>;
	noResultsText: Lang<{
		controller: AutocompleteController;
	}>;
	contentInfo: Lang<{
		controller: AutocompleteController;
	}>;
}
