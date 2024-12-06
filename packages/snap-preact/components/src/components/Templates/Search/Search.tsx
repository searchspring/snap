import { Fragment, h } from 'preact';
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
import { Lang, useMediaQuery } from '../../../hooks';
import { MobileSidebar, MobileSidebarProps } from '../../Organisms/MobileSidebar';
import { Button, ButtonProps } from '../../Atoms/Button';
import { Banner, BannerProps } from '../../Atoms/Merchandising';
import { ContentType } from '@searchspring/snap-store-mobx';
import { useState } from 'preact/hooks';
import deepmerge from 'deepmerge';

const defaultStyles: StyleScript<SearchProps> = () => {
	return css({
		display: 'flex',
		minHeight: '600px',

		'.ss__sidebar': {
			flex: '0 1 auto',
			width: '270px',
			margin: '0 40px 0 0',
		},

		'.ss__search__content': {
			flex: '1 1 0%',
			padding: '0px 10px',
			width: '100%',
			boxSizing: 'border-box',
		},
	});
};

export const Search = observer((properties: SearchProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const defaultProps: Partial<SearchProps> = {
		mobileSidebarDisplayAt: globalTheme?.variables?.breakpoints?.at(0) ? `${globalTheme.variables?.breakpoints?.at(0)}px` : '991px',
	};

	const props = mergeProps('search', globalTheme, defaultProps, properties);

	const {
		disableStyles,
		className,
		controller,
		hideSidebar,
		hideSearchHeader,
		hideMobileSidebar,
		hideMerchandisingBanners,
		toggleSidebarButtonText,
		hideTopToolbar,
		resultComponent,
		hideBottomToolBar,
		hideToggleSidebarButton,
		mobileSidebarDisplayAt,
		treePath,
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
			theme: props.theme,
			treePath,
		},
		Button: {
			// default props
			// inherited props
			...defined({
				disableStyles,
			}),
			theme: props.theme,
			treePath,
		},
		TopToolbar: {
			name: 'top',
			// default props
			hidePagination: true,
			hideFilterSummary: true,
			// inherited props
			...defined({
				disableStyles,
			}),
			theme: props.theme,
			treePath,
		},
		BottomToolbar: {
			name: 'bottom',
			// default props
			hideFilterSummary: true,
			hidePerPage: true,
			hideSortBy: true,
			hideLayoutSelector: true,
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

	//initialize lang
	const defaultLang: Partial<SearchLang> = {
		toggleSidebarButtonText: {
			value: toggleSidebarButtonText,
		},
	};

	//deep merge with props.lang
	const lang = deepmerge(defaultLang, props.lang || {});

	return (
		<CacheProvider>
			<div {...styling} className={classnames('ss__search', className)}>
				{!hideSidebar && !isMobile && (
					<div className="ss__search__sidebar-wrapper">
						{sidebarOpenState && (
							<Fragment>
								<Sidebar {...subProps.Sidebar} controller={controller} />
								{!hideLeftBanner && <Banner content={merchandising.content} type={ContentType.LEFT} name={'left'} />}
							</Fragment>
						)}
					</div>
				)}
				<div className={classnames('ss__search__content')}>
					{!hideSearchHeader && <SearchHeader {...subProps.SearchHeader} controller={controller} />}
					{!hideHeaderBanner && <Banner content={merchandising.content} type={ContentType.HEADER} name={'header'} />}
					{!hideBannerBanner && <Banner content={merchandising.content} type={ContentType.BANNER} name={'banner'} />}

					{!hideToggleSidebarButton && (toggleSidebarButtonText || lang.toggleSidebarButtonText?.value) && (
						<Button
							onClick={() => setSidebarOpenState(!sidebarOpenState)}
							className="ss__search__sidebar-wrapper-toggle"
							{...subProps.Button}
							lang={{
								button: lang.toggleSidebarButtonText,
							}}
						></Button>
					)}

					{!hideTopToolbar && store.pagination.totalResults > 0 && (
						<Toolbar {...subProps.TopToolbar} className="ss__search__content__toolbar--top-toolbar" controller={controller} />
					)}

					{!hideMobileSidebar && store.pagination.totalResults > 0 && <MobileSidebar controller={controller} {...subProps.MobileSidebar} />}

					{store.pagination.totalResults ? (
						<Results {...subProps.Results} controller={controller} />
					) : (
						store.pagination.totalResults === 0 && <NoResults {...subProps.NoResults} controller={controller} />
					)}

					{!hideFooterBanner && <Banner content={merchandising.content} type={ContentType.FOOTER} name={'footer'} />}

					{!hideBottomToolBar && store.pagination.totalResults > 0 && (
						<Toolbar {...subProps.BottomToolbar} className="ss__search__content__toolbar--bottom-toolbar" controller={controller} />
					)}
				</div>
			</div>
		</CacheProvider>
	);
});

//todo improve the controller spreading here..
export interface SearchProps extends ComponentProps {
	controller: SearchController;
	mobileSidebarDisplayAt?: string;
	resultComponent?: ResultComponent;
	hideSidebar?: boolean;
	hideMobileSidebar?: boolean;
	hideSearchHeader?: boolean;
	hideTopToolbar?: boolean;
	hideBottomToolBar?: boolean;
	hideMerchandisingBanners?: boolean | string[];
	toggleSidebarButtonText?: string;
	hideToggleSidebarButton?: boolean;
	lang?: Partial<SearchLang>;
}

export interface SearchLang {
	toggleSidebarButtonText?: Lang<never>;
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
	BottomToolbar: Partial<ToolbarProps>;
	SearchHeader: Partial<SearchHeaderProps>;
	MobileSidebar: Partial<MobileSidebarProps>;
	Button: Partial<ButtonProps>;
	Banner: Partial<BannerProps>;
}
