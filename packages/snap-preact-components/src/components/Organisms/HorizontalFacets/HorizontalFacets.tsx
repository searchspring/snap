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
import type { ValueFacet, RangeFacet } from '@searchspring/snap-store-mobx';
import { MobileSidebar, MobileSidebarProps } from '../MobileSidebar';
import { FilterSummary } from '../FilterSummary';

const CSS = {
	facets: ({}: Partial<HorizontalFacetsProps>) => css({}),
};

export const HorizontalFacets = observer((properties: HorizontalFacetsProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const defaultProps: Partial<HorizontalFacetsProps> = {
		// limit: 4,
		// display: 'dropdown',
		behavior: 'dropdown',
		facets: properties.controller?.store?.facets,
	};

	let props = mergeProps('horizontalFacets', globalTheme, defaultProps, properties);

	const {
		facets,
		behavior,
		limit,
		hideFiltersButton,
		alwaysShowFiltersButton,
		onFacetOptionClick,
		disableStyles,
		className,
		style,
		styleScript,
		controller,
	} = props;

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
		facet: {
			// default props
			className: 'ss__facets__facet',
			// global theme
			...globalTheme?.components?.facet,
			// inherited props
			// horizontal: true, // TODO remove?
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props.theme,
		},
		MobileSidebar: {
			// default props
			hidePerPage: true,
			hideSortBy: true,
			displayAt: '5000px',
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

	const [selectedFacet, setSelectedFacet] = useState(undefined);
	return facetsToShow && facetsToShow?.length > 0 ? (
		<CacheProvider>
			<div className={classnames('ss__horizontal-facets', `'ss__horizontal-facets--${behavior}`, className)} {...styling}>
				<FilterSummary controller={controller} />

				<div className="ss__horizontal-facets__header">
					{facetsToShow.map((facet: any) => (
						<div
							onClick={() => {
								if (selectedFacet === facet) {
									setSelectedFacet(undefined);
									return;
								}
								setSelectedFacet(facet);
							}}
						>
							<Facet {...subProps.facet} facet={facet} ignoreStoreCollapse={true} />
						</div>
					))}
					{((isOverflowing && !hideFiltersButton) || alwaysShowFiltersButton) && (
						<MobileSidebar controller={controller as any} {...subProps.MobileSidebar}></MobileSidebar>
					)}
				</div>

				{selectedFacet && (
					<div className="ss__horizontal-facets__content">
						<Facet {...subProps.facet} facet={selectedFacet} justContent={true} limit={0} />
					</div>
				)}
			</div>
		</CacheProvider>
	) : (
		<Fragment></Fragment>
	);
});

interface HorizontalFacetsSubProps {
	facet: Partial<FacetProps>;
	MobileSidebar: Partial<MobileSidebarProps>;
}

type IndividualFacetType = ValueFacet | RangeFacet;

export interface HorizontalFacetsProps extends ComponentProps {
	facets?: IndividualFacetType[];
	limit?: number;
	hideFiltersButton?: boolean;
	alwaysShowFiltersButton?: boolean;
	controller?: SearchController | AutocompleteController;
	behavior?: 'dropdown' | 'overlay';
	onFacetOptionClick?: (e: React.MouseEvent<Element, MouseEvent>) => void;
}
