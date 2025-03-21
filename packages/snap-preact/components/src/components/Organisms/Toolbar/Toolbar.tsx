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

const defaultStyles: StyleScript<ToolbarProps> = ({}) => {
	return css({
		display: 'flex',
		alignItems: 'center',
		flexWrap: 'wrap',
		gap: '10px',
		'.ss__toolbar__separator': {
			flex: '1 1 auto',
		},
		'.ss__toolbar__group': {
			display: 'flex',
			alignItems: 'center',
			flexWrap: 'wrap',
			flexBasis: '100%',
			gap: '10px',
		},
	});
};

export const Toolbar = observer((properties: ToolbarProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const globalTreePath = useTreePath();

	const snap = useSnap() as SnapTemplates;
	const themeStore = snap?.templates?.getThemeStore(globalTheme.name);

	const defaultProps: Partial<ToolbarProps> = {
		treePath: globalTreePath,

		layout: ['MobileSidebar', 'FilterSummary', 'PaginationInfo', 'SortBy', 'PerPage', 'Pagination'],
	};

	const props = mergeProps('toolbar', globalTheme, defaultProps, properties);
	const { controller, disableStyles, className, treePath, slot0, slot1, slot2, slot3, layout } = props;

	const styling = mergeStyles<ToolbarProps>(props, defaultStyles);

	const subProps: ToolbarSubProps = {
		MobileSidebar: {
			// default props
			controller,
			className: 'ss__toolbar__mobile-sidebar',
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
			className: 'ss__toolbar__search-header',
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
			className: 'ss__toolbar__filter-summary',
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
			className: 'ss__toolbar__layout-selector',
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
			className: 'ss__toolbar__pagination',
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
			className: 'ss__toolbar__pagination-info',
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
			className: 'ss__toolbar__load-more',
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
			className: 'ss__toolbar__sort-by',
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
			className: 'ss__toolbar__per-page',
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
			treePath,
		},
	};

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

			case 'Pagination':
				if (controller.config.settings?.infinite) {
					return <LoadMore {...subProps.LoadMore} />;
				} else {
					return <Pagination {...subProps.Pagination} />;
				}

			case 'Separator':
				return <div className={`ss__toolbar__separator ss__toolbar__separator--${separatorIndex++}`} />;

			case 'Slot0':
				return slot0 && <div className={classnames('ss__toolbar__slot', `ss__toolbar__slot--0`)}>{cloneWithProps(slot0)}</div>;

			case 'Slot1':
				return slot1 && <div className={classnames('ss__toolbar__slot', `ss__toolbar__slot--1`)}>{cloneWithProps(slot1)}</div>;

			case 'Slot2':
				return slot2 && <div className={classnames('ss__toolbar__slot', `ss__toolbar__slot--2`)}>{cloneWithProps(slot2)}</div>;

			case 'Slot3':
				return slot3 && <div className={classnames('ss__toolbar__slot', `ss__toolbar__slot--3`)}>{cloneWithProps(slot3)}</div>;

			default:
				return null;
		}
	}

	const hasChildrenToRender = layout?.length;

	let rowIndex = 0;
	let separatorIndex = 0;

	return hasChildrenToRender ? (
		<CacheProvider>
			<div {...styling} className={classnames('ss__toolbar', className)}>
				{layout?.map((module) => {
					if (Array.isArray(module)) {
						return (
							<div className={`ss__toolbar__group ss__toolbar__group--${rowIndex++}`}>
								{module.map((subModule) => {
									return renderModule(subModule);
								})}
							</div>
						);
					} else {
						{
							return renderModule(module);
						}
					}
				})}
			</div>
		</CacheProvider>
	) : (
		<></>
	);
});

export interface ToolbarProps extends ComponentProps {
	controller: SearchController;
	slot0?: JSX.Element;
	slot1?: JSX.Element;
	slot2?: JSX.Element;
	slot3?: JSX.Element;
	name?: ToolbarNames;
	layout?: (ModuleNames | ModuleNames[])[];
}

export type ModuleNames =
	| 'SearchHeader'
	| 'FilterSummary'
	| 'MobileSidebar'
	| 'LayoutSelector'
	| 'PerPage'
	| 'SortBy'
	| 'Pagination'
	| 'PaginationInfo'
	| 'Separator'
	| 'Slot0'
	| 'Slot1'
	| 'Slot2'
	| 'Slot3';

export type ToolbarNames = 'top' | 'middle' | 'bottom';

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
}
