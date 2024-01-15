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
import { Toolbar, ToolbarProps } from '../../Organisms/Toolbar';
import { SearchHeader, SearchHeaderProps } from '../../Atoms/SearchHeader';
import { NoResults, NoResultsProps } from '../../Atoms/NoResults';
import { Banner, BannerProps } from '../../Atoms/Merchandising';
import { ContentType } from '@searchspring/snap-store-mobx';
import { useState } from 'preact/hooks';
import { LayoutSelector, LayoutSelectorProps } from '../../Molecules/LayoutSelector';
import { Result } from '../../Molecules/Result';
import { HorizontalFacets, HorizontalFacetsProps } from '../../Organisms/HorizontalFacets';

const CSS = {
	HorizontalSearch: ({}: Partial<HorizontalSearchProps>) => css({}),
};

export const HorizontalSearch = observer((properties: HorizontalSearchProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const defaultProps: Partial<HorizontalSearchProps> = {
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
		hideTopToolbar,
		hideLayoutSelector,
		resultComponent,
		hideBottomToolBar,
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
		HorizontalFacets: {
			// default props
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
		},
		LayoutSelector: {
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

	const merchandising = controller.store.merchandising;

	// let hideLeftBanner; // TODO: Where should left banner go for horizontal layout?
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
				// if (type.toLowerCase() == 'left') {
				// 	hideLeftBanner = true;
				// }
			});
		}
	}

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

				<HorizontalFacets {...subProps.HorizontalFacets} facets={store.facets} controller={controller} />

				<div className={classnames('ss__horizontal-search__content')}>
					{layoutConfig?.options && store.pagination.totalResults > 0 && !hideLayoutSelector && (
						<LayoutSelector
							{...subProps.LayoutSelector}
							selected={layoutState}
							onSelect={(e, option) => changeLayout(e, option as ListOption)}
							options={layoutConfig?.options}
						/>
					)}

					{!hideHeaderBanner && <Banner {...subProps.Banner} content={merchandising.content} type={ContentType.HEADER} />}
					{!hideBannerBanner && <Banner {...subProps.Banner} content={merchandising.content} type={ContentType.BANNER} />}

					{!hideTopToolbar && store.pagination.totalResults > 0 && (
						<Toolbar
							{...subProps.TopToolbar}
							className="ss__horizontal-search__content__toolbar--top-toolbar"
							name={'topToolBar'}
							controller={controller}
						/>
					)}

					<div className="clear"></div>

					{store.pagination.totalResults ? (
						<Results {...subProps.Results} controller={controller} breakpoints={{}} />
					) : (
						store.pagination.totalResults === 0 && <NoResults {...subProps.NoResults} controller={controller} />
					)}

					{!hideFooterBanner && <Banner {...subProps.Banner} content={merchandising.content} type={ContentType.FOOTER} />}

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
	resultComponent?: ResultComponent;
	hideSearchHeader?: boolean;
	hideTopToolbar?: boolean;
	hideBottomToolBar?: boolean;
	hideMerchandisingBanners?: boolean | string[];
	hideLayoutSelector?: boolean;
	layoutConfig?: layoutConfig;
}

type layoutConfig = {
	options: ListOption[];
	default?: ListOption | string;
};

interface HorizontalSearchSubProps {
	HorizontalFacets: Partial<HorizontalFacetsProps>;
	LayoutSelector: Partial<LayoutSelectorProps>;
	Banner: Partial<BannerProps>;
	TopToolbar: Partial<ToolbarProps>;
	BottomToolbar: Partial<ToolbarProps>;
	SearchHeader: Partial<SearchHeaderProps>;
	Results: Partial<ResultsProps>;
	NoResults: Partial<NoResultsProps>;
}
