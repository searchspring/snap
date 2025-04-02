import { h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { Theme, useTheme, useSnap, CacheProvider, useTreePath } from '../../../providers';
import { ComponentProps, StyleScript } from '../../../types';
import { FilterSummary, FilterSummaryProps } from '../FilterSummary';
import { cloneWithProps, defined, mergeProps, mergeStyles } from '../../../utilities';
import { Pagination, PaginationProps } from '../../Molecules/Pagination';
import { LoadMore, LoadMoreProps } from '../../Molecules/LoadMore';
import { SearchController } from '@searchspring/snap-controller';
import { SortBy, SortByProps } from '../../Molecules/SortBy';
import { PerPage, PerPageProps } from '../../Molecules/PerPage';
import { LayoutSelector, LayoutSelectorProps } from '../../Molecules/LayoutSelector';
import { SnapTemplates } from '../../../../../src';
import { MobileSidebar, MobileSidebarProps } from '../MobileSidebar';
import { PaginationInfo, PaginationInfoProps } from '../../Atoms/PaginationInfo/PaginationInfo';
import { SearchHeader, SearchHeaderProps } from '../../Atoms/SearchHeader/SearchHeader';
import { Button, ButtonProps } from '../../Atoms/Button';
import { Banner, BannerProps } from '../../Atoms/Merchandising';
import { ContentType } from '@searchspring/snap-store-mobx';
import { Facets, FacetsProps } from '../Facets';
import { Lang, useLang } from '../../../hooks';
import deepmerge from 'deepmerge';

const defaultStyles: StyleScript<LayoutProps> = ({}) => {
	return css({
		display: 'flex',
		alignItems: 'center',
		flexWrap: 'wrap',
		gap: '10px',
		'.ss__layout__separator': {
			flex: '1 1 auto',
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

	const snap = useSnap() as SnapTemplates;
	const themeStore = snap?.templates?.getThemeStore(globalTheme.name);

	const defaultProps: Partial<LayoutProps> = {
		treePath: globalTreePath,
		layout: ['MobileSidebar', 'FilterSummary', 'PaginationInfo', 'SortBy', 'PerPage', 'Pagination'],
	};

	const props = mergeProps('layout', globalTheme, defaultProps, properties);
	const { controller, toggleSideBarButton, titleText, disableStyles, className, treePath, layout } = props;

	const styling = mergeStyles<LayoutProps>(props, defaultStyles);

	const subProps: ToolbarSubProps = {
		MobileSidebar: {
			// default props
			controller,
			className: 'ss__layout__mobile-sidebar',
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
			className: 'ss__layout__mobile-sidebar',
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
			className: 'ss__layout__search-header',
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
			className: 'ss__layout__filter-summary',
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
			className: 'ss__layout__layout-selector',
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
			className: 'ss__layout__facets',
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
			className: 'ss__layout__pagination',
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
			className: 'ss__layout__pagination-info',
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
			className: 'ss__layout__load-more',
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
			className: 'ss__layout__sort-by',
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
			className: 'ss__layout__per-page',
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
			treePath,
		},
		ToggleSideBarButton: {
			// default props
			controller,
			className: 'ss__layout__button-toggleSideBarButton',
			name: 'sidebar-toggle',
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
			treePath,
		},
		CloseButton: {
			// default props
			controller,
			className: 'ss__layout__button-CloseButton',
			name: 'sidebar-close',
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
			treePath,
		},
		ClearButton: {
			// default props
			controller,
			className: 'ss__layout__button-clearButton',
			name: 'close-filters',
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
			treePath,
		},
		ApplyButton: {
			// default props
			controller,
			className: 'ss__layout__button-applyButton',
			name: 'apply-filters',

			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
			treePath,
		},
	};

	const defaultLang = {
		titleText: {
			value: titleText || props.lang?.titleText?.value,
		},
	};

	//deep merge with props.lang
	const lang = deepmerge(defaultLang, props.lang || {});
	const mergedLang = useLang(lang as any, {
		controller: controller,
	});

	function renderModule(module: ModuleNames) {
		switch (module) {
			case 'MobileSidebar':
				if (controller.store.pagination.totalResults > 0) {
					return <MobileSidebar controller={controller} {...subProps.MobileSidebar} />;
				}
				break;

			case 'SearchHeader':
				return <SearchHeader {...subProps.SearchHeader} />;

			case 'FilterSummary':
				return <FilterSummary {...subProps.FilterSummary} />;

			case 'LayoutSelector':
				if (themeStore && props.theme?.layoutOptions && props.theme.layoutOptions.length > 0) {
					return (
						<LayoutSelector
							onSelect={(e, option) => {
								if (option) {
									themeStore?.layout.select(option);
								}
							}}
							selected={themeStore?.layout.selected}
							options={props.theme?.layoutOptions}
							{...subProps.LayoutSelector}
						/>
					);
				}
				break;

			case 'PaginationInfo':
				return <PaginationInfo {...subProps.PaginationInfo} />;

			case 'SortBy':
				return <SortBy {...subProps.SortBy} />;

			case 'PerPage':
				return <PerPage {...subProps.PerPage} />;

			case 'Button.toggleSideBar':
				return (
					toggleSideBarButton && (
						<div className="ss__layout__button-toggleSideBarButtonWrapper">
							<Button {...subProps.ToggleSideBarButton}>{cloneWithProps(toggleSideBarButton)}</Button>
						</div>
					)
				);

			case 'Pagination':
				if (controller.config.settings?.infinite) {
					return <LoadMore {...subProps.LoadMore} />;
				} else {
					return <Pagination {...subProps.Pagination} />;
				}

			case '_':
				return <div className={`ss__layout__separator ss__layout__separator--${separatorIndex++}`} />;

			case 'Banner.banner':
				return <Banner {...subProps.Banner} type={ContentType.BANNER} name={'banner'} />;

			case 'Banner.footer':
				return <Banner {...subProps.Banner} type={ContentType.FOOTER} name={'footer'} />;

			case 'Banner.header':
				return <Banner {...subProps.Banner} type={ContentType.HEADER} name={'header'} />;

			case 'Banner.left':
				return <Banner {...subProps.Banner} type={ContentType.LEFT} name={'left'} />;

			case 'Title':
				return mergedLang.titleText.value ? (
					<h4 aria-atomic="true" aria-live="polite" className="ss__layout__title" {...mergedLang?.titleText?.all}>
						{lang.titleText.value}
					</h4>
				) : undefined;

			case 'Facets':
				return <Facets {...subProps.Facets} />;

			default:
				return null;
		}
	}

	const hasChildrenToRender = layout?.length;

	let rowIndex = 0;
	let separatorIndex = 0;

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
	layout?: (ModuleNames | ModuleNames[])[];
	toggleSideBarButton?: JSX.Element;
	titleText?: string;
	lang?: Partial<LayoutLang>;
}

export type ModuleNames =
	// toolbar
	| 'SearchHeader'
	| 'FilterSummary'
	| 'MobileSidebar'
	| 'LayoutSelector'
	| 'PerPage'
	| 'SortBy'
	| 'Pagination'
	| 'PaginationInfo'
	| '_'
	| 'Button.toggleSideBar'
	| 'Banner.header'
	| 'Banner.banner'
	| 'Banner.footer'
	// sidebar
	| 'Title'
	| 'Facets'
	| 'Banner.left';

interface ToolbarSubProps {
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
	ToggleSideBarButton: Partial<ButtonProps>;
	CloseButton: Partial<ButtonProps>;
	ApplyButton: Partial<ButtonProps>;
	ClearButton: Partial<ButtonProps>;
}

export interface LayoutLang {
	titleText: Lang<{
		controller: SearchController;
	}>;
}
