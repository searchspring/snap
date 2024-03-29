/** @jsx jsx */
import { Fragment, h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react';

import { Facet, FacetProps } from '../Facet';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { defined } from '../../../utilities';
import { ComponentProps, StylingCSS } from '../../../types';
import type { SearchController, AutocompleteController } from '@searchspring/snap-controller';

import type { ValueFacet, RangeFacet } from '@searchspring/snap-store-mobx';

const CSS = {
	facets: () => css({}),
};

export const Facets = observer((properties: FacetsProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const props: FacetsProps = {
		// default props
		facets: properties.controller?.store?.facets,
		// global theme
		...globalTheme?.components?.facets,
		// props
		...properties,
		...properties.theme?.components?.facets,
	};

	const { limit, disableStyles, className, style } = props;
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
	if (!disableStyles) {
		styling.css = [CSS.facets(), style];
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
	facet: FacetProps;
}

export type IndividualFacetType = ValueFacet | RangeFacet;

export interface FacetsProps extends ComponentProps {
	facets?: IndividualFacetType[];
	limit?: number;
	controller?: SearchController | AutocompleteController;
}
