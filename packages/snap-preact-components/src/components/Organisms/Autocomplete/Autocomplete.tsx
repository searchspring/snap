/** @jsx jsx */
import { h, Fragment } from 'preact';
import { useEffect } from 'preact/hooks';

import { observer } from 'mobx-react-lite';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';

import type { SearchController, AutocompleteController, RecommendationController } from '@searchspring/snap-controller';

import { Results, ResultsProp, ResponsiveProps } from '../../Organisms/Results';
import { Banner, BannerProps } from '../../Atoms/Merchandising/Banner';
import { Facet, FacetProps } from '../../Organisms/Facet';
import { defined } from '../../../utilities';
import { Theme, useTheme } from '../../../providers/theme';
import { BannerType, ComponentProps, Layout } from '../../../types';

const CSS = {
	Autocomplete: ({ style }) =>
		css({
			'&.ss__autocomplete': {
				position: 'absolute',
				top: '50px',
				zIndex: '10002',
				left: '0',
				right: '0',
			},

			'& .ss-ac-container': {
				textAlign: 'left',
				border: '1px solid #ebebeb',
				background: '#ffffff',
				display: 'flex',
				flexFlow: 'row wrap',
			},

			'& .ss-ac-container.no-results': {
				width: '150px',
			},

			'& .ss-ac-container a, .ss-ac-container p, .ss-ac-container div': {
				fontSize: '12px',
			},

			'& .ss-ac-container p, .ss-ac-container div': {
				lineHeight: '1.5',
			},

			'& .ss-ac-container .ss-title': {
				lineHeight: '1.2',
			},

			'& .ss-ac-container .ss-ac-merchandising img': {
				maxWidth: '100%',
				height: 'auto !important',
			},

			'& .ss-ac-container .ss-ac-merchandising#ss-ac-merch-header, .ss-ac-container .ss-ac-merchandising#ss-ac-merch-banner': {
				margin: '0 0 20px 0',
			},

			'& .ss-ac-container .ss-ac-merchandising#ss-ac-merch-footer': {
				margin: '20px 0 0 0',
			},

			'& .ss-ac-container .ss-ac-merchandising#ss-ac-merch-left': {
				margin: '20px 0 0 0',
			},

			'& .ss-ac-container .ss-ac-facets, .ss-ac-container .ss-ac-results, .ss-ac-container #ss-ac-see-more': {
				padding: '20px',
			},

			'& .ss-ac-container .ss-ac-terms .ss__facet-list-options .ss-focused, .ss-ac-container .ss-ac-facets .ss-ac-facet-container .ss-focused, .ss-ac-container .ss-ac-results .ss-ac-item-container .ss-ac-item .ss-focused .ss-ac-item-details .ss-ac-item-name':
				{
					fontWeight: 'bold',
				},

			/* AutoComplete - Terms */
			'& .ss-ac-container .ss-ac-terms': {
				width: '150px',
				background: '#f8f8f8',
			},

			'& .ss-ac-container .ss-ac-terms ul': {
				listStyle: 'none',
				margin: '0px',
				padding: '0px',
			},

			'& .ss-ac-container .ss-ac-terms .ss__facet-list-options .ss__facet-list-options-option .ss__facet-list-options-link': {
				display: 'block',
				padding: '10px 20px',
				fontSize: '16px',
				overflowWrap: 'break-word',
				wordWrap: 'break-word',
			},

			'& .ss-ac-container .ss-ac-terms .ss__facet-list-options .ss__facet-list-options-option .ss__facet-list-options-link em': {
				fontStyle: 'normal',
			},

			'& .ss-ac-container .ss-ac-terms .ss__facet-list-options .ss-active': {
				background: '#ffffff',
			},

			'& .ss-ac-container .ss-ac-terms .ss-ac-terms-heading': {
				fontSize: '10px',
				fontWeight: 'normal',
				padding: '20px 20px 10px 20px',
				margin: '0',
				color: '#c5c5c5',
				textTransform: 'uppercase',
			},

			/* AutoComplete - Facets */
			'& .ss-ac-container .ss-ac-facets': {
				width: '200px',
			},

			'& .ss-ac-container .ss-ac-facets .ss-ac-facet-container, .ss-ac-container .ss-ac-facets .ss-ac-facet-container .ss-title': {
				margin: '0 0 20px 0',
			},

			'& .ss-ac-container .ss-ac-facets .ss-ac-facet-container .ss-title': {
				fontSize: '12px',
				borderBottom: '2px solid #3a23ad',
				padding: '0 0 10px 0',
				textTransform: 'uppercase',
			},

			'& .ss-ac-container .ss-ac-facets .ss__facet-list-options .ss__facet-list-options-option': {
				margin: '0 0 3px 0',
			},

			'& .ss-ac-container .ss-ac-facets .ss__facet-list-options .ss__facet-list-options-option:last-child': {
				marginBottom: '0',
			},

			'& .ss-ac-container .ss-ac-content': {
				flex: '1 1 0%',
				display: 'flex',
			},

			/* AutoComplete - Results */
			'& .ss-ac-container .ss-ac-results ul': {
				padding: '0px',
			},

			'& .ss-ac-container .ss-ac-results .ss-title': {
				margin: '0 0 20px 0',
			},

			'& .ss-ac-container .ss-ac-results .ss-ac-item-container .ss-ac-item': {
				flex: '0 1 auto',
				padding: '0 10px',
				margin: '0 0 20px 0',
				textAlign: 'center',
			},

			'& .ss-ac-container .ss-ac-results .ss-ac-item-container .ss-ac-item .ss-ac-item-image': {
				lineHeight: '0',
				margin: '0 0 10px 0',
			},

			'& .ss-ac-container .ss-ac-results .ss-ac-no-results p': {
				margin: '0',
			},

			/* AutoComplete - See More Results */
			'& .ss-ac-container #ss-ac-see-more': {
				flex: '1 1 100%',
				background: '#ffffff',
				textAlign: 'right',
			},

			'& .ss-ac-container #ss-ac-see-more .ss-ac-see-more-link': {
				display: 'inline-block',
				fontSize: '14px',
				position: 'relative',
				paddingRight: '18px',
			},

			'& .ss-ac-container #ss-ac-see-more .ss-ac-see-more-link:before': {
				content: '""',
				display: 'block',
				width: '12px',
				height: '12px',
				backgroundRepeat: 'no-repeat',
				backgroundPosition: 'center center',
				backgroundImage:
					"url(data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 56 56' preserveAspectRatio='xMinYMid'%3E%3Cpath fill='%233a23ad' d='M45.34 29.564l-25.785 25.785c-0.869 0.869-2.259 0.869-3.128 0l-5.768-5.768c-0.869-0.869-0.869-2.259 0-3.128l18.452-18.452-18.452-18.452c-0.869-0.869-0.869-2.259 0-3.128l5.768-5.768c0.869-0.869 2.259-0.869 3.128 0l25.785 25.785c0.869 0.869 0.869 2.259 0 3.128z'/%3E%3C/svg%3E)",
				position: 'absolute',
				top: '0',
				bottom: '0',
				right: '0',
				margin: 'auto',
			},

			/* AutoComplete - Breakpoint 991px */
			'@media (max-width: 991px)': {
				'& .ss-ac-container.no-results': {
					width: 'auto',
				},
				'& .ss-ac-container .ss-ac-terms': {
					width: 'auto',
					flex: '1 1 100%',
				},
				'& .ss-ac-container .ss-ac-terms .ss-ac-terms-heading': {
					padding: '20px',
				},
				'& .ss-ac-container .ss-ac-terms .ss__facet-list-options': {
					display: 'flex',
					flexFlow: 'row nowrap',
				},
				'& .ss-ac-container .ss-ac-terms .ss__facet-list-options .ss__facet-list-options-option': {
					flex: '1 1 0%',
					textAlign: 'center',
					overflow: 'hidden',
				},
				'& .ss-ac-container .ss-ac-terms .ss__facet-list-options .ss__facet-list-options-option .ss__facet-list-options-link': {
					overflow: 'hidden',
					textOverflow: 'ellipsis',
					whiteSpace: 'nowrap',
					overflowWrap: 'normal',
					wordWrap: 'normal',
				},
				'& .ss-ac-container .ss-ac-see-more': {
					background: 'none',
					borderLeft: '0',
				},

				'&.ss__autocomplete': {
					left: '0',
					right: '0',
					margin: '0 auto',
				},
				'& .ss-ac-container': {
					display: 'block',
					width: 'auto',
				},
				'& .ss-ac-container .ss-ac-facets': {
					display: 'none',
					width: 'auto',
					margin: '0 0 -20px 0',
				},
				'& .ss-ac-container .ss-ac-facets .ss-ac-facets-row': {
					display: 'flex',
					flexFlow: 'row nowrap',
					margin: '0 -10px -20px -10px',
				},
				'& .ss-ac-container .ss-ac-facets .ss-ac-facet-container': {
					flex: '1 1 0%',
					padding: '0 10px',
				},
			},

			/* AutoComplete - Breakpoint 767px */
			'@media (max-width: 767px)': {
				'& .ss-ac-container .ss-ac-facets, .ss-ac-container .ss-ac-results .ss-title': {
					display: 'none',
				},
				'& .ss-ac-container .ss-ac-terms': {
					borderBottom: '1px solid #ebebeb',
					padding: '20px',
				},

				'& .ss-ac-container .ss-ac-terms .ss__facet-list-options': {
					flexWrap: 'wrap',
					margin: '0 -5px -10px -5px',
				},

				'& .ss-ac-container .ss-ac-terms .ss__facet-list-options .ss__facet-list-options-option': {
					flex: '0 1 auto',
					width: '50%',
					textAlign: 'left',
				},
				'& .ss-ac-container .ss-ac-terms .ss__facet-list-options .ss__facet-list-options-option .ss__facet-list-options-link': {
					fontSize: '14px',
					padding: '0 5px 10px 5px',
				},
				'& .ss-ac-container .ss-ac-terms .ss__facet-list-options .ss-active': {
					background: 'none',
				},
				'& .ss-ac-container .ss-ac-terms .ss-ac-terms-heading': {
					padding: '0 0 20px 0',
				},

				'& .ss-ac-container .ss-ac-see-more': {
					textAlign: 'left',
				},
			},
			...style,
		}),
};

