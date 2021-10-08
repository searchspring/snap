/** @jsx jsx */
import { h, Fragment, cloneElement } from 'preact';
import { useEffect } from 'preact/hooks';

import { observer } from 'mobx-react-lite';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';

import type { AutocompleteController } from '@searchspring/snap-controller';

import { Icon, IconProps } from '../../Atoms/Icon/Icon';
import { Results, ResultsProp, BreakpointsProps } from '../../Organisms/Results';
import { Banner, BannerProps } from '../../Atoms/Merchandising/Banner';
import { Facets, FacetsProps } from '../../Organisms/Facets';
import { defined, cloneWithProps } from '../../../utilities';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { BannerType, ComponentProps, FacetDisplay } from '../../../types';
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
		style,
		theme,
	}) =>
		css({
			'&, & *, & *:before, & *:after': {
				boxSizing: 'border-box',
			},

			display: 'flex',
			flexDirection: vertical ? 'column' : 'row',
			flexWrap: horizontalTerms && !vertical ? 'wrap' : null,
			position: 'absolute',
			zIndex: '10002',
			border: '1px solid #ebebeb',
			background: '#ffffff',
			width: width,
			maxWidth: '100vw',
			maxHeight: viewportMaxHeight && inputViewportOffsetBottom ? `calc(100vh - ${inputViewportOffsetBottom + 10}px)` : null,
			overflowY: viewportMaxHeight && horizontalTerms && !vertical ? 'scroll' : null,

			'&.ss__autocomplete--only-terms': {
				width: `${vertical || horizontalTerms || contentSlotExists ? width : '150px'}`,
			},

			'.ss__autocomplete__title--trending': {
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
				order: vertical ? 2 : null,
			},

			'& .ss__autocomplete__terms': {
				// flex: `0 0 ${vertical || horizontalTerms || showTrending ? 'auto' : '150px'}`,
				// order: 1,
				// background: '#f8f8f8',
				// width: horizontalTerms && !vertical ? '100%' : null,
				flex: `1 1 auto`,
				maxWidth: `${vertical || horizontalTerms ? 'auto' : '150px'}`,
				order: 1,
				background: '#f8f8f8',
				// width: horizontalTerms && !vertical ? '100%' : null,

				'& .ss__autocomplete__terms__options': {
					display: vertical || horizontalTerms ? 'flex' : null,
					justifyContent: 'space-evenly',
					flexWrap: 'wrap',

					'& .ss__autocomplete__terms__option': {
						flexGrow: vertical || horizontalTerms ? '1' : null,
						textAlign: vertical || horizontalTerms ? 'center' : null,
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
				overflowY: vertical ? null : 'auto',
				'& .ss__autocomplete__facet': {
					flex: vertical ? '0 1 150px' : null,
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
				margin: noResults ? '0 auto' : null,
				padding: vertical ? '10px 20px' : '10px',

				'& .ss__banner.ss__banner--header, .ss__banner.ss__banner--banner': {
					marginBottom: '10px',
				},
				'& .ss__banner.ss__banner--footer': {
					margin: '10px 0',
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

			...style,
		}),
};

export const Autocomplete = observer((properties: AutocompleteProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const theme = { ...globalTheme, ...properties.theme };

	let props: AutocompleteProps = {
		// default props
		termsTitle: '',
		trendingTitle: 'Popular Searches',
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
			hideFacets: true,
			vertical: true,
		},
		540: {
			columns: 3,
			rows: 1,
			vertical: true,
		},
		768: {
			columns: 2,
			rows: 2,
		},
	};
	const displaySettings = useDisplaySettings(breakpoints);
	if (displaySettings && Object.keys(displaySettings).length) {
		props = {
			...props,
			...displaySettings,
		};
	}
	const {
		hideTerms,
		hideFacets,
		hideContent,
		hideBanners,
		horizontalTerms,
		vertical,
		termsTitle,
		trendingTitle,
		facetsTitle,
		contentTitle,
		viewportMaxHeight,
		termsSlot,
		facetsSlot,
		contentSlot,
		resultsSlot,
		noResultsSlot,
		disableStyles,
		className,
		width,
		style,
		controller,
	} = props;
	let { input } = props;
	let inputViewportOffsetBottom;
	if (input) {
		if (typeof input === 'string') {
			input = document.querySelector(input) as Element;
		}
		const rect = input?.getBoundingClientRect();
		inputViewportOffsetBottom = rect?.bottom || 0;
		input?.setAttribute('spellcheck', 'false');
		input?.setAttribute('autocomplete', 'off');
	}
	let delayTimeout;
	const delayTime = 333;
	const valueProps = {
		onMouseEnter: (e) => {
			clearTimeout(delayTimeout);
			delayTimeout = setTimeout(() => {
				e.target.focus();
			}, delayTime);
		},
		onMouseLeave: () => {
			clearTimeout(delayTimeout);
		},
	};

	const subProps: AutocompleteSubProps = {
		facets: {
			// default props
			className: 'ss__autocomplete__facets',
			// global theme
			...globalTheme?.components?.facet,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: {
				components: {
					facet: {
						className: 'ss__autocomplete__facet',
						limit: 6,
						disableOverflow: true,
						disableCollapse: true,
						previewOnFocus: true,
						valueProps,
						theme: {
							components: {
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
							},
						},
					},
					...props.theme?.components,
				},
			},
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
			theme: {
				components: {
					result: {
						hideBadge: true,
					},
					...props.theme?.components,
				},
			},
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

	// you can pass in a selector or the actual input element,
	// if its the selector, we need to bind it to the controller here.
	if (controller && typeof input == 'string') {
		input = document.querySelector(input);
		// only bind on componentdidmount
		useEffect(() => {
			controller.bind();
		}, []);
	}

	const visible = Boolean(input === state.focusedInput) && (terms.length > 0 || trending?.length > 0);
	const showTrending = trending?.length && terms.length === 0;
	const facetsToShow = facets.length && facets.filter((facet) => facet.display !== FacetDisplay.SLIDER);
	const onlyTerms = trending?.length && !loaded;

	const styling: { css?: any } = {};
	if (!disableStyles) {
		styling.css = [
			CSS.Autocomplete({
				inputViewportOffsetBottom,
				hideFacets,
				horizontalTerms,
				noResults: search?.query?.string && results.length === 0,
				contentSlotExists: contentSlot ? true : false,
				viewportMaxHeight,
				vertical,
				width,
				style,
				theme,
			}),
			style,
		];
	} else if (style) {
		styling.css = [style];
	}

	return (
		visible && (
			<CacheProvider>
				<div
					{...styling}
					className={classnames('ss__autocomplete', className, { 'ss__autocomplete--only-terms': onlyTerms })}
					onClick={(e) => e.stopPropagation()}
				>
					{!hideTerms && (
						<div className={classnames('ss__autocomplete__terms', { 'ss__autocomplete__terms-trending': showTrending })}>
							{termsSlot ? (
								cloneWithProps(termsSlot, { terms, trending, controller })
							) : (
								<>
									{terms.length > 0 ? (
										<>
											{termsTitle ? (
												<div className="ss__autocomplete__title ss__autocomplete__title--terms">
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
														<a href={term.url.href} {...valueProps} onFocus={() => term.preview()}>
															{emIfy(term.value, state.input)}
														</a>
													</div>
												))}
											</div>
										</>
									) : null}

									{showTrending ? (
										<>
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
														<a href={term.url.href} {...valueProps} onFocus={() => term.preview()}>
															{emIfy(term.value, state.input)}
														</a>
													</div>
												))}
											</div>
										</>
									) : null}
								</>
							)}
						</div>
					)}

					{!hideFacets &&
						(facetsSlot ? (
							<div className="ss__autocomplete__facets">
								{cloneWithProps(facetsSlot, { facets: facetsToShow, merchandising, controller, valueProps })}
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
										<Facets {...subProps.facets} facets={facetsToShow} limit={3} />
										{!hideBanners ? <Banner content={merchandising.content} type={BannerType.LEFT} /> : null}
									</div>
								</>
							)
						))}

					{!hideContent ? (
						contentSlot ? (
							<div className="ss__autocomplete__content">
								{cloneElement(contentSlot, { results, merchandising, search, pagination, filters, controller })}
							</div>
						) : results.length > 0 || Object.keys(merchandising.content).length > 0 || search?.query?.string ? (
							<div className="ss__autocomplete__content">
								{!hideBanners ? <Banner content={merchandising.content} type={BannerType.HEADER} /> : null}
								{!hideBanners ? <Banner content={merchandising.content} type={BannerType.BANNER} /> : null}
								{results.length > 0 ? (
									<div className="ss__autocomplete__content__results">
										{resultsSlot ? (
											cloneElement(resultsSlot, { results, contentTitle, controller })
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
											cloneElement(noResultsSlot, { search, pagination, controller })
										) : (
											<>
												<p>No results found for "{search.query.string}".</p>
												<p>Please try another search.</p>
											</>
										)}
									</div>
								)}

								{!hideBanners ? <Banner content={merchandising.content} type={BannerType.FOOTER} /> : null}

								{search?.query?.string && results.length > 0 ? (
									<div className="ss__autocomplete__content__info">
										<a href={state.url.href}>
											See {pagination.totalResults} {filters.length > 0 ? 'filtered' : ''} result{pagination.totalResults == 1 ? '' : 's'} for "
											{search.query.string}"
											<Icon {...subProps.icon} />
										</a>
									</div>
								) : null}
							</div>
						) : null
					) : null}
				</div>
			</CacheProvider>
		)
	);
});

const emIfy = (term, search) => {
	const match = term.match(escapeRegExp(search));
	if (search && term && match) {
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
	hideTerms?: boolean;
	hideFacets?: boolean;
	hideContent?: boolean;
	hideBanners?: boolean;
	horizontalTerms?: boolean;
	vertical?: boolean;
	termsTitle?: string;
	trendingTitle?: string;
	facetsTitle?: string;
	contentTitle?: string;
	viewportMaxHeight?: boolean;
	termsSlot?: JSX.Element;
	facetsSlot?: JSX.Element;
	contentSlot?: JSX.Element;
	resultsSlot?: JSX.Element;
	noResultsSlot?: JSX.Element;
	breakpoints?: BreakpointsProps;
	controller?: AutocompleteController;
	width?: string;
}
