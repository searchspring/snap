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

const defaultStyles: StyleScript<ToolbarProps> = ({}) => {
	return css({
		display: 'flex',
		justifyContent: 'flex-end',
		gap: '10px',
	});
};

export const Toolbar = observer((properties: ToolbarProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const globalTreePath = useTreePath();

	const snap = useSnap() as SnapTemplates;
	const themeStore = snap?.templates?.getThemeStore(globalTheme.name);

	const defaultProps: Partial<ToolbarProps> = {
		treePath: globalTreePath,

		modules: ['MobileSidebar', 'FilterSummary', 'PaginationInfo', 'SortBy', 'PerPage', 'Pagination'],
	};

	const props = mergeProps('toolbar', globalTheme, defaultProps, properties);
	const { controller, topSlot, bottomSlot, hideTopSlot, hideBottomSlot, disableStyles, className, treePath, modules } = props;

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

	const hasChildrenToRender = Boolean((!hideTopSlot && topSlot) || modules?.length || (!hideBottomSlot && bottomSlot));

	return hasChildrenToRender ? (
		<CacheProvider>
			<div {...styling} className={classnames('ss__toolbar', className)}>
				{!hideTopSlot && topSlot && <div className={classnames('ss__toolbar__slot', `ss__toolbar__slot--top`)}>{cloneWithProps(topSlot)}</div>}

				{modules?.map((module) => {
					if (module == 'MobileSidebar' && controller.store.pagination.totalResults > 0) {
						return <MobileSidebar controller={controller} {...subProps.MobileSidebar} />;
					}

					if (module == 'FilterSummary') {
						return <FilterSummary {...subProps.FilterSummary} />;
					}

					if (module == 'LayoutSelector' && themeStore && props.theme?.layoutOptions && props.theme.layoutOptions.length > 0) {
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
					if (module == 'PaginationInfo') {
						return <PaginationInfo {...subProps.PaginationInfo} />;
					}

					if (module == 'SortBy') {
						return <SortBy {...subProps.SortBy} />;
					}

					if (module == 'PerPage') {
						return <PerPage {...subProps.PerPage} />;
					}

					if (module == 'Pagination') {
						return (() => {
							if (controller.config.settings?.infinite) {
								return <LoadMore {...subProps.LoadMore} />;
							} else {
								return <Pagination {...subProps.Pagination} />;
							}
						})();
					}
				})}

				{!hideBottomSlot && bottomSlot && (
					<div className={classnames('ss__toolbar__slot', `ss__toolbar__slot--bottom`)}>{cloneWithProps(bottomSlot)}</div>
				)}
			</div>
		</CacheProvider>
	) : (
		<></>
	);
});

export interface ToolbarProps extends ComponentProps {
	controller: SearchController;
	topSlot?: JSX.Element;
	hideTopSlot?: boolean;
	bottomSlot?: JSX.Element;
	hideBottomSlot?: boolean;
	name?: ToolbarNames;
	modules?: ModuleNames[];
}

export type ModuleNames = 'FilterSummary' | 'MobileSidebar' | 'LayoutSelector' | 'PerPage' | 'SortBy' | 'Pagination' | 'PaginationInfo';

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
