/** @jsx jsx */
import { h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { Filter, FilterProps } from '../../Molecules/Filter';
import { defined } from '../../../utilities';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, Filter as FilterType } from '../../../types';
import type { SearchController, AutocompleteController } from '@searchspring/snap-controller';

const CSS = {
	filterSummary: ({ style }) =>
		css({
			'& .ss__filter-summary__filter': {
				margin: '5px 10px 5px 0',
			},
			'& .ss__filter-summary__title': {
				fontSize: '1.2em',
			},
			...style,
		}),
};

export const FilterSummary = observer((properties: FilterSummaryProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const props: FilterSummaryProps = {
		// default props
		title: 'Current Filters',
		clearAllLabel: 'Clear All',
		clearAllIcon: 'close-thin',
		filterIcon: 'close-thin',
		filters: properties.controller?.store?.filters,
		onClearAllClick: () => properties.controller?.urlManager.remove('filter').go(),
		separator: ':',
		// global theme
		...globalTheme?.components?.filterSummary,
		// props
		...properties,
		...properties.theme?.components?.filterSummary,
	};

	const {
		filters,
		title,
		filterIcon,
		clearAllIcon,
		separator,
		hideFacetLabel,
		clearAllLabel,
		hideClearAll,
		onClick,
		onClearAllClick,
		disableStyles,
		className,
		style,
	} = props;

	const subProps: FilterSummarySubProps = {
		filter: {
			// default props
			className: 'ss__filter-summary__filter',
			// global theme
			...globalTheme?.components?.filter,
			// inherited props
			...defined({
				disableStyles,
				separator,
				hideFacetLabel,
				icon: filterIcon,
			}),
			// component theme overrides
			...props.theme?.components?.filter,
		},
	};

	return filters?.length ? (
		<CacheProvider>
			<div css={!disableStyles && CSS.filterSummary({ style })} className={classnames('ss__filter-summary', className)}>
				<div className="ss__filter-summary__title">{title}</div>

				{filters.map((filter) => (
					<Filter
						{...subProps.filter}
						url={filter?.url}
						facetLabel={filter?.facet?.label}
						valueLabel={filter?.value?.label}
						onClick={(e) => onClick && onClick(e, filter)}
					/>
				))}

				{!hideClearAll && (
					<Filter
						{...subProps.filter}
						icon={clearAllIcon}
						className={`${subProps?.filter?.className} ss__filter-summary__clear-all`}
						hideFacetLabel
						valueLabel={clearAllLabel}
						onClick={(e) => onClearAllClick && onClearAllClick(e)}
					/>
				)}
			</div>
		</CacheProvider>
	) : null;
});

export interface FilterSummaryProps extends ComponentProps {
	filters?: FilterType[];
	title?: string;
	filterIcon?: string;
	clearAllIcon?: string;
	separator?: string;
	hideFacetLabel?: boolean;
	clearAllLabel?: string;
	hideClearAll?: boolean;
	onClick?: (e: Event, filterFilter) => void;
	onClearAllClick?: (e: Event) => void;
	controller?: SearchController | AutocompleteController;
}

interface FilterSummarySubProps {
	filter: FilterProps;
}
