/** @jsx jsx */
import { h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { Facet, FacetProps } from '../Facet';
import { Theme, useTheme } from '../../../providers/theme';
import { defined } from '../../../utilities';
import { ComponentProps } from '../../../types';

const CSS = {
	facets: ({ style }) =>
		css({
			...style,
		}),
};

export const Facets = observer((properties: FacetsProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const props: FacetsProps = {
		// default props
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
			...globalTheme?.components?.facetWrapper,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			...props.theme?.components?.facetWrapper,
		},
	};

	return (
		facets?.length > 0 && (
			<div className={classnames('ss__facets', className)} css={!disableStyles && CSS.facets({ style })}>
				{facets.map((facet) => (
					<Facet {...subProps.facet} facet={facet} />
				))}
			</div>
		)
	);
});

interface FacetsSubProps {
	facet: FacetProps;
}

export interface FacetsProps extends ComponentProps {
	facets: any;
}