export const Autocomplete = observer((properties: AutocompleteProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const props: AutocompleteProps = {
		// default props
		// global theme
		...globalTheme?.components?.autocomplete,
		// props
		...properties,
		...properties.theme?.components?.autocomplete,
	};

	const { store, hideFacets, hideTerms, disableStyles, className, style, controller } = props;

	let { input } = props;

	//passed in or default responsive result props
	const responsive = props.responsive || [
		{
			viewport: 1,
			numAcross: 2,
			numRows: 2,
		},
	];

	const subProps: AutocompleteSubProps = {
		facet: {
			// default props
			className: 'ss__autocomplete__facet',
			// global theme
			...globalTheme?.components?.facet,
			// inherited props
			...defined({
				disableStyles,
			}),
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
	};

	const { search, terms, results, merchandising, pagination, filters, facets, state } = store;

	//you can pass in a selector or the actual input element,
	//if its the selector, we need to bind it to the controller here.
	if (typeof input == 'string') {
		input = document.querySelector(input);
		//only bind on componentdidmount
		useEffect(() => {
			//run bind
			store.controller.bind();
		}, []);
	}

	const inputFocused = Boolean(input == state.focusedInput);
	const visible = inputFocused && terms.length > 0;

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

	return (
		visible && (
			<div css={CSS.Autocomplete({ style })} className={classnames('ss__autocomplete', className)} onClick={(e) => e.stopPropagation()}>
				<div className="ss-ac-container">
					{!hideTerms && <Terms terms={terms} search={search} valueProps={valueProps} />}

					<div className="ss-ac-content">
						{facets.length > 0 && !hideFacets && (
							<div className="ss-ac-facets">
								{facets
									.filter((facet) => facet.display !== 'slider')
									.slice(0, 3)
									.map((facet) => {
										return (
											<div
												className={`ss-ac-facet-container ss-ac-facet-container-${
													facet.display && (facet.display != 'hierarchy' || facet.display != 'slider') ? facet.display : Layout.LIST
												}`}
											>
												<Facet {...subProps.facet} facet={facet} previewOnFocus={true} valueProps={valueProps} />
											</div>
										);
									})}
								<Banner content={merchandising.content} type={`left` as BannerType} class="ss-ac-merchandising" />
							</div>
						)}

						<div className="ss-ac-results">
							<div>
								<h4 className="ss-title">Product Suggestions</h4>
								<Banner content={merchandising.content} type={`header` as BannerType} class="ss-ac-merchandising" />
								<Banner content={merchandising.content} type={`banner` as BannerType} class="ss-ac-merchandising" />
								<ul className="ss-ac-item-container">
									<Results results={results} {...subProps.results} className="ss-ac-item" controller={controller} />
								</ul>
								<Banner content={merchandising.content} type={`footer` as BannerType} class="ss-ac-merchandising" />
							</div>
							<div>
								{/* no results */}
								{results.length == 0 && (
									<div className="ss-ac-no-results">
										<p>No results found for "{search.query}". Please try another search.</p>
									</div>
								)}

								{/* see more link */}
								{results.length > 0 && (
									<div id="ss-ac-see-more" className={`${facets.length ? 'ss-ac-see-more-padding' : ''}`}>
										<a href={state.url.href} className="ss-ac-see-more-link">
											See {pagination.totalResults} {filters.length > 0 ? 'filtered' : ''} result{pagination.totalResults > 1 ? 's' : ''} for "
											{search.query}"
										</a>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	);
});

const emIfy = (term, search) => {
	const match = term.match(search.query);

	if (match) {
		const beforeMatch = <em>{term.slice(0, match.index)}</em>;
		const afterMatch = <em>{term.slice(match.index + search.query.length, term.length)}</em>;
		return (
			<>
				({beforeMatch}
				{search.query}
				{afterMatch})
			</>
		);
	}

	return (
		<>
			(<em>{term}</em>)
		</>
	);
};

const Terms = (props: { terms; search; valueProps }) => {
	return (
		<div className="ss-ac-terms">
			<ul className="ss__facet-list-options">
				{props.terms.map((term) => (
					<li className={`ss__facet-list-options-option ${term.active ? 'ss-active' : ''}`}>
						<a href={term.url.href} className="ss__facet-list-options-link" {...props.valueProps} onFocus={() => term.preview()}>
							{emIfy(term.value, props.search)}
						</a>
					</li>
				))}
			</ul>
		</div>
	);
};

interface AutocompleteSubProps {
	facet?: FacetProps;
	banner?: BannerProps;
	results?: ResultsProp;
}

export interface AutocompleteProps extends ComponentProps {
	input: Element | string;
	store: any;
	hideFacets?: boolean;
	hideTerms?: boolean;
	responsive?: ResponsiveProps[];
	controller?: SearchController | AutocompleteController | RecommendationController;
}
