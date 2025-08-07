import { h } from 'preact';

import { css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { Theme, useTheme, CacheProvider, useTreePath } from '../../../providers';
import type { ComponentProps, StyleScript } from '../../../types';
import { FilterSummary, FilterSummaryProps } from '../FilterSummary';
import { defined, mergeProps, mergeStyles } from '../../../utilities';
import { Pagination, PaginationProps } from '../../Molecules/Pagination';
import { LoadMore, LoadMoreProps } from '../../Molecules/LoadMore';
import type { SearchController } from '@searchspring/snap-controller';
import { SortBy, SortByProps } from '../../Molecules/SortBy';
import { PerPage, PerPageProps } from '../../Molecules/PerPage';
import { LayoutSelector, LayoutSelectorProps } from '../../Molecules/LayoutSelector';
import { MobileSidebar, MobileSidebarProps } from '../MobileSidebar';
import { PaginationInfo, PaginationInfoProps } from '../../Atoms/PaginationInfo/PaginationInfo';
import { SearchHeader, SearchHeaderProps } from '../../Atoms/SearchHeader/SearchHeader';
import { Button, ButtonProps } from '../../Atoms/Button';
import { Banner, BannerProps } from '../../Atoms/Merchandising';
import { ContentType } from '@searchspring/snap-store-mobx';
import { Facets, FacetsProps } from '../Facets';
import { FacetsHorizontal, FacetsHorizontalProps } from '../FacetsHorizontal';
import { useCleanUpEmptyDivs } from '../../../hooks/useCleanUpEmptyDivs';
import { Breadcrumbs } from '../../Atoms/Breadcrumbs';

const defaultStyles: StyleScript<LayoutProps> = ({}) => {
	return css({
		display: 'flex',
		alignItems: 'center',
		flexWrap: 'wrap',
		gap: '10px',
		'.ss__layout__separator': {
			flex: '1 1 auto',
		},
		'.ss__layout__row:empty': {
			display: 'none',
		},
		'.ss__layout__row': {
			display: 'flex',
			alignItems: 'center',
			flexWrap: 'wrap',
			flexBasis: '100%',
			minWidth: '100%',
			gap: '10px',
			'& > div:only-child': {
				width: '100%',
			},
		},
	});
};

export const Layout = observer((properties: LayoutProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const globalTreePath = useTreePath();

	const defaultProps: Partial<LayoutProps> = {
		treePath: globalTreePath,
	};

	const props = mergeProps('layout', globalTheme, defaultProps, properties);
	const { controller, toggleSideBarButton, disableStyles, className, treePath, layout } = props;

	delete props.treePath;

	const styling = mergeStyles<LayoutProps>(props, defaultStyles);

	const subProps: LayoutSubProps = {
		MobileSidebar: {
			// default props
			controller,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
			treePath,
		},
		Banner: {
			// default props
			content: controller.store.merchandising.content,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
			treePath,
		},
		SearchHeader: {
			// default props
			controller,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
			treePath,
		},
		FilterSummary: {
			// default props
			controller,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
			treePath,
		},
		LayoutSelector: {
			// default props
			controller,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
			treePath,
		},
		Facets: {
			// default props
			controller,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
			treePath,
		},
		FacetsHorizontal: {
			// default props
			controller,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
			treePath,
		},
		Pagination: {
			// default props
			controller,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
			treePath,
		},
		PaginationInfo: {
			// default props
			controller,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
			treePath,
		},
		LoadMore: {
			// default props
			controller,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
			treePath,
		},
		SortBy: {
			// default props
			controller,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
			treePath,
		},
		PerPage: {
			// default props
			controller,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
			treePath,
		},
		// Breadcrumbs: {
		// 	// default props
		// 	controller,
		// 	// inherited props
		// 	...defined({
		// 		disableStyles,
		// 	}),
		// 	// component theme overrides
		// 	theme: props?.theme,
		// 	treePath,
		// },
		ToggleSideBarButton: {
			// default props
			...toggleSideBarButton,
			controller,
			name: 'sidebar-toggle',
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
			treePath,
		},
	};

	const ToggleSideBarButton = toggleSideBarButton;

	const hasResults = controller.store.pagination.totalResults > 0;

	function renderModule(module: ModuleNames) {
		switch (module) {
			case 'mobileSidebar':
				if (hasResults) {
					return <MobileSidebar controller={controller} {...subProps.MobileSidebar} />;
				}
				break;

			case 'searchHeader':
				return <SearchHeader {...subProps.SearchHeader} />;

			case 'filterSummary':
				if (hasResults) {
					return <FilterSummary {...subProps.FilterSummary} />;
				}
				break;
			case 'layoutSelector':
				if (hasResults) {
					return <LayoutSelector {...subProps.LayoutSelector} />;
				}
				break;
			case 'paginationInfo':
				if (hasResults) {
					return <PaginationInfo {...subProps.PaginationInfo} />;
				}
				break;
			case 'sortBy':
				if (hasResults) {
					return <SortBy {...subProps.SortBy} />;
				}
				break;
			case 'perPage':
				if (hasResults) {
					return <PerPage {...subProps.PerPage} />;
				}
				break;
			case 'button.sidebar-toggle':
				if (hasResults) {
					return (
						ToggleSideBarButton && (
							<div className="ss__button--sidebar-toggle-button-wrapper">
								<Button {...subProps.ToggleSideBarButton}></Button>
							</div>
						)
					);
				}
				break;
			case 'pagination':
				if (hasResults) {
					if (controller.config.settings?.infinite) {
						return <LoadMore {...subProps.LoadMore} />;
					} else {
						return <Pagination {...subProps.Pagination} />;
					}
				}
				break;
			case 'breadcrumbs':
				if (hasResults) {
					return <Breadcrumbs />;
				}
				break;
			case '_':
				return <div className={`ss__layout__separator ss__layout__separator--${separatorIndex++}`} />;

			case 'banner.banner':
				return <Banner {...subProps.Banner} type={ContentType.BANNER} name={'banner'} />;

			case 'banner.footer':
				return <Banner {...subProps.Banner} type={ContentType.FOOTER} name={'footer'} />;

			case 'banner.header':
				return <Banner {...subProps.Banner} type={ContentType.HEADER} name={'header'} />;

			case 'banner.left':
				return <Banner {...subProps.Banner} type={ContentType.LEFT} name={'left'} />;

			case 'facets':
				if (hasResults) {
					return <Facets {...subProps.Facets} />;
				}
				break;
			case 'facetsHorizontal':
				if (hasResults) {
					return <FacetsHorizontal {...subProps.Facets} />;
				}
				break;
			default:
				return null;
		}
	}

	const hasChildrenToRender = layout?.length;

	let rowIndex = 0;
	let separatorIndex = 0;

	useCleanUpEmptyDivs(['.ss__layout__row'], '.ss__layout__separator');

	return hasChildrenToRender ? (
		<CacheProvider>
			<div {...styling} className={classnames('ss__layout', className)}>
				{layout?.map((module) => {
					if (Array.isArray(module)) {
						return (
							<div className={`ss__layout__row ss__layout__row--${rowIndex++}`}>
								{module.map((subModule) => {
									return renderModule(subModule);
								})}
							</div>
						);
					} else {
						return renderModule(module);
					}
				})}
			</div>
		</CacheProvider>
	) : (
		<></>
	);
});

export interface LayoutProps extends ComponentProps {
	controller: SearchController;
	layout: (ModuleNames | ModuleNames[])[];
	toggleSideBarButton?: Partial<ButtonProps>;
}

export type ModuleNames =
	// toolbar
	| 'searchHeader'
	| 'filterSummary'
	| 'mobileSidebar'
	| 'layoutSelector'
	| 'perPage'
	| 'sortBy'
	| 'pagination'
	| 'paginationInfo'
	| 'breadcrumbs'
	| '_'
	| 'button.sidebar-toggle'
	| 'banner.header'
	| 'banner.banner'
	| 'banner.footer'
	// sidebar
	| 'facets'
	| 'facetsHorizontal'
	| 'banner.left';

interface LayoutSubProps {
	MobileSidebar: Partial<MobileSidebarProps>;
	FilterSummary: Partial<FilterSummaryProps>;
	Pagination: Partial<PaginationProps>;
	PaginationInfo: Partial<PaginationInfoProps>;
	LoadMore: Partial<LoadMoreProps>;
	SortBy: Partial<SortByProps>;
	PerPage: Partial<PerPageProps>;
	LayoutSelector: Partial<LayoutSelectorProps>;
	SearchHeader: Partial<SearchHeaderProps>;
	Banner: Partial<BannerProps>;
	Facets: Partial<FacetsProps>;
	FacetsHorizontal: Partial<FacetsHorizontalProps>;
	ToggleSideBarButton: Partial<ButtonProps>;
	// Breadcrumbs: Partial<BreadcrumbsProps>;
}
