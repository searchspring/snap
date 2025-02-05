import { h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { Theme, useTheme, useSnap, CacheProvider } from '../../../providers';
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

const defaultStyles: StyleScript<ToolbarProps> = ({}) => {
	return css({
		display: 'flex',
		justifyContent: 'flex-end',
		gap: '10px',
	});
};

export const Toolbar = observer((properties: ToolbarProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const snap = useSnap() as SnapTemplates;
	const themeStore = snap?.templates?.getThemeStore(globalTheme.name);

	const defaultProps: Partial<ToolbarProps> = {
		hideFilterSummary: false,
		hideLayoutSelector: false,
		hidePerPage: false,
		hideSortBy: false,
		hidePagination: false,
	};

	const props = mergeProps('toolbar', globalTheme, defaultProps, properties);
	const {
		controller,
		hideMobileSidebar,
		hideFilterSummary,
		hidePerPage,
		hideSortBy,
		hideLayoutSelector,
		hidePagination,
		hidePaginationInfo,
		topSlot,
		bottomSlot,
		hideTopSlot,
		hideBottomSlot,
		disableStyles,
		className,
		treePath,
	} = props;

	const styling = mergeStyles<ToolbarProps>(props, defaultStyles);

	const subProps: ToolbarSubProps = {
		MobileSidebar: {
			// default props
			controller,
			className: 'ss__toolbar__mobile-sidebar',
			// global theme
			...globalTheme?.components?.mobileSidebar,
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
			// global theme
			...globalTheme?.components?.filterSummary,
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
			// global theme
			...globalTheme?.components?.layoutSelector,
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
			// global theme
			...globalTheme?.components?.pagination,
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
			// global theme
			...globalTheme?.components?.paginationInfo,
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
			// global theme
			...globalTheme?.components?.loadMore,
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
			// global theme
			...globalTheme?.components?.sortBy,
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
			// global theme
			...globalTheme?.components?.perPage,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
			treePath,
		},
	};

	return (
		<CacheProvider>
			<div {...styling} className={classnames('ss__toolbar', className)}>
				{!hideTopSlot && topSlot && <div className={classnames('ss__toolbar__slot', `ss__toolbar__slot--top`)}>{cloneWithProps(topSlot)}</div>}

				{!hideMobileSidebar && controller.store.pagination.totalResults > 0 && <MobileSidebar controller={controller} {...subProps.MobileSidebar} />}

				{!hideFilterSummary && <FilterSummary {...subProps.FilterSummary} />}

				{!hideLayoutSelector && themeStore && props.theme?.layoutOptions && props.theme.layoutOptions.length > 0 && (
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
				)}

				{!hidePaginationInfo && <PaginationInfo {...subProps.PaginationInfo} />}

				{!hideSortBy && <SortBy {...subProps.SortBy} />}

				{!hidePerPage && <PerPage {...subProps.PerPage} />}

				{!hidePagination &&
					(() => {
						if (controller.config.settings?.infinite) {
							return <LoadMore {...subProps.LoadMore} />;
						} else {
							return <Pagination {...subProps.Pagination} />;
						}
					})()}

				{!hideBottomSlot && bottomSlot && (
					<div className={classnames('ss__toolbar__slot', `ss__toolbar__slot--bottom`)}>{cloneWithProps(bottomSlot)}</div>
				)}
			</div>
		</CacheProvider>
	);
});

export interface ToolbarProps extends ComponentProps {
	controller: SearchController;
	hideFilterSummary?: boolean;
	hideMobileSidebar?: boolean;
	hideLayoutSelector?: boolean;
	hidePerPage?: boolean;
	hideSortBy?: boolean;
	hidePagination?: boolean;
	hidePaginationInfo?: boolean;
	topSlot?: JSX.Element;
	hideTopSlot?: boolean;
	bottomSlot?: JSX.Element;
	hideBottomSlot?: boolean;
	name?: ToolbarNames;
}

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
}
