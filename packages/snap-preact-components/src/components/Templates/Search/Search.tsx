/** @jsx jsx */
import { h } from 'preact';

import { observer } from 'mobx-react-lite';
import { jsx, css } from '@emotion/react';

import classnames from 'classnames';

import type { SearchController } from '@searchspring/snap-controller';

import { Results, ResultsProps } from '../../Organisms/Results';
import { combineMerge, defined, mergeProps } from '../../../utilities';
import { ComponentProps, StylingCSS } from '../../../types';
import { Theme, useTheme, CacheProvider, ThemeProvider } from '../../../providers';
import { Sidebar, SidebarProps } from '../../Organisms/Sidebar';
import { Toolbar, ToolbarProps } from '../../Organisms/Toolbar';
import { SearchHeader, SearchHeaderProps } from '../../Atoms/SearchHeader';
import { NoResults, NoResultsProps } from '../../Atoms/NoResults';
import { ResultLayoutTypes } from '../../Layouts/ResultLayout';
import { buildThemeBreakpointsObject, useDisplaySettings, useMediaQuery } from '../../../hooks';
import deepmerge from 'deepmerge';
import { MobileSidebar, MobileSidebarProps } from '../../Organisms/MobileSidebar';

const CSS = {
	Search: ({ slideOutToggleWidth }: Partial<SearchProps>) =>
		css({
			display: 'flex',
			minHeight: '600px',

			'.ss__search__sidebar': {
				flex: '0 1 auto',
				width: '250px',
				margin: '0 40px 0 0',
			},

			'.ss_desktop': {
				[`@media only screen and (max-width: ${slideOutToggleWidth})`]: {
					display: 'none',
				},
			},

			'.ss__search__content': {
				flex: '1 1 0%',
			},

			[`@media only screen and (max-width: ${slideOutToggleWidth})`]: {
				flexDirection: 'column',
			},
		}),
};

export const Search = observer((properties: SearchProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const defaultProps: Partial<SearchProps> = {
		slideOutToggleWidth: '991px',
	};

	let props = mergeProps('search', globalTheme, defaultProps, properties);

	// handle responsive themes
	if (properties.theme?.responsive) {
		const breakpointsObj = buildThemeBreakpointsObject(properties.theme);
		const displaySettings = useDisplaySettings(breakpointsObj || {});
		props.theme = deepmerge(props?.theme || {}, displaySettings || {}, { arrayMerge: combineMerge });
		const realTheme = deepmerge(props.theme || {}, props.theme.components?.search?.theme || {});
		props = {
			...props,
			...props.theme.components?.search,
		};
		props.theme = realTheme;
	}

	const {
		disableStyles,
		className,
		controller,
		style,
		styleScript,
		hideSidebar,
		resultLayout,
		hidetopToolBar,
		hideBottomToolBar,
		slideOutToggleWidth,
	} = props;
	const store = controller.store;

	const subProps: SearchSubProps = {
		MobileSidebar: {
			// default props
			hidePerPage: true,
			hideSortBy: true,
			displayAt: slideOutToggleWidth,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
		},
		TopToolbar: {
			// default props
			hidefilterSummary: true,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
		},
		BottomToolbar: {
			// default props
			hidefilterSummary: true,
			hidePerPage: true,
			hideSortBy: true,
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
	const stylingProps = { ...props };

	if (styleScript && !disableStyles) {
		styling.css = [styleScript(stylingProps), style];
	} else if (!disableStyles) {
		styling.css = [CSS.Search(stylingProps), style];
	} else if (style) {
		styling.css = [style];
	}

	const mobileMediaQuery = `(max-width: ${slideOutToggleWidth})`;
	const isMobile = useMediaQuery(mobileMediaQuery);

	return (
		<ThemeProvider theme={properties.theme || {}}>
			<CacheProvider>
				<div {...styling} className={classnames('ss__search', className)}>
					<div className="ss__search__sidebar-wrapper">
						{!hideSidebar && !isMobile && <Sidebar {...subProps.Sidebar} controller={controller} />}

						<MobileSidebar controller={controller} {...subProps.MobileSidebar} />
					</div>
					<div className={classnames('ss__search__content')}>
						{/* do we want this? */}
						{/* <LoadingBar {...subProps.LoadingBar} active={store.loading} /> */}

						<SearchHeader {...subProps.SearchHeader} controller={controller} />

						{!hidetopToolBar && store.pagination.totalResults > 0 && <Toolbar {...subProps.TopToolbar} name={'topToolBar'} controller={controller} />}

						<div className="clear"></div>

						{store.pagination.totalResults ? (
							<Results {...subProps.Results} controller={controller} breakpoints={{}} />
						) : (
							store.pagination.totalResults === 0 && <NoResults {...subProps.NoResults} controller={controller} />
						)}

						<div className="clear"></div>

						{!hideBottomToolBar && store.pagination.totalResults > 0 && (
							<Toolbar {...subProps.BottomToolbar} name={'bottomToolBar'} controller={controller} />
						)}
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
	MobileSidebar: Partial<MobileSidebarProps>;
}
