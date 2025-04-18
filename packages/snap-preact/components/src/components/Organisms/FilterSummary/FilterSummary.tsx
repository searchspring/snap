import { Fragment, h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { Filter, FilterProps } from '../../Molecules/Filter';
import { defined, mergeProps, mergeStyles } from '../../../utilities';
import { Theme, useTheme, CacheProvider, useTreePath } from '../../../providers';
import { ComponentProps, StyleScript } from '../../../types';
import type { SearchController, AutocompleteController } from '@searchspring/snap-controller';
import type { Filter as FilterType } from '@searchspring/snap-store-mobx';
import { IconProps, IconType } from '../../Atoms/Icon';
import { Lang, useLang } from '../../../hooks';
import deepmerge from 'deepmerge';

const defaultStyles: StyleScript<FilterSummaryProps> = () => {
	return css({
		'.ss__filter-summary__title': {
			fontSize: '1.2em',
			padding: '6px 0',
		},
		'.ss__filter-summary__filters': {
			margin: '5px 0',
			display: 'flex',
			gap: '10px',
			flexWrap: 'wrap',
		},
	});
};

export const FilterSummary = observer((properties: FilterSummaryProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const globalTreePath = useTreePath();

	const defaultProps: Partial<FilterSummaryProps> = {
		title: 'Current Filters',
		clearAllLabel: 'Clear All',
		clearAllIcon: 'close-thin',
		filterIcon: 'close-thin',
		filters: properties.controller?.store?.filters,
		onClearAllClick: () => properties.controller?.urlManager.remove('filter').remove('page').go(),
		separator: ':',
		treePath: globalTreePath,
	};

	const props = mergeProps('filterSummary', globalTheme, defaultProps, properties);

	const {
		filters,
		title,
		filterIcon,
		clearAllIcon,
		separator,
		hideFacetLabel,
		hideTitle,
		clearAllLabel,
		hideClearAll,
		onClick,
		onClearAllClick,
		disableStyles,
		className,
		treePath,
	} = props;

	const subProps: FilterSummarySubProps = {
		filter: {
			name: 'filter',
			// default props
			className: 'ss__filter-summary__filter',
			// inherited props
			...defined({
				disableStyles,
				separator,
				hideFacetLabel,
				icon: filterIcon,
			}),
			// component theme overrides
			theme: props.theme,
			treePath,
		},
	};

	const styling = mergeStyles<FilterSummaryProps>(props, defaultStyles);

	//initialize lang
	const defaultLang = {
		title: {
			value: title,
		},
		clearAllLabel: {
			value: clearAllLabel,
		},
	};

	//deep merge with props.lang
	const lang = deepmerge(defaultLang, props.lang || {});
	const mergedLang = useLang(lang as any, {
		filters,
	});

	return filters?.length ? (
		<CacheProvider>
			<div {...styling} className={classnames('ss__filter-summary', className)}>
				{!hideTitle && <div className="ss__filter-summary__title" {...mergedLang.title?.all}></div>}

				<div className="ss__filter-summary__filters">
					{filters.map((filter) => (
						<Filter {...subProps.filter} filter={filter} onClick={(e) => onClick && onClick(e, filter)} />
					))}

					{!hideClearAll && (
						<Filter
							{...subProps.filter}
							name={'clear-all'}
							icon={clearAllIcon}
							className={`${subProps?.filter?.className} ss__filter-summary__clear-all`}
							hideFacetLabel
							valueLabel={clearAllLabel}
							onClick={(e) => onClearAllClick && onClearAllClick(e)}
							lang={{
								filter: { attributes: { 'aria-label': clearAllLabel } },
							}}
						/>
					)}
				</div>
			</div>
		</CacheProvider>
	) : (
		<Fragment></Fragment>
	);
});

export interface FilterSummaryProps extends ComponentProps {
	filters?: FilterType[];
	title?: string;
	hideTitle?: boolean;
	filterIcon?: IconType | Partial<IconProps>;
	clearAllIcon?: IconType | Partial<IconProps>;
	separator?: string;
	hideFacetLabel?: boolean;
	clearAllLabel?: string;
	hideClearAll?: boolean;
	onClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, filterFilter: FilterType) => void;
	onClearAllClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
	controller?: SearchController | AutocompleteController;
	lang?: Partial<FilterSummaryLang>;
}

export interface FilterSummaryLang {
	title: Lang<{
		filters: FilterType[];
	}>;
	clearAllLabel: Lang<{
		label?: string;
		value?: string;
	}>;
}

interface FilterSummarySubProps {
	filter: Partial<FilterProps>;
}
