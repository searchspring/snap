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
		title: 'Filters',
	};

	const props = mergeProps('sidebar', globalTheme, defaultProps, properties);

	const { controller, hideTitle, title, hideFacets, hidePerPage, hideSortBy, hideFilterSummary, disableStyles, style } = props;

	const styling: { css?: StylingCSS } = {};

	if (!disableStyles) {
		styling.css = [CSS.Sidebar(), style];
	} else if (style) {
		styling.css = [style];
	}

	const subProps: SidebarSubProps = {
		FilterSummary: {
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
		Facets: {
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
		SortBy: {
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
		PerPage: {
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
			<div {...styling} className={classnames('ss__sidebar')}>
				{!hideTitle && <h4 className="ss--sidebar-title">{title}</h4>}

				{!hideFilterSummary && <FilterSummary {...subProps.FilterSummary} />}

				{!hideSortBy && <SortBy {...subProps.SortBy} />}

				{!hidePerPage && <PerPage {...subProps.PerPage} />}

				{!hideFacets && <Facets {...subProps.Facets} />}
			</div>
		</CacheProvider>
	);
});

export interface SidebarProps extends ComponentProps {
	controller: SearchController;
	hideTitle?: boolean;
	title?: string;
	hideFacets?: boolean;
	hidePerPage?: boolean;
	hideSortBy?: boolean;
	hideFilterSummary?: boolean;
}

interface SidebarSubProps {
	FilterSummary: Partial<FilterSummaryProps>;
	Facets: Partial<FacetsProps>;
	SortBy: Partial<SortByProps>;
	PerPage: Partial<PerPageProps>;
}
