import { Fragment, h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import deepmerge from 'deepmerge';
import { observer } from 'mobx-react-lite';

import { Facet, FacetProps } from '../Facet';
import { Theme, useTheme, CacheProvider, useTreePath } from '../../../providers';
import { defined, mergeProps, mergeStyles } from '../../../utilities';
import { ComponentProps, StyleScript } from '../../../types';
import type { SearchController, AutocompleteController } from '@searchspring/snap-controller';
import type { ValueFacet, RangeFacet } from '@searchspring/snap-store-mobx';

const defaultStyles: StyleScript<FacetsProps> = () => {
	return css({});
};

export const Facets = observer((properties: FacetsProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const globalTreePath = useTreePath();

	const defaultProps: Partial<FacetsProps> = {
		facets: properties.controller?.store?.facets,
		treePath: globalTreePath,
	};

	let props = mergeProps('facets', globalTheme, defaultProps, properties);

	const { limit, onFacetOptionClick, disableStyles, className, internalClassName, controller, treePath } = props;

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
			internalClassName: 'ss__facets__facet',
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props.theme,
			treePath,
		},
	};

	const styling = mergeStyles<FacetsProps>(props, defaultStyles);

	const fieldNameToComponentName = (fieldName: string) => {
		// eg. color_family -> color-family
		return fieldName.replace(/_/g, '-').toLowerCase();
	};

	return facets && facets?.length > 0 ? (
		<CacheProvider>
			<div className={classnames('ss__facets', className, internalClassName)} {...styling}>
				{facets.map((facet) => (
					<Facet key={facet.field} {...subProps.facet} facet={facet} name={fieldNameToComponentName(facet.field)} />
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
