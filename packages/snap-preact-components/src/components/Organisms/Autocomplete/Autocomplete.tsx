/** @jsx jsx */
import { h, Fragment, cloneElement } from 'preact';
import { useEffect } from 'preact/hooks';

import { observer } from 'mobx-react-lite';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';

import type { AutocompleteController } from '@searchspring/snap-controller';

import { Icon, IconProps } from '../../Atoms/Icon/Icon';
import { Results, ResultsProp, ResponsiveProps } from '../../Organisms/Results';
import { Banner, BannerProps } from '../../Atoms/Merchandising/Banner';
import { Facet, FacetProps } from '../../Organisms/Facet';
import { defined } from '../../../utilities';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { BannerType, ComponentProps, FacetDisplay } from '../../../types';
import { useDisplaySettings } from '../../../hooks/useDisplaySettings';

const CSS = {
	Autocomplete: ({ inputViewportOffsetBottom, hideFacets, hideTerms, horizontalTerms, noResults, vertical, style, theme }) =>
		css({
			'& *': {
				boxSizing: 'border-box',
			},

			display: 'flex',
			flexDirection: vertical ? 'column' : 'row',
			flexWrap: horizontalTerms && !vertical ? 'wrap' : null,
			position: 'absolute',
			zIndex: '10002',
			border: '1px solid #ebebeb',
			background: '#ffffff',
			maxWidth: '100vw',
			maxHeight: inputViewportOffsetBottom ? `calc(100vh - ${inputViewportOffsetBottom + 10}px)` : '100vh',
			overflowY: horizontalTerms && !vertical ? 'auto' : null,

			'& .ss__autocomplete__terms': {
				flex: `0 1 ${vertical || horizontalTerms ? 'auto' : '150px'}`,
				order: 1,
				background: '#f8f8f8',
				width: horizontalTerms && !vertical ? '100%' : null,

				'& h5': {
					margin: '0',
					padding: '10px',
				},

				'& ul.ss__autocomplete__terms__options': {
					display: vertical || horizontalTerms ? 'flex' : null,
					justifyContent: 'space-evenly',
					flexWrap: 'wrap',
					listStyle: 'none',
					padding: '0',
					margin: '0',

					'& li.ss__autocomplete__terms__option': {
						flexGrow: vertical || horizontalTerms ? '1' : null,
						textAlign: vertical || horizontalTerms ? 'center' : null,
						wordBreak: 'break-all',

						'& a': {
							display: 'block',
							padding: vertical || horizontalTerms ? '10px 30px' : '10px',

							'& .ss__autocomplete__terms__option--underline': {
								textDecoration: 'underline',
							},
							'& em': {
								fontStyle: 'normal',
							},
						},

						'&.ss__autocomplete__terms__option--active': {
							background: '#fff',
							fontWeight: 'bold',

							'& a': {
								color: theme?.colors?.primary,
							},
						},
					},
				},
			},

			'& .ss__autocomplete__facets': {
				display: 'flex',
				flex: `0 0 ${horizontalTerms && !vertical && !hideTerms ? '200px' : 'auto'}`,
				flexDirection: vertical ? 'row' : 'column',
				justifyContent: vertical ? 'space-between' : null,
				columnGap: '20px',
				order: 2,
				padding: vertical ? '10px 20px' : '10px',
				overflowY: vertical ? null : 'auto',
			},
			'& .ss__autocomplete__content': {
				display: 'flex',
				flex: `1 1 ${hideFacets ? 'auto' : '0%'}`,
				flexDirection: 'column',
				justifyContent: 'space-between',
				order: 3,
				overflowY: 'auto',
				margin: noResults ? '0 auto' : null,

				'& .ss__autocomplete__content__info': {
					fontWeight: 'bold',
					padding: '10px',
					textAlign: 'right',

					'& a': {
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
		// global theme
		...globalTheme?.components?.autocomplete,
		// props
		...properties,
		...properties.theme?.components?.autocomplete,
	};

	//passed in or default responsive result props
	const responsive = props.responsive || {
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
			columns: 4,
			rows: 1,
			vertical: true,
		},
		991: {
			columns: 2,
			rows: 2,
		},
	};
	const displaySettings = useDisplaySettings(responsive);
	if (displaySettings && Object.keys(displaySettings).length) {
		props = {
			...props,
			...displaySettings,
		};
	}
	const { hideFacets, hideTerms, horizontalTerms, vertical, termsSlot, facetsSlot, contentSlot, disableStyles, className, style, controller } = props;
	let { input } = props;
	let inputViewportOffsetBottom;
	if (input) {
		let rect;
		if (typeof input === 'string') {
			rect = document.querySelector(input)?.getBoundingClientRect();
		} else {
			rect = (input as Element)?.getBoundingClientRect();
		}
		inputViewportOffsetBottom = rect?.bottom || 0;
	}
	const subProps: AutocompleteSubProps = {
		facet: {
			// default props
			className: 'ss__autocomplete__facet',
			limit: 6,
			disableOverflow: true,
			disableCollapse: true,
			// global theme
			...globalTheme?.components?.facet,
			// inherited props
			...defined({
				disableStyles,
			}),
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
			// component theme overrides
			...props.theme?.components?.facet,
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
			...props.theme?.components?.banner,
		},
		results: {
			// default props
			className: 'ss__autocomplete__results',
			responsive: responsive,
			// global theme
			...globalTheme?.components?.results,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			...props.theme?.components?.results,
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
			...props.theme?.components?.icon,
		},
	};

	const { search, terms, trending, results, merchandising, pagination, filters, facets, state } = controller.store;

	// you can pass in a selector or the actual input element,
	// if its the selector, we need to bind it to the controller here.
	if (controller && typeof input == 'string') {
		input = document.querySelector(input);
		// only bind on componentdidmount
		useEffect(() => {
			controller.bind();
		}, []);
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

	const visible = Boolean(input === state.focusedInput) && (terms.length > 0 || trending?.length > 0);
	const showTrending = trending?.length && terms.length === 0;
	const facetsToShow = facets.length && facets.filter((facet) => facet.display !== FacetDisplay.SLIDER).slice(0, 3);

	return (
		visible && (
			<CacheProvider>
				<div
					css={
						!disableStyles &&
						CSS.Autocomplete({
							inputViewportOffsetBottom,
							hideFacets,
							horizontalTerms,
							hideTerms,
							noResults: search?.query?.string && results.length === 0,
							vertical,
							style,
							theme,
						})
					}
					className={classnames('ss__autocomplete', className)}
					onClick={(e) => e.stopPropagation()}
				>
					{!hideTerms &&
						(termsSlot ? (
							cloneElement(termsSlot, { terms, trending })
						) : (
							<div className="ss__autocomplete__terms">
								{showTrending && <h5>Popular Searches</h5>}
								<ul className="ss__autocomplete__terms__options">
									{(showTrending ? trending : terms).map((term) => (
										<li className={classnames('ss__autocomplete__terms__option', { 'ss__autocomplete__terms__option--active': term.active })}>
											<a href={term.url.href} {...valueProps} onFocus={() => term.preview()}>
												{emIfy(term.value, state.input)}
											</a>
										</li>
									))}
								</ul>
							</div>
						))}

					{!hideFacets &&
						facetsToShow.length &&
						(facetsSlot ? (
							cloneElement(facetsSlot, { facets: facetsToShow, merchandising, controller })
						) : (
							<div className="ss__autocomplete__facets">
								{facetsToShow.map((facet) => (
									<Facet {...subProps.facet} facet={facet} previewOnFocus={true} valueProps={valueProps} />
								))}
								<Banner content={merchandising.content} type={BannerType.LEFT} />
							</div>
						))}
					{contentSlot ? (
						cloneElement(contentSlot, { results, merchandising, search, pagination, filters, controller })
					) : (
						<div className="ss__autocomplete__content">
							{results.length > 0 || Object.keys(merchandising.content).length > 0 ? (
								<div className="ss__autocomplete__content__results">
									<Banner content={merchandising.content} type={BannerType.HEADER} />
									<Banner content={merchandising.content} type={BannerType.BANNER} />
									<Results results={results} {...subProps.results} controller={controller} />
									<Banner content={merchandising.content} type={BannerType.FOOTER} />
								</div>
							) : null}
							{search?.query?.string ? (
								<div className="ss__autocomplete__content__info">
									{results.length === 0 ? (
										<>
											<p>No results found for "{search.query.string}".</p>
											<p>Please try another search.</p>
										</>
									) : (
										<a href={state.url.href}>
											See {pagination.totalResults} {filters.length > 0 ? 'filtered' : ''} result{pagination.totalResults > 1 ? 's' : ''} for "
											{search.query.string}"
											<Icon {...subProps.icon} />
										</a>
									)}
								</div>
							) : null}
						</div>
					)}
				</div>
			</CacheProvider>
		)
	);
});

const emIfy = (term, search) => {
	const match = term.match(search);
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

interface AutocompleteSubProps {
	facet: FacetProps;
	banner: BannerProps;
	results: ResultsProp;
	icon: IconProps;
}

export interface AutocompleteProps extends ComponentProps {
	input: Element | string;
	hideFacets?: boolean;
	hideTerms?: boolean;
	horizontalTerms?: boolean;
	vertical?: boolean;
	termsSlot?: JSX.Element;
	facetsSlot?: JSX.Element;
	contentSlot?: JSX.Element;
	responsive?: ResponsiveProps;
	controller?: AutocompleteController;
}
