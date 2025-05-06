import { h } from 'preact';
import { useState } from 'preact/hooks';
import { observer } from 'mobx-react-lite';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import type { SearchController } from '@searchspring/snap-controller';
import { Results, ResultsProps } from '../../Organisms/Results';
import { defined, mergeProps, mergeStyles } from '../../../utilities';
import { ComponentProps, ListOption, ResultComponent, StyleScript } from '../../../types';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { Sidebar, SidebarProps } from '../../Organisms/Sidebar';
import { Toolbar, ToolbarProps } from '../../Organisms/Toolbar';
import { NoResults, NoResultsProps } from '../../Organisms/NoResults';
import { Lang, useLang, useMediaQuery } from '../../../hooks';
import { SearchFilterStore } from '@searchspring/snap-store-mobx';
import deepmerge from 'deepmerge';
import { useLayoutOptions } from '../../../hooks/useLayoutOptions';

const defaultStyles: StyleScript<SearchProps> = () => {
	return css({
		'.ss__search__header-section': {
			marginBottom: '20px',
		},

		'.ss__search__main-section': {
			display: 'flex',
			minHeight: '600px',
			gap: '20px',
		},

		'.ss__sidebar': {
			flex: '0 1 auto',
			width: '270px',
		},

		'.ss__search__content': {
			width: '100%',
			boxSizing: 'border-box',
			display: 'flex',
			flexDirection: 'column',
			gap: '1em',
		},
	});
};

export const searchThemeComponentProps: ThemeComponentProps<SearchProps> = {
	default: {},
	mobile: {},
	tablet: {},
	desktop: {},
};

