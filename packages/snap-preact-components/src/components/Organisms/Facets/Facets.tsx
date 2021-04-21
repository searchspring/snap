import { h } from 'preact';

import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { Facet, FacetProps } from '../Facet';
import { Theme, useTheme } from '../../../providers/theme';
import { defined } from '../../../utilities';
import { ComponentProps } from '../../../types';

export const Facets = observer(
	(properties: FacetsProps): JSX.Element => {
		const globalTheme: Theme = useTheme();

		const props: FacetsProps = {
			// default props
			disableStyles: false,
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
			facets?.length && (
				<div className={classnames('ss-facets', className)} style={!disableStyles && style}>
					{facets.map((facet) => (
						<Facet {...subProps.facet} facet={facet} />
					))}
				</div>
			)
		);
	}
);

interface FacetsSubProps {
	facet?: FacetProps;
}

export interface FacetsProps extends ComponentProps {
	facets: any;
}
