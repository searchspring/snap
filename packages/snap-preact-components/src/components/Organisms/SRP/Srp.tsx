/** @jsx jsx */
import { Fragment, h } from 'preact';

import { observer } from 'mobx-react-lite';
import { jsx, css } from '@emotion/react';
import { SerializedStyles } from '@emotion/react';

import classnames from 'classnames';
import deepmerge from 'deepmerge';

import type { SearchController } from '@searchspring/snap-controller';
import type { SearchStore } from '@searchspring/snap-store-mobx';

import { Results, ResultsProp } from '../Results';
import { FilterSummary, FilterSummaryProps } from '../FilterSummary';
import { Facets, FacetsProps } from '../Facets';
import { Pagination, PaginationProps } from '../../Molecules/Pagination';
import { LoadingBar, LoadingBarProps } from '../../Atoms/Loading';
import { defined, cloneWithProps } from '../../../utilities';

import { ComponentProps, StylingCSS } from '../../../types';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { useDisplaySettings } from '../../../hooks/useDisplaySettings';
import { Select, SelectProps } from '../../Molecules/Select';
import { Slideout, SlideoutProps } from '../../Molecules/Slideout';

import { useMediaQuery } from '../../../hooks/useMediaQuery';

const CSS = {
	SRP: ({ slideOutToggleWidth }: Partial<SrpProps> & { slideOutToggleWidth: string }) =>
		css({
			display: 'flex',
			minHeight: '600px',

			'.ss__srp__sidebar': {
				flex: '0 1 auto',
				width: '250px',
				margin: '0 40px 0 0',

				[`@media only screen and (max-width: ${slideOutToggleWidth})`]: {
					display: 'none',
				},
			},

			'.ss_desktop': {
				[`@media only screen and (max-width: ${slideOutToggleWidth})`]: {
					display: 'none',
				},
			},

			'.ss__srp__content': {
				flex: '1 1 0%',
			},
		}),
};

