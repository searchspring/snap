import { Fragment, h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { Theme, useTheme, CacheProvider } from '../../../providers';
import { mergeProps } from '../../../utilities';
import { createHoverProps } from '../../../toolbox';
import { ComponentProps, StylingCSS } from '../../../types';
import type { FacetValue, ValueFacet } from '@searchspring/snap-store-mobx';

const CSS = {
	grid: ({ columns, gapSize, theme }: Partial<FacetGridOptionsProps>) =>
		css({
			display: 'flex',
			flexFlow: 'row wrap',
			gridTemplateColumns: `repeat(${columns}, 1fr)`,
			gap: gapSize,
			gridAutoRows: `1fr`,

			'& .ss__facet-grid-options__option': {
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				flex: '0 1 auto',
				border: `1px solid ${theme?.variables?.color?.primary || '#333'}`,
				textAlign: 'center',
				wordBreak: 'break-all',
				boxSizing: 'border-box',
				padding: '1em 0',
				width: `calc(100% / ${columns} - ${2 * Math.round((columns! + 2) / 2)}px)`,
				margin: `0 ${gapSize} ${gapSize} 0`,

				[`:nth-of-type(${columns}n)`]: {
					marginRight: '0',
				},
				'&.ss__facet-grid-options__option--filtered': {
					background: theme?.variables?.color?.primary || '#ccc',
					color: theme?.variables?.color?.secondary,
				},
				'&:hover:not(.ss__facet-grid-options__option--filtered)': {
					cursor: 'pointer',
					background: theme?.variables?.color?.hover?.background || '#f8f8f8',
				},
				'& .ss__facet-grid-options__option__value': {
					'&.ss__facet-grid-options__option__value--smaller': {
						fontSize: '70%',
					},
				},
			},

			'@supports (display: grid)': {
				display: 'grid',

				'& .ss__facet-grid-options__option': {
					padding: '0',
					margin: '0',
					width: 'initial',
				},
				'&::before': {
					content: '""',
					width: 0,
					paddingBottom: '100%',
					gridRow: '1 / 1',
					gridColumn: '1 / 1',
				},
				'&> *:first-of-type': {
					gridRow: '1 / 1',
					gridColumn: '1 / 1',
				},
			},
		}),
};

export const FacetGridOptions = observer((properties: FacetGridOptionsProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const defaultProps: Partial<FacetGridOptionsProps> = {
		columns: 4,
		gapSize: '8px',
	};

	const props = mergeProps('facetGridOptions', globalTheme, defaultProps, properties);

	const { values, onClick, previewOnFocus, valueProps, facet, disableStyles, className, style, styleScript } = props;

	const styling: { css?: StylingCSS } = {};
	const stylingProps = props;

	if (styleScript && !disableStyles) {
		styling.css = [styleScript(stylingProps), style];
	} else if (!disableStyles) {
		styling.css = [CSS.grid(stylingProps), style];
	} else if (style) {
		styling.css = [style];
	}

	const facetValues = values || facet?.values;

	return facetValues?.length ? (
		<CacheProvider>
			<div {...styling} className={classnames('ss__facet-grid-options', className)}>
				{(facetValues as FacetValue[]).map((value) => (
					<a
						className={classnames('ss__facet-grid-options__option', { 'ss__facet-grid-options__option--filtered': value.filtered })}
						aria-label={
							value.filtered
								? `remove selected filter ${facet?.label || ''} - ${value.label}`
								: facet?.label
									? `filter by ${facet?.label} - ${value.label}`
									: `filter by ${value.label}`
						}
						href={value.url?.link?.href}
						{...valueProps}
						onClick={(e: React.MouseEvent<Element, MouseEvent>) => {
							value.url?.link?.onClick(e);
							onClick && onClick(e);
						}}
						{...(previewOnFocus ? createHoverProps(() => value?.preview && value.preview()) : {})}
					>
						<span
							className={classnames('ss__facet-grid-options__option__value', {
								'ss__facet-grid-options__option__value--smaller': value.label.length > 3,
							})}
						>
							{value.label}
						</span>
					</a>
				))}
			</div>
		</CacheProvider>
	) : (
		<Fragment></Fragment>
	);
});

export interface FacetGridOptionsProps extends ComponentProps {
	values?: FacetValue[];
	columns?: number;
	gapSize?: string;
	onClick?: (e: React.MouseEvent) => void;
	facet?: ValueFacet;
	previewOnFocus?: boolean;
	valueProps?: any;
}
