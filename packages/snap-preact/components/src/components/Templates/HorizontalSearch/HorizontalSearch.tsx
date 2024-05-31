import { h } from 'preact';
import { observer } from 'mobx-react-lite';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import type { SearchController } from '@searchspring/snap-controller';
import { Results, ResultsProps } from '../../Organisms/Results';
import { defined, mergeProps } from '../../../utilities';
import { ComponentProps, ResultComponent, StylingCSS } from '../../../types';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { Toolbar, ToolbarProps } from '../../Organisms/Toolbar';
import { SearchHeader, SearchHeaderProps } from '../../Atoms/SearchHeader';
import { NoResults, NoResultsProps } from '../../Atoms/NoResults';
import { Banner, BannerProps } from '../../Atoms/Merchandising';
import { ContentType } from '@searchspring/snap-store-mobx';
import { HorizontalFacets, HorizontalFacetsProps } from '../../Organisms/HorizontalFacets';

const CSS = {
	HorizontalSearch: ({}: Partial<HorizontalSearchProps>) => css({}),
};

export const HorizontalSearch = observer((properties: HorizontalSearchProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const defaultProps: Partial<HorizontalSearchProps> = {};

	const props = mergeProps('horizontalSearch', globalTheme, defaultProps, properties);

	const {
		disableStyles,
		className,
		controller,
		style,
		styleScript,
		hideSearchHeader,
		hideMerchandisingBanners,
		hideTopToolbar,
		hideMiddleToolbar,
		resultComponent,
		hideBottomToolBar,
	} = props;
	const store = controller.store;

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
		Banner: {
			// default props
			// inherited props
			...defined({
				disableStyles,
			}),
		},
		TopToolbar: {
			// default props
			hideFilterSummary: false,
			hideLayoutSelector: true,
			hideSortBy: true,
			hidePagination: true,
			hidePerPage: true,
			// inherited props
			...defined({
				disableStyles,
			}),
		},
		MiddleToolbar: {
			// default props
			hideFilterSummary: true,
			hidePagination: true,
			hideSortBy: false,
			hidePerPage: false,
			// inherited props
			...defined({
				disableStyles,
			}),
		},
		BottomToolbar: {
			// default props
			hideFilterSummary: true,
			hidePerPage: true,
			hideSortBy: true,
			// inherited props
			...defined({
				disableStyles,
			}),
		},
		SearchHeader: {
			// default props
			// inherited props
			...defined({
				disableStyles,
			}),
		},
		Results: {
			// default props
			resultComponent: resultComponent,
			name: 'searchResults',
			// inherited props
			...defined({
				disableStyles,
			}),
		},
		NoResults: {
			// default props
			// inherited props
			...defined({
				disableStyles,
			}),
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

	let hideHeaderBanner;
	let hideBannerBanner;
	let hideFooterBanner;

	if (hideMerchandisingBanners) {
		if (typeof hideMerchandisingBanners == 'boolean') {
			//hide all
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
			});
		}
	}

	return (
		<CacheProvider>
			<div {...styling} className={classnames('ss__horizontal-search', className)}>
				{!hideSearchHeader && <SearchHeader {...subProps.SearchHeader} controller={controller} />}

				{!hideTopToolbar && store.pagination.totalResults > 0 && (
					<Toolbar
						{...subProps.TopToolbar}
						className="ss__horizontal-search__content__toolbar--top-toolbar"
						name={'topToolBar'}
						controller={controller}
					/>
				)}
				<HorizontalFacets {...subProps.HorizontalFacets} facets={store.facets} controller={controller} />

				<div className={classnames('ss__horizontal-search__content')}>
					{!hideHeaderBanner && <Banner {...subProps.Banner} content={merchandising.content} type={ContentType.HEADER} />}
					{!hideBannerBanner && <Banner {...subProps.Banner} content={merchandising.content} type={ContentType.BANNER} />}

					{!hideMiddleToolbar && store.pagination.totalResults > 0 && (
						<Toolbar
							{...subProps.MiddleToolbar}
							className="ss__horizontal-search__content__toolbar--middle-toolbar"
							name={'middleToolBar'}
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
	hideMiddleToolbar?: boolean;
	hideBottomToolBar?: boolean;
	hideMerchandisingBanners?: boolean | string[];
}

interface HorizontalSearchSubProps {
	HorizontalFacets: Partial<HorizontalFacetsProps>;
	Banner: Partial<BannerProps>;
	TopToolbar: Partial<ToolbarProps>;
	MiddleToolbar: Partial<ToolbarProps>;
	BottomToolbar: Partial<ToolbarProps>;
	SearchHeader: Partial<SearchHeaderProps>;
	Results: Partial<ResultsProps>;
	NoResults: Partial<NoResultsProps>;
}