export const Srp = observer((properties: mergedProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	let props: mergedProps = {
		// default props
		facetLayout: 'vertical',
		filterSummaryLayout: 'vertical',
		sortLayout: 'horizontal',
		perPageLayout: 'horizontal',
		slideOutToggleWidth: '991px',
		// global theme
		...globalTheme?.components?.srp,
		// props
		...properties,
		...properties.theme?.components?.srp,
	};

	const displaySettings = useDisplaySettings(props?.breakpoints || {});
	const theme = deepmerge(props?.theme || {}, displaySettings?.theme || {}, { arrayMerge: (destinationArray, sourceArray) => sourceArray });

	props = {
		...props,
		...displaySettings,
		theme,
	};

	const {
		disableStyles,
		className,
		controller,
		facetLayout,
		filterSummaryLayout,
		noResultsTitle,
		searchTitle,
		sortLayout,
		perPageLayout,
		slideoutSlot,
	} = props;
	let style: any = props.style;
	const slideOutToggleWidth: string = props.slideOutToggleWidth!;
	const mobileMediaQuery = `(max-width: ${slideOutToggleWidth})`;
	const isMobile = useMediaQuery(mobileMediaQuery);

	const store = controller.store;
	const landingPage = controller.store.merchandising.landingPage;
	const { pagination, search, filters, facets, sorting } = controller.store;

	const subProps: SrpSubProps = {
		FilterSummary: {
			// default props
			// global theme
			...globalTheme?.components?.filterSummary,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
		},
		Facets: {
			// default props
			// global theme
			...globalTheme?.components?.facets,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
		},
		LoadingBar: {
			// default props
			// global theme
			...globalTheme?.components?.loadingBar,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
		},
		Results: {
			// default props
			// global theme
			...globalTheme?.components?.results,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
		},
		NoResults: {
			// default props
			// global theme
			...globalTheme?.components?.noResults,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
		},
		Pagination: {
			// default props
			// global theme
			...globalTheme?.components?.pagination,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
		},
		Slideout: {
			// default props
			// global theme
			...globalTheme?.components?.slideout,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
		},
		Select: {
			// default props
			// global theme
			...globalTheme?.components?.select,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
		},
	};

	if (style && typeof style == 'function') {
		style = style({ ...properties });
	}
	const styling: { css?: StylingCSS } = {};
	if (!disableStyles) {
		styling.css = [
			CSS.SRP({
				slideOutToggleWidth,
				theme,
			}),
			style,
		];
	} else if (style) {
		styling.css = [style];
	}

	return (
		<CacheProvider>
			<div {...styling} className={classnames('ss__srp', className)}>
				{/* START SIDEBAR */}
				<div className={classnames('ss__srp__sidebar')}>
					{filterSummaryLayout == 'vertical' && <FilterSummary {...subProps.FilterSummary} filters={filters} controller={controller} />}

					{sortLayout == 'vertical' && (
						<div className="ss-sortby">
							{sorting.current && (
								<Select
									{...subProps.Select}
									className="ss-sort-by"
									label="Sort By"
									options={sorting.options}
									selected={sorting.current}
									onSelect={(e, selection) => {
										selection?.url.go();
									}}
								/>
							)}
						</div>
					)}

					{perPageLayout == 'vertical' && (
						<div className="ss-per-page">
							{pagination.pageSize && (
								<Select
									{...subProps.Select}
									label="Per Page"
									options={pagination.pageSizeOptions}
									selected={{ label: `Show ${pagination.pageSize}`, value: pagination.pageSize }}
									onSelect={(e, option) => {
										pagination.setPageSize(+option!.value);
									}}
								/>
							)}
						</div>
					)}

					{facetLayout == 'vertical' && <Facets {...subProps.Facets} facets={facets} />}
				</div>
				{/* END SIDEBAR */}

				{/* START MAIN CONTENT */}
				<div className={classnames('ss__srp__content')}>
					<LoadingBar {...subProps.LoadingBar} active={store.loading} />

					<header className="ss-header-container">
						{landingPage ? (
							<h3 className="ss__search-header--landingPageTitle">{landingPage.title}</h3>
						) : (
							<Fragment>
								{pagination.totalResults ? (
									searchTitle ? (
										searchTitle
									) : (
										<h3
											className="ss-title ss-results-title"
											aria-atomic="true"
											aria-live="polite"
											aria-label={`Now showing ${pagination.totalResults} items in the product grid`}
										>
											{`Showing `}
											{pagination.multiplePages && <span className="ss-results-count-range">{` ${pagination.begin} - ${pagination.end} of `}</span>}
											<span className="ss-results-count-total">{pagination.totalResults}</span>
											{` result${pagination.totalResults == 1 ? '' : 's'}`}
											{search?.query && (
												<span>
													{` for `}
													<span className="ss-results-query">"{search.query.string}"</span>
												</span>
											)}
											{search?.originalQuery && (
												<div className="ss-oq">
													No results found for <em>"{search.originalQuery.string}"</em>, showing results for <em>"{search.query?.string}"</em>{' '}
													instead.
												</div>
											)}
										</h3>
									)
								) : (
									pagination.totalResults === 0 && (
										<h3 className="ss-title ss-results-title ss-no-results-title">
											{noResultsTitle ? (
												{ noResultsTitle }
											) : search?.query ? (
												<span>
													No results for <span className="ss-results-query">"{search.query.string}"</span> found.
												</span>
											) : (
												<span>No results found.</span>
											)}
										</h3>
									)
								)}
							</Fragment>
						)}
					</header>

					{filterSummaryLayout == 'horizontal' && (
						<div className="ss_desktop">
							<FilterSummary {...subProps.FilterSummary} filters={filters} controller={controller} />
						</div>
					)}

					{facetLayout == 'horizontal' && (
						<div className="ss_desktop">
							<Facets {...subProps.Facets} facets={facets} />
						</div>
					)}

					<div className="ss-results">
						<div className="ss-toolbar ss-toolbar-top">
							<Slideout displayAt={mobileMediaQuery} buttonContent={<div>slideoutButton</div>} {...subProps.Slideout}>
								{slideoutSlot ? (
									cloneWithProps(slideoutSlot, { controller })
								) : (
									<Fragment>
										<h3>Filters</h3>
										{/* <SidebarContents /> */}
									</Fragment>
								)}
							</Slideout>

							{sortLayout == 'horizontal' && (
								<div className="ss-toolbar-col">
									<div className="ss-sortby">
										{sorting.current && (
											<Select
												{...subProps.Select}
												className="ss-sort-by"
												label="Sort By"
												options={sorting.options}
												selected={sorting.current}
												onSelect={(e, selection) => {
													selection?.url.go();
												}}
											/>
										)}
									</div>
								</div>
							)}

							{perPageLayout == 'horizontal' && (
								<div className="ss-toolbar-col">
									<div className="ss-per-page">
										{pagination.pageSize && (
											<Select
												{...subProps.Select}
												label="Per Page"
												options={pagination.pageSizeOptions}
												selected={{ label: `Show ${pagination.pageSize}`, value: pagination.pageSize }}
												onSelect={(e, option) => {
													pagination.setPageSize(+option!.value);
												}}
											/>
										)}
									</div>
								</div>
							)}
							<div className="ss-toolbar-col pagination">
								{pagination.totalPages > 1 && !isMobile && <Pagination spread={3} {...subProps.Pagination} pagination={pagination} />}
							</div>
						</div>

						<div className="clear"></div>

						{store!.pagination.totalResults ? (
							<Results {...subProps.Results} controller={controller} />
						) : (
							store.pagination.totalResults === 0 && <NoResults {...subProps.NoResults} store={store} />
						)}
						<div className="clear"></div>

						<div className="ss-toolbar ss-toolbar-bottom">
							{store.pagination.totalPages > 1 && <Pagination {...subProps.Pagination} pagination={store.pagination} />}
						</div>
					</div>
				</div>
				{/* END MAIN CONTENT */}
			</div>
		</CacheProvider>
	);
});

