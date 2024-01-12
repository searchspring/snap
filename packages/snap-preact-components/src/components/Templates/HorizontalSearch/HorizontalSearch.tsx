/** @jsx jsx */
import { h } from 'preact';
import { observer } from 'mobx-react-lite';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import type { SearchController } from '@searchspring/snap-controller';
import { Results, ResultsProps } from '../../Organisms/Results';
import { defined, mergeProps } from '../../../utilities';
import { ComponentProps, ListOption, ResultComponent, ResultsLayout, StylingCSS } from '../../../types';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { SidebarProps } from '../../Organisms/Sidebar';
import { Toolbar, ToolbarProps } from '../../Organisms/Toolbar';
import { SearchHeader, SearchHeaderProps } from '../../Atoms/SearchHeader';
import { NoResults, NoResultsProps } from '../../Atoms/NoResults';
import { MobileSidebarProps } from '../../Organisms/MobileSidebar';
import { Button, ButtonProps } from '../../Atoms/Button';
import { Banner, BannerProps } from '../../Atoms/Merchandising';
import { ContentType } from '@searchspring/snap-store-mobx';
import { useState } from 'preact/hooks';
import { LayoutSelector } from '../../Molecules/LayoutSelector';
import { Result } from '../../Molecules/Result';
import { Icon } from '../../Atoms/Icon';
import { HorizontalFacets } from '../../Organisms/HorizontalFacets';

const CSS = {
	HorizontalSearch: ({ mobileSidebarDisplayAt: slideOutToggleWidth }: Partial<HorizontalSearchProps>) =>
		css({
			// display: 'flex',
			// minHeight: '600px',

			'.ss__horizontal-search__sidebar': {
				flex: '0 1 auto',
				width: '250px',
				margin: '0 40px 0 0',
			},

			'.ss_desktop': {
				[`@media only screen and (max-width: ${slideOutToggleWidth})`]: {
					display: 'none',
				},
			},

			'.ss__horizontal-search__content': {
				flex: '1 1 0%',
				padding: '0px 10px',
			},

			[`@media only screen and (max-width: ${slideOutToggleWidth})`]: {
				flexDirection: 'column',
			},

			'.ss__horizontal-search__content__toolbar--top-toolbar': {
				display: 'flex',
				justifyContent: 'flex-end',
				margin: '10px 0px',
			},

			'.ss__layout__select': {
				float: 'left',
			},
		}),
};

