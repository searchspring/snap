import { h } from 'preact';
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
import { SearchHeader, SearchHeaderProps } from '../../Atoms/SearchHeader';
import { NoResults, NoResultsProps } from '../../Organisms/NoResults';
import { Lang, useLang, useMediaQuery } from '../../../hooks';
import { Button, ButtonProps } from '../../Atoms/Button';
import { Banner, BannerProps } from '../../Atoms/Merchandising';
import { ContentType, SearchFilterStore } from '@searchspring/snap-store-mobx';
import { useState } from 'preact/hooks';
import deepmerge from 'deepmerge';

const defaultStyles: StyleScript<SearchProps> = () => {
	return css({
		'.ss__search__content-section': {
			display: 'flex',
			minHeight: '600px',
			gap: '1.5em',
		},

		'.ss__search__header-section__toolbar--top-toolbar': {
			justifyContent: 'flex-end',
		},

		'.ss__search__content__toolbar--middle-toolbar': {
			justifyContent: 'flex-start',
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

export const Search = observer((properties: SearchProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const defaultProps: Partial<SearchProps> = {
		toggleSidebarButtonText: 'Filters',
		hideToggleSidebarButton: true,
		mobileDisplayAt: globalTheme?.variables?.breakpoints?.at(0) ? `${globalTheme.variables?.breakpoints?.at(0)}px` : '991px',
	};

	const props = mergeProps('search', globalTheme, defaultProps, properties);

	const {
		disableStyles,
		className,
		controller,
		hideSidebar,
		hideSearchHeader,
		hideMerchandisingBanners,
		toggleSidebarButtonText,
		hideTopToolbar,
		hideMiddleToolbar,
		hideBottomToolBar,
		resultComponent,
		hideToggleSidebarButton,
		mobileDisplayAt,
		treePath,
	} = props;
	const store = controller.store;

	const mobileMediaQuery = `(max-width: ${mobileDisplayAt})`;
	const isMobile = useMediaQuery(mobileMediaQuery);
	const merchandising = controller.store.merchandising;

	const [sidebarOpenState, setSidebarOpenState] = useState(true);

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
			<Button
				onClick={() => setSidebarOpenState(!sidebarOpenState)}
				className={classnames('ss__search__sidebar-toggle', { 'ss__search__sidebar-toggle--open': sidebarOpenState })}
				{...subProps.Button}
			>
				<span {...mergedLang.toggleSidebarButtonText.all}></span>
			</Button>
		);
	};

	const subProps: SearchSubProps = {
		Button: {
			name: 'filter-toggle',
			// default props
			// inherited props
			...defined({
				disableStyles,
			}),
			theme: props.theme,
			treePath,
		},
		TopToolbar: {
			// default props
			name: 'top',
			className: 'ss__search__header-section__toolbar--top-toolbar',
			modules: ['PaginationInfo'],
			topSlot:
				!hideToggleSidebarButton && store.loaded && !isMobile && (toggleSidebarButtonText || mergedLang.toggleSidebarButtonText?.value) ? (
					<ToggleSidebar />
				) : undefined,

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
			modules: ['SortBy', 'PerPage'],
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
			modules: ['Pagination'],
			// inherited props
			...defined({
				disableStyles,
			}),
			theme: props.theme,
			treePath,
		},
		Sidebar: {
			// default props
			hidePerPage: true,
			hideSortBy: true,
			hideFilterSummary: true,
			// inherited props
			...defined({
				disableStyles,
			}),
			theme: props.theme,
			treePath,
		},
		SearchHeader: {
			// default props
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
		Banner: {
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

	return (
		<CacheProvider>
			<div {...styling} className={classnames('ss__search', className)}>
				<div className="ss__search__header-section">
					{!hideSearchHeader && <SearchHeader {...subProps.SearchHeader} controller={controller} />}
					{!hideHeaderBanner && <Banner content={merchandising.content} type={ContentType.HEADER} name={'header'} />}
					{!hideTopToolbar && store.pagination.totalResults > 0 && <Toolbar {...subProps.TopToolbar} controller={controller} />}
				</div>
				<div className="ss__search__content-section">
					{!hideSidebar && !isMobile && sidebarOpenState && (
						<div className="ss__search__sidebar">
							<Sidebar {...subProps.Sidebar} controller={controller} />
							{!hideLeftBanner && <Banner content={merchandising.content} type={ContentType.LEFT} name={'left'} />}
						</div>
					)}
					<div className={classnames('ss__search__content')}>
						{!hideBannerBanner && <Banner content={merchandising.content} type={ContentType.BANNER} name={'banner'} />}

						{!hideMiddleToolbar && store.pagination.totalResults > 0 && <Toolbar {...subProps.MiddleToolbar} controller={controller} />}

						{store.pagination.totalResults ? (
							<Results {...subProps.Results} controller={controller} />
						) : (
							store.pagination.totalResults === 0 && <NoResults {...subProps.NoResults} controller={controller} />
						)}

						{!hideFooterBanner && <Banner content={merchandising.content} type={ContentType.FOOTER} name={'footer'} />}

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
	hideSearchHeader?: boolean;
	hideTopToolbar?: boolean;
	hideMiddleToolbar?: boolean;
	hideBottomToolBar?: boolean;
	hideMerchandisingBanners?: boolean | string[];
	toggleSidebarButtonText?: string;
	hideToggleSidebarButton?: boolean;
	lang?: Partial<SearchLang>;
}

export interface SearchLang {
	toggleSidebarButtonText?: Lang<{ filters: SearchFilterStore; sidebarOpenState: boolean }>;
}

export type layoutConfig = {
	options: ListOption[];
	default?: ListOption | string;
};

interface SearchSubProps {
	Results: Partial<ResultsProps>;
	NoResults: Partial<NoResultsProps>;
	Sidebar: Partial<SidebarProps>;
	TopToolbar: Partial<ToolbarProps>;
	MiddleToolbar: Partial<ToolbarProps>;
	BottomToolbar: Partial<ToolbarProps>;
	SearchHeader: Partial<SearchHeaderProps>;
	Button: Partial<ButtonProps>;
	Banner: Partial<BannerProps>;
}
