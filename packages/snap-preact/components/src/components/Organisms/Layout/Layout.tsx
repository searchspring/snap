import { h } from 'preact';

import { css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { Theme, useTheme, useSnap, CacheProvider, useTreePath } from '../../../providers';
import type { ComponentProps, StyleScript } from '../../../types';
import { FilterSummary, FilterSummaryProps } from '../FilterSummary';
import { defined, mergeProps, mergeStyles } from '../../../utilities';
import { Pagination, PaginationProps } from '../../Molecules/Pagination';
import { LoadMore, LoadMoreProps } from '../../Molecules/LoadMore';
import type { SearchController } from '@searchspring/snap-controller';
import { SortBy, SortByProps } from '../../Molecules/SortBy';
import { PerPage, PerPageProps } from '../../Molecules/PerPage';
import { LayoutSelector, LayoutSelectorProps } from '../../Molecules/LayoutSelector';
import type { SnapTemplates } from '../../../../../src';
import { MobileSidebar, MobileSidebarProps } from '../MobileSidebar';
import { PaginationInfo, PaginationInfoProps } from '../../Atoms/PaginationInfo/PaginationInfo';
import { SearchHeader, SearchHeaderProps } from '../../Atoms/SearchHeader/SearchHeader';
import { Button, ButtonProps } from '../../Atoms/Button';
import { Banner, BannerProps } from '../../Atoms/Merchandising';
import { ContentType } from '@searchspring/snap-store-mobx';
import { Facets, FacetsProps } from '../Facets';

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
	};

	const props = mergeProps('layout', globalTheme, defaultProps, properties);
	const { controller, toggleSideBarButton, disableStyles, className, treePath, layout } = props;

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
		ToggleSideBarButton: {
			// default props
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
					ToggleSideBarButton && (
						<div className="ss__button-toggleSideBarButtonWrapper">
							<Button {...subProps.ToggleSideBarButton}>
								<ToggleSideBarButton />
							</Button>
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
	layout: (ModuleNames | ModuleNames[])[];
	toggleSideBarButton?: React.FunctionComponent;
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
	| 'Facets'
	| 'Banner.left';

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
	ToggleSideBarButton: Partial<ButtonProps>;
}