export const HorizontalSearch = observer((properties: HorizontalSearchProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const defaultProps: Partial<HorizontalSearchProps> = {
		mobileSidebarDisplayAt: '991px',
		layoutConfig: {
			options: [
				{
					label: '1 wide',
					value: '1 wide',
					icon: 'square',
					columns: 1,
				},
				{
					label: '2 wide',
					value: '2 wide',
					icon: {
						icon: 'layout-large',
					},
					columns: 2,
				},
				{
					label: '3 wide',
					value: '3 wide',
					icon: {
						icon: 'layout-grid',
					},
					columns: 3,
				},
				{
					label: '4 wide',
					value: '4 wide',
					columns: 4,
				},
				{
					label: 'list',
					value: 'list',
					icon: {
						icon: 'layout-list',
					},
					component: (props) => <Result {...props} controller={controller} layout={ResultsLayout.LIST} />,
					columns: 1,
				},
			],
		},
	};

	const props = mergeProps('horizontalSearch', globalTheme, defaultProps, properties);

	const {
		disableStyles,
		className,
		controller,
		style,
		styleScript,
		hideSearchHeader,
		layoutConfig,
		hideMerchandisingBanners,
		toggleSidebarButtonText,
		hideTopToolbar,
		hideLayoutSelector,
		resultComponent,
		hideBottomToolBar,
		mobileSidebarDisplayAt,
	} = props;
	const store = controller.store;

	//get current layout from controller local storage
	let storedLayoutState: string | ListOption | null = controller.storage.get('currentLayoutState');
	if (storedLayoutState) {
		storedLayoutState = JSON.parse(storedLayoutState as string);

		layoutConfig?.options.map((option) => {
			if (option.label == (storedLayoutState as ListOption)!.label && option.component) {
				(storedLayoutState as ListOption)!.component = option.component;
			}
		});
	}

	let defaultLayout: ListOption = {
		label: '4 wide',
		value: '4 wide',
		columns: 4,
	};

	if (layoutConfig?.default) {
		if (typeof layoutConfig.default == 'string') {
			defaultLayout = layoutConfig.options.filter((option) => option.value == layoutConfig.default)[0];
		} else {
			defaultLayout = layoutConfig.default;
		}
	}

	const [layoutState, setLayoutState] = useState((storedLayoutState as ListOption) || defaultLayout);

	const subProps: HorizontalSearchSubProps = {
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
			resultComponent: layoutState ? layoutState.component : resultComponent,
			columns: layoutState ? layoutState.columns : 4,
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
		styling.css = [CSS.HorizontalSearch(stylingProps), style];
	} else if (style) {
		styling.css = [style];
	}

	// const mobileMediaQuery = `(max-width: ${mobileSidebarDisplayAt})`;
	// const isMobile = useMediaQuery(mobileMediaQuery);
	const merchandising = controller.store.merchandising;

	// let hideLeftBanner;
	let hideHeaderBanner;
	let hideBannerBanner;
	let hideFooterBanner;

	if (hideMerchandisingBanners) {
		if (typeof hideMerchandisingBanners == 'boolean') {
			//hide all
			// hideLeftBanner = true;
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

	const changeLayout = (e: any, option?: ListOption) => {
		if (option) {
			//set current layout in controller local storage
			controller.storage.set('currentLayoutState', JSON.stringify(option));
			setLayoutState(option);
		}
	};

	return (
		<CacheProvider>
			<div {...styling} className={classnames('ss__horizontal-search', className)}>
				{!hideSearchHeader && <SearchHeader {...subProps.SearchHeader} controller={controller} />}

				<div className="ss__horizontal-search__facets">
					{/* <FilterSummary inline={true} layout={demo.selected.filterSummary ? demo.selected.filterSummary : 'grid'} /> */}
					<HorizontalFacets facets={store.facets} controller={controller} />
				</div>

				<div className={classnames('ss__horizontal-search__content')}>
					{layoutConfig?.options && store.pagination.totalResults > 0 && !hideLayoutSelector && (
						<LayoutSelector selected={layoutState} onSelect={(e, option) => changeLayout(e, option as ListOption)} options={layoutConfig?.options} />
					)}

					{!hideHeaderBanner && <Banner content={merchandising.content} type={ContentType.HEADER} />}
					{!hideBannerBanner && <Banner content={merchandising.content} type={ContentType.BANNER} />}

					{toggleSidebarButtonText && (
						<Button
							onClick={() => setSidebarOpenState(!sidebarOpenState)}
							className="ss__horizontal-search__sidebar-wrapper-toggle"
							name={'search__sidebar-wrapper-toggle-button'}
							{...subProps.Button}
						>
							{toggleSidebarButtonText}
						</Button>
					)}

					{!hideTopToolbar && store.pagination.totalResults > 0 && (
						<Toolbar
							{...subProps.TopToolbar}
							className="ss__horizontal-search__content__toolbar--top-toolbar"
							name={'topToolBar'}
							controller={controller}
						/>
					)}

					{/* {!hideMobileSidebar && store.pagination.totalResults > 0 && <MobileSidebar controller={controller} {...subProps.MobileSidebar} />} */}

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
							className="ss__horizontal-search__content__toolbar--bottom-toolbar"
							controller={controller}
						/>
					)}
				</div>
			</div>
		</CacheProvider>
	);
});

//todo improve the controller spreading here..
export interface HorizontalSearchProps extends ComponentProps {
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
	hideLayoutSelector?: boolean;
	layoutConfig?: layoutConfig;
}

type layoutConfig = {
	options: ListOption[];
	default?: ListOption | string;
};

interface HorizontalSearchSubProps {
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

export const DropdownButton = (props: any) => {
	const { buttonLabel } = props;

	return (
		<>
			<span className="ss__dropdown__button__label">
				{buttonLabel && (
					<>
						<strong>{buttonLabel}</strong>{' '}
					</>
				)}
			</span>
			<span className="ss__icon__wrapper">
				<Icon icon={'arrowDown'} />
			</span>
		</>
	);
};
export const DropdownContent = (props: any) => {
	const { values, toggleOpen } = props;

	return (
		<div className="ss__list">
			{values.map((value: any) => (
				<div className={classnames('ss__list__option', { ss__active: value.active })} key={value.value || value.label}>
					<a
						className="ss__list__link ss__pointer"
						href={value.url.link.href}
						onClick={(e) => {
							value.url.link.onClick(e);
							toggleOpen();
						}}
					>
						{value.label}
					</a>
				</div>
			))}
		</div>
	);
};
