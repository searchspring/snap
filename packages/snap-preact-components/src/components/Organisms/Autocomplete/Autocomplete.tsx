/** @jsx jsx */
import { h, Fragment } from 'preact';
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
import { Theme, useTheme } from '../../../providers/theme';
import { BannerType, ComponentProps, FacetDisplay } from '../../../types';

const CSS = {
	Autocomplete: ({ inputViewportOffsetBottom, hideTerms, hideFacets, justTrending, style, theme }) =>
		css({
			position: 'absolute',
			zIndex: '10002',
			border: '1px solid #ebebeb',
			background: '#ffffff',
			maxWidth: '100vw',
			maxHeight: inputViewportOffsetBottom ? `calc(100vh - ${inputViewportOffsetBottom + 10}px)` : '100vh',
			display: justTrending ? 'inline-block' : 'flex',

			'& *': {
				boxSizing: 'border-box',
			},
			'& .ss__autocomplete__terms': {
				width: '150px',
				background: '#f8f8f8',

				'& h5': {
					margin: '0',
					padding: '10px',
				},
				'& ul.ss__autocomplete__terms__options': {
					listStyle: 'none',
					padding: '0',
					margin: '0',
					flexWrap: 'wrap',
					color: '#515151',

					'& li.ss__autocomplete__terms__option': {
						'&:hover': {
							background: '#f5f5f5',
						},
						'& a': {
							display: 'block',
							padding: '10px',

							'& .ss__autocomplete__terms__option--underline': {
								textDecoration: 'underline',
							},
						},
						'&.ss__autocomplete__terms__option--active': {
							background: '#fff',
							fontWeight: 'bold',
							color: theme?.colors?.primary,
						},
					},
				},
			},
			'& .ss__autocomplete__content': {
				display: justTrending ? 'none' : 'flex',
				width: hideTerms ? '100%' : 'calc(100% - 150px)',

				'& .ss__autocomplete__content__facets': {
					width: '200px',
					padding: '10px',
					display: 'flex',
					flexDirection: 'column',
					overflowY: 'auto',
				},
				'& .ss__autocomplete__content__results': {
					width: hideFacets ? '100%' : 'calc(100% - 200px)',
					padding: '10px',

					'& .ss__autocomplete__content__results__wrapper': {
						maxHeight: 'calc(100% - 50px)',
						overflowY: 'auto',
					},
					'& .ss__autocomplete__content__results__info': {
						textAlign: 'right',
						fontWeight: 'bold',
						color: theme?.colors?.primary,

						'& p': {
							'& a': {
								'& .ss__icon': {
									verticalAlign: 'bottom',
									marginLeft: '5px',
								},
							},
						},
					},
				},
			},
			'@media (max-width: 991px)': {
				flexDirection: 'column',

				'& .ss__autocomplete__content': {
					width: '100%',

					'& .ss__autocomplete__content__facets': {
						display: 'none',
					},
					'& .ss__autocomplete__content__results': {
						width: '100%',
					},
				},
				'& .ss__autocomplete__terms': {
					width: '100%',
					border: 'none',

					'& ul.ss__autocomplete__terms__options': {
						display: 'flex',
						justifyContent: 'space-evenly',

						'& li.ss__autocomplete__terms__option': {
							flexGrow: '1',
							textAlign: 'center',

							'& a': {
								padding: '10px 30px',
							},
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

	const props: AutocompleteProps = {
		// default props
		// global theme
		...globalTheme?.components?.autocomplete,
		// props
		...properties,
		...properties.theme?.components?.autocomplete,
	};

	const { hideFacets, hideTerms, disableStyles, className, style, controller } = props;

	let { input } = props;

	//passed in or default responsive result props
	const responsive = props.responsive || {
		0: {
			numAcross: 2,
			numRows: 1,
		},
		540: {
			numAcross: 3,
			numRows: 1,
		},
		768: {
			numAcross: 4,
			numRows: 1,
		},
		991: {
			numAcross: 2,
			numRows: 2,
		},
	};

	const subProps: AutocompleteSubProps = {
		facet: {
			// default props
			className: 'ss__autocomplete__facet',
			// global theme
			...globalTheme?.components?.facet,
			// inherited props
			...defined({
				disableStyles,
				disableCollapse: true,
			}),
			facetListOptions: {
				hideCheckbox: true,
				hideCount: true,
			},
			facetPaletteOptions: {
				hideLabel: true,
			},
			facetHierarchyOptions: {
				hideCount: true,
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

	//you can pass in a selector or the actual input element,
	//if its the selector, we need to bind it to the controller here.
	if (controller && typeof input == 'string') {
		input = document.querySelector(input);
		//only bind on componentdidmount
		useEffect(() => {
			//run bind
			controller.bind();
		}, []);
	}

	let delayTimeout;
	const delayTime = 200;
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

	let inputViewportOffsetBottom;
	if (input) {
		inputViewportOffsetBottom = (input as Element).getBoundingClientRect().bottom;
	}
	const visible = Boolean(input === state.focusedInput) && (terms.length > 0 || trending?.length > 0);
	const showTrending = trending?.length && !terms.length;
	const justTrending = showTrending && facets.length === 0 && terms.length === 0 && !(results.length === 0 && state.input?.length);
	return (
		visible && (
			<div
				css={CSS.Autocomplete({ inputViewportOffsetBottom, justTrending, hideTerms, hideFacets, style, theme })}
				className={classnames('ss__autocomplete', className)}
				onClick={(e) => e.stopPropagation()}
			>
				{!hideTerms && (
					<div className="ss__autocomplete__terms">
						{showTrending && <h5>Popular Searches</h5>}
						<ul className="ss__autocomplete__terms__options">
							{(showTrending ? trending : terms).map((term) => (
								<li className={classnames('ss__autocomplete__terms__option', { 'ss__autocomplete__terms__option--active': term.active })}>
									<a href={term.url.href} {...valueProps} onFocus={() => term.preview()}>
										{term.value}
									</a>
								</li>
							))}
						</ul>
					</div>
				)}

				<div className="ss__autocomplete__content">
					{!hideFacets && facets.length ? (
						<div className="ss__autocomplete__content__facets">
							{facets
								.filter((facet) => facet.display !== FacetDisplay.SLIDER)
								.slice(0, 3)
								.map((facet) => (
									<Facet {...subProps.facet} facet={facet} previewOnFocus={true} valueProps={valueProps} />
								))}
							<Banner content={merchandising.content} type={BannerType.LEFT} />
						</div>
					) : null}
					<div className="ss__autocomplete__content__results">
						<div className="ss__autocomplete__content__results__wrapper">
							<Banner content={merchandising.content} type={BannerType.HEADER} />
							<Banner content={merchandising.content} type={BannerType.BANNER} />
							<Results results={results} {...subProps.results} controller={controller} />
							<Banner content={merchandising.content} type={BannerType.FOOTER} />
						</div>
						{search?.query?.string ? (
							<div className="ss__autocomplete__content__results__info">
								{results.length === 0 ? (
									<p>No results found for "{search.query.string}" Please try another search.</p>
								) : (
									<p>
										<a href={state.url.href}>
											See {pagination.totalResults} {filters.length > 0 ? 'filtered' : ''} result{pagination.totalResults > 1 ? 's' : ''} for "
											{search.query.string}"
											<Icon {...subProps.icon} icon={'angle-right'} />
										</a>
									</p>
								)}
							</div>
						) : null}
					</div>
				</div>
			</div>
		)
	);
});

interface AutocompleteSubProps {
	facet: FacetProps;
	banner: BannerProps;
	results: ResultsProp;
	icon: IconProps;
}

export interface AutocompleteProps extends ComponentProps {
	input: Element | string;
	store: any;
	hideFacets?: boolean;
	hideTerms?: boolean;
	responsive?: ResponsiveProps;
	controller?: AutocompleteController;
}
