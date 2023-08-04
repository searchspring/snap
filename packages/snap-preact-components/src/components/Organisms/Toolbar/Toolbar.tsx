/** @jsx jsx */
import { Fragment, h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, StylingCSS } from '../../../types';
import { FilterSummary, FilterSummaryProps } from '../FilterSummary';
import { Facets, FacetsProps } from '../Facets';
import { Slideout, SlideoutProps } from '../../Molecules/Slideout';
import { defined } from '../../../utilities';
import { Pagination, PaginationProps } from '../../Molecules/Pagination';
import { LoadingBarProps } from '../../Atoms/Loading';
import { useMediaQuery } from '../../../hooks';
import { SearchController } from '@searchspring/snap-controller';
import { SortBy, SortByProps } from '../../Molecules/SortBy';
import { PerPage, PerPageProps } from '../../Molecules/PerPage';

const CSS = {
	toolbar: () => css({}),
};

export const Toolbar = observer((properties: ToolbarProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const props: ToolbarProps = {
		// default props

		// global theme
		...globalTheme?.components?.toolbar,
		// props
		...properties,
		...properties.theme?.components?.toolbar,
	};

	const {
		controller,
		slideOutToggleWidth,
		hideSlideout,
		hideFacets,
		hidefilterSummary,
		hidePerPage,
		hideSortBy,
		hidePagination,
		disableStyles,
		className,
		style,
	} = props;

	const styling: { css?: StylingCSS } = {};

	if (!disableStyles) {
		styling.css = [CSS.toolbar(), style];
	} else if (style) {
		styling.css = [style];
	}

	const subProps: ToolbarSubProps = {
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
		SortBy: {
			// default props
			// global theme
			...globalTheme?.components?.sortby,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
		},
		PerPage: {
			// default props
			// global theme
			...globalTheme?.components?.perpage,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
		},
	};

	const mobileMediaQuery = `(max-width: ${slideOutToggleWidth})`;
	const isMobile = useMediaQuery(mobileMediaQuery);

	const { pagination, filters, facets, sorting } = controller.store;

	return (
		<CacheProvider>
			<div {...styling} className={classnames('ss__toolbar', className)}>
				{!hidefilterSummary && <FilterSummary {...subProps.FilterSummary} filters={filters} controller={controller} />}

				{!hideFacets && <Facets {...subProps.Facets} facets={facets} />}

				<div className="ss-toolbar ss-toolbar-top">
					{!hideSlideout && (
						<Slideout displayAt={mobileMediaQuery} buttonContent={<div>slideoutButton</div>} {...subProps.Slideout}>
							{/* {slideoutSlot ? (
								cloneWithProps(slideoutSlot, { controller })
							) : ( */}
							<Fragment>
								<h3>Filters</h3>
								{/* <SidebarContents /> */}
							</Fragment>
							{/* )} */}
						</Slideout>
					)}

					{!hideSortBy && (
						<div className="ss-toolbar-col ss-sortby">
							{sorting.current && <SortBy {...subProps.SortBy} controller={controller} className="ss-sort-by" />}
						</div>
					)}

					{!hidePerPage && (
						<div className="ss-toolbar-col ss-per-page">
							{pagination.pageSize && <PerPage {...subProps.PerPage} controller={controller} className="ss-perpage" />}
						</div>
					)}
					{!hidePagination && (
						<div className="ss-toolbar-col pagination">
							{pagination.totalPages > 1 && !isMobile && <Pagination {...subProps.Pagination} pagination={pagination} />}
						</div>
					)}
				</div>
			</div>
		</CacheProvider>
	);
});

export interface ToolbarProps extends ComponentProps {
	hideFacets?: boolean;
	hidefilterSummary?: boolean;
	hidePerPage?: boolean;
	hideSortBy?: boolean;
	hidePagination?: boolean;
	hideSlideout?: boolean;
	slideOutToggleWidth?: string;
	controller: SearchController;
}

interface ToolbarSubProps {
	FilterSummary: FilterSummaryProps;
	Facets: FacetsProps;
	LoadingBar: LoadingBarProps;
	Pagination: PaginationProps;
	Slideout: SlideoutProps;
	SortBy: SortByProps;
	PerPage: PerPageProps;
}
