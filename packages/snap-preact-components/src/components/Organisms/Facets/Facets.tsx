/** @jsx jsx */
import { Fragment, h } from 'preact';

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

const CSS = {
	facets: ({}: Partial<FacetsProps>) => css({}),
};

export const Facets = observer((properties: FacetsProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const defaultProps: Partial<FacetsProps> = {
		facets: properties.controller?.store?.facets,
	};

	let props = mergeProps('facets', globalTheme, defaultProps, properties);

	const { limit, onFacetOptionClick, disableStyles, className, style, styleScript, controller } = props;

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

	let { facets } = props;
	if (limit && facets && limit > 0) {
		facets = facets.slice(0, +limit);
	}

	const subProps: FacetsSubProps = {
		facet: {
			// default props
			className: 'ss__facets__facet',
			// global theme
			...globalTheme?.components?.facet,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props.theme,
		},
	};

	const styling: { css?: StylingCSS } = {};
	const stylingProps = { ...props };

	if (styleScript && !disableStyles) {
		styling.css = [styleScript(stylingProps), style];
	} else if (!disableStyles) {
		styling.css = [CSS.facets(stylingProps), style];
	} else if (style) {
		styling.css = [style];
	}
	return facets && facets?.length > 0 ? (
		<CacheProvider>
			<div className={classnames('ss__facets', className)} {...styling}>
				{facets.map((facet) => (
					<Facet {...subProps.facet} facet={facet} />
				))}
			</div>
		</CacheProvider>
	) : (
		<Fragment></Fragment>
	);
});

interface FacetsSubProps {
	facet: Partial<FacetProps>;
}

export type IndividualFacetType = ValueFacet | RangeFacet;

export interface FacetsProps extends ComponentProps {
	facets?: IndividualFacetType[];
	limit?: number;
	controller?: SearchController | AutocompleteController;
	onFacetOptionClick?: (e: React.MouseEvent<Element, MouseEvent>) => void;
}
