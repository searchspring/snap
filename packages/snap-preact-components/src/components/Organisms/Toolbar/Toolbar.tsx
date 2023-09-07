/** @jsx jsx */
import { h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, StylingCSS } from '../../../types';
import { FilterSummary, FilterSummaryProps } from '../FilterSummary';
import { defined, mergeProps } from '../../../utilities';
import { Pagination, PaginationProps } from '../../Molecules/Pagination';
import { SearchController } from '@searchspring/snap-controller';
import { SortBy, SortByProps } from '../../Molecules/SortBy';
import { PerPage, PerPageProps } from '../../Molecules/PerPage';

const CSS = {
	toolbar: () => css({}),
};

export const Toolbar = observer((properties: ToolbarProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const defaultProps: Partial<ToolbarProps> = {
		hidefilterSummary: false,
		hidePerPage: false,
		hideSortBy: false,
		hidePagination: false,
	};

	const props = mergeProps('toolbar', globalTheme, defaultProps, properties);

	const { controller, hidefilterSummary, hidePerPage, hideSortBy, hidePagination, disableStyles, className, style } = props;

	const styling: { css?: StylingCSS } = {};

	if (!disableStyles) {
		styling.css = [CSS.toolbar(), style];
	} else if (style) {
		styling.css = [style];
	}

	const subProps: ToolbarSubProps = {
		FilterSummary: {
			// default props
			controller,
			className: 'ss__toolbar__filter-summary',
			// global theme
			...globalTheme?.components?.filterSummary,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
		},
		Pagination: {
			// default props
			controller,
			className: 'ss__toolbar__pagination',
			// global theme
			...globalTheme?.components?.pagination,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
		},
		SortBy: {
			// default props
			controller,
			className: 'ss__toolbar__sort-by',
			// global theme
			...globalTheme?.components?.sortBy,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
		},
		PerPage: {
			// default props
			controller,
			className: 'ss__toolbar__per-page',
			// global theme
			...globalTheme?.components?.perPage,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
		},
	};

	return (
		<CacheProvider>
			<div {...styling} className={classnames('ss__toolbar', className)}>
				{!hidefilterSummary && <FilterSummary {...subProps.FilterSummary} />}

				{!hideSortBy && <SortBy {...subProps.SortBy} />}

				{!hidePerPage && <PerPage {...subProps.PerPage} />}

				{!hidePagination && <Pagination {...subProps.Pagination} />}
			</div>
		</CacheProvider>
	);
});

export interface ToolbarProps extends ComponentProps {
	controller: SearchController;
	hidefilterSummary?: boolean;
	hidePerPage?: boolean;
	hideSortBy?: boolean;
	hidePagination?: boolean;
}

interface ToolbarSubProps {
	FilterSummary: Partial<FilterSummaryProps>;
	Pagination: Partial<PaginationProps>;
	SortBy: Partial<SortByProps>;
	PerPage: Partial<PerPageProps>;
}
