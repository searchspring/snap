/** @jsx jsx */
import { h, Fragment } from 'preact';
import { useEffect } from 'preact/hooks';

import { observer } from 'mobx-react-lite';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import deepmerge from 'deepmerge';

import type { AutocompleteController } from '@searchspring/snap-controller';
import { ContentType } from '@searchspring/snap-store-mobx';

import { Icon, IconProps } from '../../Atoms/Icon/Icon';
import { Results, ResultsProp } from '../../Organisms/Results';
import { Banner, BannerProps } from '../../Atoms/Merchandising/Banner';
import { Facets, FacetsProps } from '../../Organisms/Facets';
import { defined, cloneWithProps } from '../../../utilities';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, FacetDisplay, BreakpointsProps, StylingCSS } from '../../../types';
import { useDisplaySettings } from '../../../hooks/useDisplaySettings';

const CSS = {
	Autocomplete: ({
		inputViewportOffsetBottom,
		hideFacets,
		horizontalTerms,
		noResults,
		contentSlotExists,
		viewportMaxHeight,
		vertical,
		width,
		theme,
	}: Partial<AutocompleteProps> & { inputViewportOffsetBottom: number; noResults: boolean; contentSlotExists: boolean }) =>
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

			'&.ss__autocomplete--only-terms': {
				width: `${vertical || horizontalTerms || contentSlotExists ? width : '150px'}`,
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
				flex: `1 1 auto`,
				maxWidth: `${vertical || horizontalTerms ? 'auto' : '150px'}`,
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
								color: theme?.colors?.primary,
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
						color: theme?.colors?.primary,

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

	let props: AutocompleteProps = {
		// default props
		termsTitle: '',
		trendingTitle: 'Popular Searches',
		historyTitle: 'Previously Searched',
		facetsTitle: '',
		contentTitle: '',
		width: '100%',
		// global theme
		...globalTheme?.components?.autocomplete,
		// props
		...properties,
		...properties.theme?.components?.autocomplete,
	};

	//passed in or default breakpoints result props
	const breakpoints = props.breakpoints || {
		0: {
			columns: 2,
			rows: 1,
			hideFacets: props.hideFacets || true,
			vertical: props.vertical || true,
			hideHistory: props.hideHistory || true,
			hideTrending: props.hideTrending || true,
		},
		540: {
			columns: 3,
			rows: 1,
			vertical: props.vertical || true,
			hideHistory: props.hideHistory || true,
			hideTrending: props.hideTrending || true,
		},
		768: {
			columns: 2,
			rows: 3,
		},
	};

	let delayTimeout: number;
	const delayTime = 333;
	const valueProps = {
		onMouseEnter: (e: React.MouseEvent<HTMLAnchorElement>) => {
			clearTimeout(delayTimeout);
			delayTimeout = window.setTimeout(() => {
				(e.target as HTMLAnchorElement).focus();
			}, delayTime);
		},
		onMouseLeave: () => {
			clearTimeout(delayTimeout);
		},
	};

	const themeOverride: Theme = {
		components: {
			facet: {
				limit: 6,
				disableOverflow: true,
				disableCollapse: true,
				previewOnFocus: true,
				valueProps,
			},
			facetGridOptions: {
				columns: 3,
				onClick: properties.onFacetOptionClick,
			},
			facetHierarchyOptions: {
				hideCount: true,
				onClick: properties.onFacetOptionClick,
			},
			facetListOptions: {
				hideCheckbox: true,
				hideCount: true,
				onClick: properties.onFacetOptionClick,
			},
			facetPaletteOptions: {
				hideLabel: true,
				columns: 3,
				onClick: properties.onFacetOptionClick,
			},
			result: {
				hideBadge: true,
			},
		},
	};

	const displaySettings = useDisplaySettings(breakpoints) || {};
	const theme = deepmerge(themeOverride, deepmerge(props?.theme || {}, displaySettings?.theme || {}));
	props = {
		...props,
		...displaySettings,
		theme,
	};
	let input: String | Element | null = props.input;
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
		horizontalTerms,
		vertical,
		termsTitle,
		trendingTitle,
		historyTitle,
		facetsTitle,
		contentTitle,
		viewportMaxHeight,
		termsSlot,
		facetsSlot,
		contentSlot,
		resultsSlot,
		noResultsSlot,
		linkSlot,
		onTermClick,
		disableStyles,
		className,
		width,
		style,
		controller,
	} = props;

	const subProps: AutocompleteSubProps = {
		facets: {
			// default props
			limit: 3,
			// global theme
			...globalTheme?.components?.facets,
			// inherited props
			...defined({
				disableStyles,
			}),
			theme: props.theme,
		},
		banner: {
			// default props
			className: 'ss__autocomplete__banner',
			// global theme
			...globalTheme?.components?.banner,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props.theme,
		},
		results: {
			// default props
			className: 'ss__autocomplete__results',
			breakpoints: breakpoints,
			// global theme
			...globalTheme?.components?.results,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props.theme,
		},
		icon: {
			// default props
			className: 'ss__autocomplete__icon',
			icon: 'angle-right',
			size: '10px',
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

	const { search, terms, trending, results, merchandising, pagination, loaded, filters, facets, state } = controller.store;
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

	let showTrending = false;
	if (trending?.length && (retainTrending || (!results.length && !state.input))) {
		showTrending = true;
	} else if (trending?.length && !terms.length) {
		// has results and trending -> show trending terms while term load
		showTrending = true;
	}

	let showHistory = false;
	if (history?.length && (retainHistory || (!results.length && !state.input))) {
		showHistory = true;
	} else if (history?.length && !terms.length) {
		// has results and trending -> show trending terms while term load
		showHistory = true;
	}

	const facetsToShow = facets.length ? facets.filter((facet) => facet.display !== FacetDisplay.SLIDER) : [];
	const onlyTerms = trending?.length && !loaded;

	const styling: { css?: StylingCSS } = {};
	if (!disableStyles) {
		styling.css = [
			CSS.Autocomplete({
				inputViewportOffsetBottom,
				hideFacets,
				horizontalTerms,
				noResults: Boolean(search?.query?.string && results.length === 0),
				contentSlotExists: Boolean(contentSlot),
				viewportMaxHeight,
				vertical,
				width,
				theme,
			}),
			style,
		];
	} else if (style) {
		styling.css = [style];
	}

	return visible ? (
		<CacheProvider>
			<div
				{...styling}
				className={classnames('ss__autocomplete', className, { 'ss__autocomplete--only-terms': onlyTerms })}
				onClick={(e) => e.stopPropagation()}
			>
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
							})
						) : (
							<>
								{terms.length > 0 ? (
									<div className="ss__autocomplete__terms__suggestions">
										{termsTitle ? (
											<div className="ss__autocomplete__title ss__autocomplete__title--terms ss__autocomplete__title--suggestions">
												<h5>{termsTitle}</h5>
											</div>
										) : null}
										<div className="ss__autocomplete__terms__options">
											{terms.map((term) => (
												<div
													className={classnames('ss__autocomplete__terms__option', {
														'ss__autocomplete__terms__option--active': term.active,
													})}
												>
													<a
														onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => onTermClick && onTermClick(e)}
														href={term.url.href}
														{...valueProps}
														onFocus={() => term.preview()}
													>
														{emIfy(term.value, state.input || '')}
													</a>
												</div>
											))}
										</div>
									</div>
								) : null}

								{showTrending && !hideTrending ? (
									<div className="ss__autocomplete__terms__trending">
										{trendingTitle ? (
											<div className="ss__autocomplete__title ss__autocomplete__title--trending">
												<h5>{trendingTitle}</h5>
											</div>
										) : null}
										<div className="ss__autocomplete__terms__options">
											{trending.map((term) => (
												<div
													className={classnames('ss__autocomplete__terms__option', {
														'ss__autocomplete__terms__option--active': term.active,
													})}
												>
													<a
														onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => onTermClick && onTermClick(e)}
														href={term.url.href}
														{...valueProps}
														onFocus={() => term.preview()}
													>
														{emIfy(term.value, state.input || '')}
													</a>
												</div>
											))}
										</div>
									</div>
								) : null}

								{showHistory && !hideHistory ? (
									<div className="ss__autocomplete__terms__history">
										{historyTitle ? (
											<div className="ss__autocomplete__title ss__autocomplete__title--history">
												<h5>{historyTitle}</h5>
											</div>
										) : null}
										<div className="ss__autocomplete__terms__options">
											{history.map((term) => (
												<div
													className={classnames('ss__autocomplete__terms__option', {
														'ss__autocomplete__terms__option--active': term.active,
													})}
												>
													<a
														onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => onTermClick && onTermClick(e)}
														href={term.url.href}
														{...valueProps}
														onFocus={() => term.preview()}
													>
														{emIfy(term.value, state.input || '')}
													</a>
												</div>
											))}
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
							{cloneWithProps(facetsSlot, { facets: facetsToShow, merchandising, facetsTitle, hideBanners, controller, valueProps })}
						</div>
					) : (
						facetsToShow.length > 0 && (
							<>
								{facetsTitle && vertical ? (
									<div className={classnames('ss__autocomplete__title', 'ss__autocomplete__title--facets')}>
										<h5>{facetsTitle}</h5>
									</div>
								) : null}
								<div className="ss__autocomplete__facets">
									{facetsTitle && !vertical ? (
										<div className={classnames('ss__autocomplete__title', 'ss__autocomplete__title--facets')}>
											<h5>{facetsTitle}</h5>
										</div>
									) : null}
									<Facets {...subProps.facets} facets={facetsToShow} />
									{!hideBanners ? <Banner {...subProps.banner} content={merchandising.content} type={ContentType.LEFT} /> : null}
								</div>
							</>
						)
					))}

				{!hideContent ? (
					contentSlot ? (
						<div className="ss__autocomplete__content">
							{cloneWithProps(contentSlot, { results, merchandising, search, pagination, filters, controller })}
						</div>
					) : results.length > 0 || Object.keys(merchandising.content).length > 0 || search?.query?.string ? (
						<div className="ss__autocomplete__content">
							<>
								{!hideBanners ? <Banner {...subProps.banner} content={merchandising.content} type={ContentType.HEADER} /> : null}
								{!hideBanners ? <Banner {...subProps.banner} content={merchandising.content} type={ContentType.BANNER} /> : null}
								{results.length > 0 ? (
									<div className="ss__autocomplete__content__results">
										{resultsSlot ? (
											cloneWithProps(resultsSlot, { results, contentTitle, controller })
										) : (
											<>
												{contentTitle && results.length > 0 ? (
													<div className={classnames('ss__autocomplete__title', 'ss__autocomplete__title--content')}>
														<h5>{contentTitle}</h5>
													</div>
												) : null}
												<Results results={results} {...subProps.results} controller={controller} />
											</>
										)}
									</div>
								) : (
									<div className="ss__autocomplete__content__no-results">
										{noResultsSlot ? (
											cloneWithProps(noResultsSlot, { search, pagination, controller })
										) : (
											<>
												<p>No results found for "{search.originalQuery?.string || search.query?.string}".</p>
												<p>Please try another search.</p>
											</>
										)}
									</div>
								)}

								{!hideBanners ? <Banner {...subProps.banner} content={merchandising.content} type={ContentType.FOOTER} /> : null}

								{!hideLink ? (
									linkSlot ? (
										cloneWithProps(linkSlot, { search, results, pagination, filters, controller })
									) : search?.query?.string && results.length > 0 ? (
										<div className="ss__autocomplete__content__info">
											<a href={state.url.href}>
												See {pagination.totalResults} {filters.length > 0 ? 'filtered' : ''} result{pagination.totalResults == 1 ? '' : 's'} for "
												{search.query.string}"
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
		if (search && term && match && match.index) {
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
	facets: FacetsProps;
	banner: BannerProps;
	results: ResultsProp;
	icon: IconProps;
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
	termsSlot?: JSX.Element;
	facetsSlot?: JSX.Element;
	contentSlot?: JSX.Element;
	resultsSlot?: JSX.Element;
	noResultsSlot?: JSX.Element;
	linkSlot?: JSX.Element;
	breakpoints?: BreakpointsProps;
	width?: string;
	onFacetOptionClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
	onTermClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
}