//todo improve the controller spreading here..
export interface SrpProps extends Omit<ComponentProps, 'style'> {
	facetLayout?: 'horizontal' | 'vertical';
	filterSummaryLayout?: 'horizontal' | 'vertical';
	sortLayout?: 'horizontal' | 'vertical';
	perPageLayout?: 'horizontal' | 'vertical';
	slideOutToggleWidth?: string;
	slideoutSlot?: JSX.Element;
	noResultsTitle?: string | JSX.Element;
	searchTitle?: string | JSX.Element;
	style?: ((props: SrpProps) => SerializedStyles) | string | Record<string, string>;
}
type controller = {
	controller: SearchController;
};
type mergedProps = SrpProps & controller;

interface SrpSubProps {
	FilterSummary: FilterSummaryProps;
	Facets: FacetsProps;
	LoadingBar: LoadingBarProps;
	Results: ResultsProp;
	NoResults: NoResultsProps;
	Pagination: PaginationProps;
	Select: SelectProps;
	Slideout: SlideoutProps;
}

type NoResultsProps = {
	store: SearchStore;
};

const NoResults = observer((properties: NoResultsProps): JSX.Element => {
	const store = properties.store;
	const dym = store.search.didYouMean;

	return (
		<div className="ss-no-results">
			<div className="ss-no-results-container">
				{dym && (
					<p className="ss-did-you-mean">
						Did you mean <a href={dym.url.href}>{dym.string}</a>?
					</p>
				)}
			</div>

			<div className="ss-no-results-container">
				<h4 className="ss-title">Suggestions</h4>

				<ul className="ss-suggestion-list">
					<li>Check for misspellings.</li>
					<li>Remove possible redundant keywords (ie. "products").</li>
					<li>Use other words to describe what you are searching for.</li>
				</ul>
			</div>
		</div>
	);
});
