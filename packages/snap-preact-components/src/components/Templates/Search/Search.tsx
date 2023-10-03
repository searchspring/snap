/** @jsx jsx */
import { Fragment, h } from 'preact';

import { observer } from 'mobx-react-lite';
import { jsx, css } from '@emotion/react';

import classnames from 'classnames';

import type { SearchController } from '@searchspring/snap-controller';

import { Results, ResultsProps } from '../../Organisms/Results';
import { combineMerge, defined, mergeProps } from '../../../utilities';
import { ComponentProps, ResultComponent, StylingCSS } from '../../../types';
import { Theme, useTheme, CacheProvider, ThemeProvider } from '../../../providers';
import { Sidebar, SidebarProps } from '../../Organisms/Sidebar';
import { Toolbar, ToolbarProps } from '../../Organisms/Toolbar';
import { SearchHeader, SearchHeaderProps } from '../../Atoms/SearchHeader';
import { NoResults, NoResultsProps } from '../../Atoms/NoResults';
import { ResultLayoutTypes } from '../../Layouts/ResultLayout';
import { buildThemeBreakpointsObject, useDisplaySettings, useMediaQuery } from '../../../hooks';
import deepmerge from 'deepmerge';
import { MobileSidebar, MobileSidebarProps } from '../../Organisms/MobileSidebar';
import { Button, ButtonProps } from '../../Atoms/Button';
import { Banner, BannerProps } from '../../Atoms/Merchandising';
import { ContentType } from '@searchspring/snap-store-mobx';
import { useState } from 'react';

const CSS = {
	Search: ({ mobileSidebarDisplayAt: slideOutToggleWidth }: Partial<SearchProps>) =>
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
		mobileSidebarDisplayAt: '991px',
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
		hideSearchHeader,
		hideMobileSidebar,
		resultLayout,
		hideMerchandisingBanners,
		toggleSidebarButtonText,
		hideTopToolbar,
		resultComponent,
		hideBottomToolBar,
		mobileSidebarDisplayAt,
	} = props;
	const store = controller.store;

	const subProps: SearchSubProps = {
		MobileSidebar: {
			// default props
			hidePerPage: true,
			hideSortBy: true,
			displayAt: mobileSidebarDisplayAt,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
		},
		Button: {
			// default props
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
		},
		Toolbar: {
			// default props
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
			resultComponent: resultComponent,
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
		Banner: {
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
	const stylingProps = props;

	if (styleScript && !disableStyles) {
		styling.css = [styleScript(stylingProps), style];
	} else if (!disableStyles) {
		styling.css = [CSS.Search(stylingProps), style];
	} else if (style) {
		styling.css = [style];
	}

	const mobileMediaQuery = `(max-width: ${mobileSidebarDisplayAt})`;
	const isMobile = useMediaQuery(mobileMediaQuery);
	const merchandising = controller.store.merchandising;

	let hideLeftBanner;
	let hideHeaderBanner;
	let hideBannerBanner;
	let hideFooterBanner;

	if (hideMerchandisingBanners) {
		if (typeof hideMerchandisingBanners == 'boolean') {
			//hide all
			hideLeftBanner = true;
			hideHeaderBanner = true;
			hideBannerBanner = true;
			hideFooterBanner = true;
		} else if (typeof hideMerchandisingBanners == 'object') {
			hideMerchandisingBanners.map((type) => {
				if (type.toLowerCase() == 'banner') {
					hideBannerBanner = true;
				}
				if (type.toLowerCase() == 'header') {
					hideHeaderBanner = true;
				}
				if (type.toLowerCase() == 'footer') {
					hideFooterBanner = true;
				}
				if (type.toLowerCase() == 'left') {
					hideLeftBanner = true;
				}
			});
		}
	}

	const [sidebarOpenState, setSidebarOpenState] = useState(true);

	return (
		<ThemeProvider theme={properties.theme || {}}>
			<CacheProvider>
				<div {...styling} className={classnames('ss__search', className)}>
					{!hideSidebar && !isMobile && (
						<div className="ss__search__sidebar-wrapper">
							{toggleSidebarButtonText ? (
								sidebarOpenState && (
									<Fragment>
										<Sidebar {...subProps.Sidebar} controller={controller} />
										{!hideLeftBanner && <Banner content={merchandising.content} type={ContentType.LEFT} />}
									</Fragment>
								)
							) : (
								<Fragment>
									<Sidebar {...subProps.Sidebar} controller={controller} />
									{!hideLeftBanner && <Banner content={merchandising.content} type={ContentType.LEFT} />}
								</Fragment>
							)}
						</div>
					)}
					<div className={classnames('ss__search__content')}>
						{!hideSearchHeader && <SearchHeader {...subProps.SearchHeader} controller={controller} />}

						{!hideHeaderBanner && <Banner content={merchandising.content} type={ContentType.HEADER} />}
						{!hideBannerBanner && <Banner content={merchandising.content} type={ContentType.BANNER} />}

						{toggleSidebarButtonText && (
							<Button
								onClick={() => setSidebarOpenState(!sidebarOpenState)}
								className="ss__search__sidebar-wrapper-toggle"
								name={'search__sidebar-wrapper-toggle-button'}
								{...subProps.Button}
							>
								{toggleSidebarButtonText}
							</Button>
						)}

						{!hideTopToolbar && store.pagination.totalResults > 0 && (
							<Toolbar {...subProps.TopToolbar} className="ss__search__content__toolbar--topToolBar" name={'topToolBar'} controller={controller} />
						)}

						{!hideMobileSidebar && <MobileSidebar controller={controller} {...subProps.MobileSidebar} />}

						<div className="clear"></div>

						{store.pagination.totalResults ? (
							<Results {...subProps.Results} controller={controller} breakpoints={{}} />
						) : (
							store.pagination.totalResults === 0 && <NoResults {...subProps.NoResults} controller={controller} />
						)}

						{!hideFooterBanner && <Banner content={merchandising.content} type={ContentType.FOOTER} />}

						<div className="clear"></div>

						{!hideBottomToolBar && store.pagination.totalResults > 0 && (
							<Toolbar
								{...subProps.BottomToolbar}
								name={'bottomToolBar'}
								className="ss__search__content__toolbar--bottomToolBar"
								controller={controller}
							/>
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
	mobileSidebarDisplayAt?: string;
	resultLayout?: ResultLayoutTypes;
	resultComponent?: ResultComponent;
	hideSidebar?: boolean;
	hideMobileSidebar?: boolean;
	hideSearchHeader?: boolean;
	hideTopToolbar?: boolean;
	hideBottomToolBar?: boolean;
	hideMerchandisingBanners?: boolean | string[];
	toggleSidebarButtonText?: string;
}

interface SearchSubProps {
	Results: Partial<ResultsProps>;
	NoResults: Partial<NoResultsProps>;
	Sidebar: Partial<SidebarProps>;
	TopToolbar: Partial<ToolbarProps>;
	BottomToolbar: Partial<ToolbarProps>;
	Toolbar: Partial<ToolbarProps>;
	SearchHeader: Partial<SearchHeaderProps>;
	MobileSidebar: Partial<MobileSidebarProps>;
	Button: Partial<ButtonProps>;
	Banner: Partial<BannerProps>;
}
