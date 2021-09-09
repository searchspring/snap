/** @jsx jsx */
import { h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { Facet, FacetProps } from '../Facet';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { defined } from '../../../utilities';
import { ComponentProps } from '../../../types';
import type { SearchController, AutocompleteController } from '@searchspring/snap-controller';

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

	const { facets, disableStyles, className, style } = props;

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

	const styling: { css?: any } = {};
	if (!disableStyles) {
		styling.css = [CSS.facets(), style];
	} else if (style) {
		styling.css = [style];
	}
	return (
		facets?.length > 0 && (
			<CacheProvider>
				<div className={classnames('ss__facets', className)} {...styling}>
					{facets.map((facet) => (
						<Facet {...subProps.facet} facet={facet} />
					))}
				</div>
			</CacheProvider>
		)
	);
});

interface FacetsSubProps {
	facet: FacetProps;
}

export interface FacetsProps extends ComponentProps {
	facets?: any;
	controller?: SearchController | AutocompleteController;
}