export const Search = observer((properties: SearchProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const defaultProps: Partial<SearchProps> = {
		toggleSidebarButtonText: 'Filters',
		hideToggleSidebarButton: true,
		mobileDisplayAt: globalTheme?.variables?.breakpoints?.tablet ? `${globalTheme.variables?.breakpoints?.tablet}px` : '991px',
	};

	const props = mergeProps('search', globalTheme, defaultProps, properties);

	const {
		disableStyles,
		className,
		controller,
		hideSidebar,
		toggleSidebarButtonText,
		hideTopToolbar,
		hideMiddleToolbar,
		hideBottomToolBar,
		resultComponent,
		hideToggleSidebarButton,
		mobileDisplayAt,
		toggleSidebarStartClosed,
		treePath,
	} = props;

	// handle selected layoutOptions
	if (globalTheme?.name && props.layoutOptions) {
		useLayoutOptions(props, globalTheme);
	}

	const store = controller.store;

	const isMobile = useMediaQuery(`(max-width: ${mobileDisplayAt})`);

	const [sidebarOpenState, setSidebarOpenState] = useState(Boolean(!toggleSidebarStartClosed));

	//initialize lang
	const defaultLang: Partial<SearchLang> = {
		toggleSidebarButtonText: {
			value: toggleSidebarButtonText,
		},
	};

	//deep merge with props.lang
	const lang = deepmerge(defaultLang, props.lang || {});
	const mergedLang = useLang(lang as any, { filters: store.filters, sidebarOpenState: sidebarOpenState });

	const ToggleSidebar = (): JSX.Element => {
		return (
			<div
				onClick={() => setSidebarOpenState(!sidebarOpenState)}
				className={classnames('ss__search__sidebar-toggle', { 'ss__search__sidebar-toggle--open': sidebarOpenState })}
			>
				<span {...mergedLang.toggleSidebarButtonText.all}></span>
			</div>
		);
	};

	const subProps: SearchSubProps = {
		TopToolbar: {
			// default props
			name: 'top',
			className: 'ss__search__header-section__toolbar--top-toolbar',
			layout: ['searchHeader', 'banner.header', 'button.sidebar-toggle'],
			toggleSideBarButton:
				!hideToggleSidebarButton && store.loaded && !isMobile && (toggleSidebarButtonText || mergedLang.toggleSidebarButtonText?.value)
					? () => <ToggleSidebar />
					: undefined,
			...defined({
				disableStyles,
			}),
			theme: props.theme,
			treePath,
		},
		MiddleToolbar: {
			// default props
			name: 'middle',
			className: 'ss__search__content__toolbar--middle-toolbar',
			layout: isMobile
				? [['paginationInfo', '_', 'mobileSidebar'], ['sortBy', 'perPage'], ['banner.banner']]
				: [['sortBy', 'perPage', '_', 'paginationInfo'], ['banner.banner']],
			// inherited props
			...defined({
				disableStyles,
			}),
			theme: props.theme,
			treePath,
		},
		BottomToolbar: {
			// default props
			name: 'bottom',
			className: 'ss__search__content__toolbar--bottom-toolbar',
			layout: [['banner.footer'], ['_', 'pagination']],
			// inherited props
			...defined({
				disableStyles,
			}),
			theme: props.theme,
			treePath,
		},
		Sidebar: {
			// default props
			name: 'search',
			layout: [['filterSummary'], ['facets'], ['banner.left']],
			// inherited props
			...defined({
				disableStyles,
			}),
			theme: props.theme,
			treePath,
		},
		Results: {
			name: 'search',
			// default props
			resultComponent: resultComponent,
			// inherited props
			...defined({
				disableStyles,
			}),
			theme: props.theme,
			treePath,
		},
		NoResults: {
			// default props
			// inherited props
			...defined({
				disableStyles,
			}),
			theme: props.theme,
			treePath,
		},
	};

	const styling = mergeStyles<SearchProps>(props, defaultStyles);

	return (
		<CacheProvider>
			<div
				{...styling}
				className={classnames('ss__search', className, {
					'ss__search--sidebar-open': sidebarOpenState,
				})}
			>
				<div className="ss__search__header-section">
					{!hideTopToolbar && store.pagination.totalResults > 0 && <Toolbar {...subProps.TopToolbar} controller={controller} />}
				</div>
				<div className="ss__search__main-section">
					{!hideSidebar && !isMobile && sidebarOpenState && (
						<div className="ss__search__sidebar">
							<Sidebar {...subProps.Sidebar} controller={controller} />
						</div>
					)}
					<div className={classnames('ss__search__content')}>
						{!hideMiddleToolbar && store.pagination.totalResults > 0 && <Toolbar {...subProps.MiddleToolbar} controller={controller} />}

						{store.pagination.totalResults ? (
							<Results {...subProps.Results} controller={controller} />
						) : (
							store.pagination.totalResults === 0 && <NoResults {...subProps.NoResults} controller={controller} />
						)}

						{!hideBottomToolBar && store.pagination.totalResults > 0 && <Toolbar {...subProps.BottomToolbar} controller={controller} />}
					</div>
				</div>
			</div>
		</CacheProvider>
	);
});

//todo improve the controller spreading here..
export interface SearchProps extends ComponentProps {
	controller: SearchController;
	mobileDisplayAt?: string;
	resultComponent?: ResultComponent;
	hideSidebar?: boolean;
	hideTopToolbar?: boolean;
	hideMiddleToolbar?: boolean;
	hideBottomToolBar?: boolean;
	toggleSidebarButtonText?: string;
	toggleSidebarStartClosed?: boolean;
	hideToggleSidebarButton?: boolean;
	lang?: Partial<SearchLang>;
	layoutOptions?: ListOption[];
}

export interface SearchLang {
	toggleSidebarButtonText?: Lang<{ filters: SearchFilterStore; sidebarOpenState: boolean }>;
}

interface SearchSubProps {
	Results: Partial<ResultsProps>;
	NoResults: Partial<NoResultsProps>;
	Sidebar: Partial<SidebarProps>;
	TopToolbar: Partial<ToolbarProps>;
	MiddleToolbar: Partial<ToolbarProps>;
	BottomToolbar: Partial<ToolbarProps>;
}
