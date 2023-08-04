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
import { defined } from '../../../utilities';
import { Facets, FacetsProps } from '../Facets';
import { SearchController } from '@searchspring/snap-controller';

const CSS = {
	Sidebar: () => css({}),
};

export const Sidebar = observer((properties: SidebarProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const props: SidebarProps = {
		// default props

		// global theme
		...globalTheme?.components?.sidebar,
		// props
		...properties,
		...properties.theme?.components?.sidebar,
	};
	const { controller, hideFacets, hidePerPage, hideSortBy, hideFilterSummary, disableStyles, style } = props;

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
			controller,
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

	return (
		<CacheProvider>
			<div {...styling} className={classnames('ss__sidebar')}>
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
	hideFacets?: boolean;
	hidePerPage?: boolean;
	hideSortBy?: boolean;
	hideFilterSummary?: boolean;
}

interface SidebarSubProps {
	FilterSummary: FilterSummaryProps;
	Facets: FacetsProps;
	SortBy: SortByProps;
	PerPage: PerPageProps;
}
