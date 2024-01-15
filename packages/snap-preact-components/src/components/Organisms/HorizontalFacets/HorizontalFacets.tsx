/** @jsx jsx */
import { Fragment, h } from 'preact';
import { useState } from 'preact/hooks';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';
import deepmerge from 'deepmerge';

import { Facet, FacetProps } from '../Facet';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { defined, mergeProps } from '../../../utilities';
import { ComponentProps, StylingCSS } from '../../../types';
import type { SearchController, AutocompleteController } from '@searchspring/snap-controller';
import type { ValueFacet } from '@searchspring/snap-store-mobx';
import type { IndividualFacetType } from '../Facets/Facets';
import { MobileSidebar, MobileSidebarProps } from '../MobileSidebar';
import { FilterSummary, FilterSummaryProps } from '../FilterSummary';
import { useClickOutside } from '../../../hooks';
import { Dropdown, DropdownProps } from '../../Atoms/Dropdown';
import { Icon, IconProps } from '../../Atoms/Icon';

const CSS = {
	facets: ({}: Partial<HorizontalFacetsProps>) => css({}),
};

export const HorizontalFacets = observer((properties: HorizontalFacetsProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const defaultProps: Partial<HorizontalFacetsProps> = {
		limit: 6,
		facets: properties.controller?.store?.facets,
	};

	let props = mergeProps('horizontalFacets', globalTheme, defaultProps, properties);

	const { facets, limit, hideFiltersButton, alwaysShowFiltersButton, onFacetOptionClick, disableStyles, className, style, styleScript, controller } =
		props;

	const facetClickEvent = (e: React.MouseEvent<Element, MouseEvent>) => {
		onFacetOptionClick && onFacetOptionClick(e);

		// remove focus from input (close the autocomplete)
		(controller as AutocompleteController)?.setFocused && (controller as AutocompleteController)?.setFocused();
	};

	const themeDefaults: Theme = {
		components: {
			facetGridOptions: {
				onClick: facetClickEvent,
			},
			facetHierarchyOptions: {
				onClick: facetClickEvent,
			},
			facetListOptions: {
				onClick: facetClickEvent,
			},
			facetPaletteOptions: {
				onClick: facetClickEvent,
			},
		},
	};

	// merge deeply the themeDefaults with the theme props and the displaySettings theme props (do not merge arrays, but replace them)
	const theme = deepmerge(themeDefaults, props?.theme || {}, { arrayMerge: (destinationArray, sourceArray) => sourceArray });

	props = {
		...props,
		theme,
	};

	let facetsToShow = facets;
	let isOverflowing = false;

	if (limit && facets && limit > 0) {
		isOverflowing = facets.length > +limit;
		facetsToShow = facets.slice(0, +limit);
	}

	const subProps: HorizontalFacetsSubProps = {
		filterSummary: {
			// default props
			className: 'ss__horizontal-facets__filter-summary',
			controller,
			// global theme
			...globalTheme?.components?.filterSummary,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
		},
		dropdown: {
			// default props
			className: 'ss__horizontal-facets__header__dropdown',
			disableClickOutside: true,
			disableOverlay: true,
			disableA11y: true,
			// global theme
			...globalTheme?.components?.dropdown,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
		},
		icon: {
			// default props
			className: 'ss__horizontal-facets__header__dropdown__button__icon',
			// global theme
			...globalTheme?.components?.icon,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
		},
		facet: {
			// default props
			className: 'ss__horizontal-facets__content__facet ss__horizontal-facets__content__facet--horizontalFacet',
			justContent: true,
			// global theme
			...globalTheme?.components?.facet,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
		},
		MobileSidebar: {
			// default props
			className: 'ss__horizontal-facets__header__mobile-sidebar',
			hidePerPage: true,
			hideSortBy: true,
			displayAt: '5000px',
			// global theme
			...globalTheme?.components?.mobileSidebar,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
		},
	};

	const styling: { css?: StylingCSS } = {};
	const stylingProps = props;

	if (styleScript && !disableStyles) {
		styling.css = [styleScript(stylingProps), style];
	} else if (!disableStyles) {
		styling.css = [CSS.facets(stylingProps), style];
	} else if (style) {
		styling.css = [style];
	}

	const [selectedFacet, setSelectedFacet] = useState<IndividualFacetType | undefined>(undefined);

	const innerRef = useClickOutside(() => {
		selectedFacet && setSelectedFacet(undefined);
	});

	return facetsToShow && facetsToShow?.length > 0 ? (
		<CacheProvider>
			<div className={classnames('ss__horizontal-facets', className)} ref={innerRef as React.LegacyRef<HTMLDivElement>} {...styling}>
				<FilterSummary {...subProps.filterSummary} />

				<div className="ss__horizontal-facets__header">
					{facetsToShow.map((facet: IndividualFacetType) => (
						<Dropdown
							{...subProps.dropdown}
							open={selectedFacet?.field === facet.field}
							onClick={() => {
								if (selectedFacet === facet) {
									setSelectedFacet(undefined);
									return;
								}
								setSelectedFacet(facet);
							}}
							button={
								<div
									className="ss__horizontal-facets__header__dropdown__button"
									role="heading"
									aria-level={3}
									aria-label={`currently ${selectedFacet?.field === facet.field ? 'collapsed' : 'open'} ${facet.field} facet dropdown ${
										(facet as ValueFacet).values?.length ? (facet as ValueFacet).values?.length + ' options' : ''
									}`}
								>
									{facet?.label}
									<Icon {...subProps.icon} icon={selectedFacet?.field === facet.field ? 'angle-up' : 'angle-down'} />
								</div>
							}
						/>
					))}
					{((isOverflowing && !hideFiltersButton) || alwaysShowFiltersButton) && (
						<MobileSidebar controller={controller as any} {...subProps.MobileSidebar}></MobileSidebar>
					)}
				</div>

				{selectedFacet && (
					<div className="ss__horizontal-facets__content">
						<Facet {...subProps.facet} name={'horizontalFacet'} facet={facets?.find((facet) => facet.field === selectedFacet.field)!} />
					</div>
				)}
			</div>
		</CacheProvider>
	) : (
		<Fragment></Fragment>
	);
});

interface HorizontalFacetsSubProps {
	filterSummary: Partial<FilterSummaryProps>;
	dropdown: Partial<DropdownProps>;
	icon: Partial<IconProps>;
	facet: Partial<FacetProps>;
	MobileSidebar: Partial<MobileSidebarProps>;
}

export interface HorizontalFacetsProps extends ComponentProps {
	facets?: IndividualFacetType[];
	limit?: number;
	hideFiltersButton?: boolean;
	alwaysShowFiltersButton?: boolean;
	controller?: SearchController | AutocompleteController;
	onFacetOptionClick?: (e: React.MouseEvent<Element, MouseEvent>) => void;
}
