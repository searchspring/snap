/** @jsx jsx */
import { h } from 'preact';

import { observer } from 'mobx-react-lite';
import { jsx, css } from '@emotion/react';

import classnames from 'classnames';

import type { SearchController } from '@searchspring/snap-controller';

import { Results, ResultsProps } from '../../Organisms/Results';
import { defined, mergeProps } from '../../../utilities';
import { ComponentProps, StylingCSS } from '../../../types';
import { Theme, useTheme, CacheProvider, ThemeProvider } from '../../../providers';
import { Sidebar, SidebarProps } from '../../Organisms/Sidebar';
import { Toolbar, ToolbarProps } from '../../Organisms/Toolbar';
import { SearchHeader, SearchHeaderProps } from '../../Organisms/SearchHeader';
import { NoResults, NoResultsProps } from '../../Organisms/NoResults';
import { ResultLayoutTypes } from '../../Layouts/ResultLayout';

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

	const defaultProps: Partial<SearchProps> = {
		slideOutToggleWidth: '991px',
	};

	const props = mergeProps('search', globalTheme, defaultProps, properties);

	//breakpoints?
	// const displaySettings = useDisplaySettings(props?.breakpoints || {});
	// let theme = deepmerge(props?.theme || {}, displaySettings?.theme || {}, { arrayMerge: (destinationArray, sourceArray) => sourceArray });

	const { disableStyles, className, controller, styleScript, hideSidebar, resultLayout, hidetopToolBar, hideBottomToolBar } = props;
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
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
		},
		SearchHeader: {
			// default props
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
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
		},
		NoResults: {
			// default props
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
		<ThemeProvider theme={properties.theme || {}}>
			<CacheProvider>
				<div {...styling} className={classnames('ss__search', className)}>
					{!hideSidebar && <Sidebar {...subProps.Sidebar} controller={controller} />}

					<div className={classnames('ss__search__content')}>
						{/* do we want this? */}
						{/* <LoadingBar {...subProps.LoadingBar} active={store.loading} /> */}

						<SearchHeader {...subProps.SearchHeader} controller={controller} />

						{!hidetopToolBar && <Toolbar {...subProps.TopToolbar} name={'topToolBar'} controller={controller} />}

						<div className="clear"></div>

						{store.pagination.totalResults ? (
							<Results {...subProps.Results} controller={controller} />
						) : (
							store.pagination.totalResults === 0 && <NoResults {...subProps.NoResults} controller={controller} />
						)}

						<div className="clear"></div>

						{!hideBottomToolBar && <Toolbar {...subProps.BottomToolbar} name={'bottomToolBar'} controller={controller} />}
					</div>
				</div>
			</CacheProvider>
		</ThemeProvider>
	);
});

//todo improve the controller spreading here..
export interface SearchProps extends ComponentProps {
	controller: SearchController;
	slideOutToggleWidth?: string;
	resultLayout?: ResultLayoutTypes;
	hideSidebar?: boolean;
	hidetopToolBar?: boolean;
	hideBottomToolBar?: boolean;
}

interface SearchSubProps {
	Results: Partial<ResultsProps>;
	NoResults: Partial<NoResultsProps>;
	Sidebar: Partial<SidebarProps>;
	TopToolbar: Partial<ToolbarProps>;
	BottomToolbar: Partial<ToolbarProps>;
	SearchHeader: Partial<SearchHeaderProps>;
}
