import { h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { Theme, useTheme, useSnap, CacheProvider } from '../../../providers';
import { ComponentProps, RootNodeProperties } from '../../../types';
import { FilterSummary, FilterSummaryProps } from '../FilterSummary';
import { defined, mergeProps } from '../../../utilities';
import { Pagination, PaginationProps } from '../../Molecules/Pagination';
import { LoadMore, LoadMoreProps } from '../../Molecules/LoadMore';
import { SearchController } from '@searchspring/snap-controller';
import { SortBy, SortByProps } from '../../Molecules/SortBy';
import { PerPage, PerPageProps } from '../../Molecules/PerPage';
import { LayoutSelector, LayoutSelectorProps } from '../../Molecules/LayoutSelector';
import { SnapTemplates } from '../../../../../src';

const CSS = {
	toolbar: ({}: Partial<ToolbarProps>) => css({}),
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
		hideFilterSummary,
		hidePerPage,
		hideSortBy,
		hideLayoutSelector,
		hidePagination,
		disableStyles,
		className,
		style,
		styleScript,
		treePath,
	} = props;

	const styling: RootNodeProperties = { 'ss-name': props.name };
	const stylingProps = props;

	if (styleScript && !disableStyles) {
		styling.css = [styleScript(stylingProps), style];
	} else if (!disableStyles) {
		styling.css = [CSS.toolbar(stylingProps), style];
	} else if (style) {
		styling.css = [style];
	}

	const subProps: ToolbarSubProps = {
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
				{!hideFilterSummary && <FilterSummary {...subProps.FilterSummary} />}

				{!hideLayoutSelector && (
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
			</div>
		</CacheProvider>
	);
});

export interface ToolbarProps extends ComponentProps {
	controller: SearchController;
	hideFilterSummary?: boolean;
	hideLayoutSelector?: boolean;
	hidePerPage?: boolean;
	hideSortBy?: boolean;
	hidePagination?: boolean;
	name?: ToolbarNames;
}

export type ToolbarNames = 'top' | 'middle' | 'bottom';

interface ToolbarSubProps {
	FilterSummary: Partial<FilterSummaryProps>;
	Pagination: Partial<PaginationProps>;
	LoadMore: Partial<LoadMoreProps>;
	SortBy: Partial<SortByProps>;
	PerPage: Partial<PerPageProps>;
	LayoutSelector: Partial<LayoutSelectorProps>;
}
