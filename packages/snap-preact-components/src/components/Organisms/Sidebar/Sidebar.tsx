/** @jsx jsx */
import { h } from 'preact';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, StylingCSS } from '../../../types';
import { FilterSummary, FilterSummaryProps } from '../FilterSummary';
import { SortBy, SortByProps } from '../../Molecules/SortBy';
import { PerPage, PerPageProps } from '../../Molecules/PerPage';
import { defined, mergeProps } from '../../../utilities';
import { Facets, FacetsProps } from '../Facets';
import { SearchController } from '@searchspring/snap-controller';

const CSS = {
	Sidebar: () => css({}),
};

export const Sidebar = observer((properties: SidebarProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const defaultProps: Partial<SidebarProps> = {
		titleText: 'Filters',
	};

	const props = mergeProps('sidebar', globalTheme, defaultProps, properties);

	const { controller, hideTitle, titleText, hideFacets, hidePerPage, hideSortBy, hideFilterSummary, disableStyles, style, className } = props;

	const styling: { css?: StylingCSS } = {};

	if (!disableStyles) {
		styling.css = [CSS.Sidebar(), style];
	} else if (style) {
		styling.css = [style];
	}

	const subProps: SidebarSubProps = {
		filterSummary: {
			// default props
			controller,
			// global theme
			...globalTheme?.components?.filterSummary,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
		},
		facets: {
			// default props
			controller,
			// global theme
			...globalTheme?.components?.facets,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
		},
		sortBy: {
			// default props
			controller,
			// global theme
			...globalTheme?.components?.sortBy,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
		},
		perPage: {
			// default props
			controller,
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
			<div {...styling} className={classnames('ss__sidebar', className)}>
				{!hideTitle && <h4 className="ss__sidebar__title">{titleText}</h4>}

				{!hideFilterSummary && <FilterSummary {...subProps.filterSummary} />}

				{!hideSortBy && <SortBy {...subProps.sortBy} />}

				{!hidePerPage && <PerPage {...subProps.perPage} />}

				{!hideFacets && <Facets {...subProps.facets} />}
			</div>
		</CacheProvider>
	);
});

export interface SidebarProps extends ComponentProps {
	controller: SearchController;
	hideTitle?: boolean;
	titleText?: string;
	hideFacets?: boolean;
	hidePerPage?: boolean;
	hideSortBy?: boolean;
	hideFilterSummary?: boolean;
}

interface SidebarSubProps {
	filterSummary: Partial<FilterSummaryProps>;
	facets: Partial<FacetsProps>;
	sortBy: Partial<SortByProps>;
	perPage: Partial<PerPageProps>;
}
