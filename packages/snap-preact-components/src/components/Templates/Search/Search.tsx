/** @jsx jsx */
import { h } from 'preact';

import { observer } from 'mobx-react-lite';
import { jsx, css } from '@emotion/react';

import classnames from 'classnames';
import deepmerge from 'deepmerge';

import type { SearchController } from '@searchspring/snap-controller';

import { Results, ResultsProps } from '../../Organisms/Results';
import { defined } from '../../../utilities';
import { ComponentProps, StylingCSS } from '../../../types';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { Sidebar, SidebarProps } from '../../Organisms/Sidebar';
import { Toolbar, ToolbarProps } from '../../Organisms/Toolbar';
import { SearchHeader, SearchHeaderProps } from '../../Organisms/SearchHeader';
import { NoResults, NoResultsProps } from '../../Organisms/NoResults';
import { ResultLayoutTypes } from '../../Organisms/ResultLayout';

const CSS = {
	Search: ({ slideOutToggleWidth }: Partial<SearchProps>) =>
		css({
			display: 'flex',
			minHeight: '600px',

			'.ss__search__sidebar': {
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

			'.ss__search__content': {
				flex: '1 1 0%',
			},
		}),
};

export const Search = observer((properties: SearchProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	let props: SearchProps = {
		// default props
		facetLayout: 'vertical',
		filterSummaryLayout: 'vertical',
		sortLayout: 'horizontal',
		perPageLayout: 'horizontal',
		slideOutToggleWidth: '991px',
		sortByLabel: 'Sort By',
		perPageSortLabel: 'Per Page',

		// global theme
		...globalTheme?.components?.search,
		// props
		...properties,
		...properties.theme?.components?.search,
	};

	//breakpoints?
	// const displaySettings = useDisplaySettings(props?.breakpoints || {});
	// let theme = deepmerge(props?.theme || {}, displaySettings?.theme || {}, { arrayMerge: (destinationArray, sourceArray) => sourceArray });

	let theme;
	//specific component theme spreading
	if (props.name) {
		theme = deepmerge(props.theme || {}, globalTheme?.namedComponents[props.name as any] || {});
	}

	props = {
		...props,
		// ...displaySettings,
		theme,
	};

	const { disableStyles, className, controller, styleScript, hideSidebar, resultLayout } = props;
	const style: any = props.style;
	const slideOutToggleWidth: string = props.slideOutToggleWidth!;
	const mobileMediaQuery = `(max-width: ${slideOutToggleWidth})`;
	const store = controller.store;

	const subProps: SearchSubProps = {
		TopToolbar: {
			// default props
			hideFacets: true,
			hidefilterSummary: true,
			hideSlideout: true,
			slideOutToggleWidth: mobileMediaQuery,

			// global theme
			...globalTheme?.components?.toolbar,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
		},
		BottomToolbar: {
			// default props
			hideFacets: true,
			hidefilterSummary: true,
			hidePerPage: true,
			hideSortBy: true,
			hideSlideout: true,
			// global theme
			...globalTheme?.components?.toolbar,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
		},
		Sidebar: {
			// default props
			hidePerPage: true,
			hideSortBy: true,
			// global theme
			...globalTheme?.components?.sidebar,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
		},
		SearchHeader: {
			// default props
			// global theme
			...globalTheme?.components?.searchHeader,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
		},
		Results: {
			// default props
			resultLayout: resultLayout,
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
	};

	const styling: { css?: StylingCSS } = {};

	if (!disableStyles) {
		styling.css = [CSS.Search(props), style];
	} else if (style) {
		styling.css = [style];
	}

	// add styleScript to styling
	if (styleScript) {
		styling.css = styling.css || [];
		styling.css.push(styleScript(props));
	}

	return (
		<CacheProvider>
			<div {...styling} className={classnames('ss__search', className)}>
				{!hideSidebar && <Sidebar {...subProps.Sidebar} controller={controller} />}

				<div className={classnames('ss__search__content')}>
					{/* do we want this? */}
					{/* <LoadingBar {...subProps.LoadingBar} active={store.loading} /> */}

					<SearchHeader {...subProps.SearchHeader} controller={controller} />

					<Toolbar {...subProps.TopToolbar} controller={controller} name={'topToolBar'} />

					<div className="clear"></div>

					{store!.pagination.totalResults ? (
						<Results {...subProps.Results} controller={controller} />
					) : (
						store.pagination.totalResults === 0 && <NoResults {...subProps.NoResults} controller={controller} />
					)}

					<div className="clear"></div>

					<Toolbar {...subProps.BottomToolbar} controller={controller} name={'bottomToolBar'} />
				</div>
			</div>
		</CacheProvider>
	);
});

//todo improve the controller spreading here..
export interface SearchProps extends ComponentProps {
	controller: SearchController;
	facetLayout?: 'horizontal' | 'vertical';
	filterSummaryLayout?: 'horizontal' | 'vertical';
	sortLayout?: 'horizontal' | 'vertical';
	perPageLayout?: 'horizontal' | 'vertical';
	resultLayout?: ResultLayoutTypes;
	hideSidebar?: boolean;
	perPageSortLabel?: string;
	sortByLabel?: string;
	slideOutToggleWidth?: string;
	slideoutSlot?: JSX.Element;
	topSideBarSlot?: JSX.Element;
	bottomSideBarSlot?: JSX.Element;
	bottomContentSlot?: JSX.Element;
	topContentSlot?: JSX.Element;
	noResultsTitle?: string | JSX.Element;
	searchTitle?: string | JSX.Element;
}

interface SearchSubProps {
	Results: ResultsProps;
	NoResults: NoResultsProps;
	Sidebar: SidebarProps;
	TopToolbar: ToolbarProps;
	BottomToolbar: ToolbarProps;
	SearchHeader: SearchHeaderProps;
}
