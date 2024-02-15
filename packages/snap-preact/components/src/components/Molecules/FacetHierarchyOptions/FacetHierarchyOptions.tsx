import { Fragment, h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { Theme, useTheme, CacheProvider } from '../../../providers';
import { mergeProps } from '../../../utilities';
import { ComponentProps, StylingCSS } from '../../../types';
import { createHoverProps } from '../../../toolbox';
import type { FacetHierarchyValue, ValueFacet } from '@searchspring/snap-store-mobx';

const CSS = {
	hierarchy: ({ theme }: Partial<FacetHierarchyOptionsProps>) =>
		css({
			'& .ss__facet-hierarchy-options__option': {
				display: 'flex',
				padding: '6px 0',
				textDecoration: 'none',
				alignItems: 'center',
				'&:hover': {
					cursor: 'pointer',
					background: theme?.variables?.color?.hover?.background,
				},
				'&.ss__facet-hierarchy-options__option--filtered': {
					fontWeight: 'bold',
					color: theme?.variables?.color?.primary,
					'&:hover': {
						cursor: 'default',
						background: 'unset',
					},
					'& ~ .ss__facet-hierarchy-options__option:not(.ss__facet-hierarchy-options__option--filtered)': {
						paddingLeft: '16px',
					},
				},
				'&.ss__facet-hierarchy-options__option--return': {
					'&:before': {
						content: `'\\0000ab'`,
						padding: '0 2px 0 0',
						color: theme?.variables?.color?.primary,
					},
				},
				'& .ss__facet-hierarchy-options__option__value': {
					marginLeft: '8px',
					'& .ss__facet-hierarchy-options__option__value__count': {
						fontSize: '0.8em',
						marginLeft: '6px',
					},
				},
			},
		}),
	hierarchyHorizontal: ({ theme }: Partial<FacetHierarchyOptionsProps>) =>
		css({
			display: 'flex',
			flexWrap: 'wrap',
			'& .ss__facet-hierarchy-options__option': {
				margin: '0 5px 5px 0',
				padding: '6px',
				textDecoration: 'none',
				flex: '0 1 auto',

				'&:hover': {
					cursor: 'pointer',
					background: theme?.variables?.color?.hover?.background,
				},
				'&.ss__facet-hierarchy-options__option--filtered': {
					fontWeight: 'bold',
					color: theme?.variables?.color?.primary,
					marginRight: '2em',
					'&:hover': {
						cursor: 'default',
						background: 'unset',
					},
				},
				'&.ss__facet-hierarchy-options__option--return': {
					'&:before': {
						content: `'\\0000ab'`,
						padding: '0 2px 0 0',
						color: theme?.variables?.color?.primary,
					},
				},
				'& .ss__facet-hierarchy-options__option__value': {
					'& .ss__facet-hierarchy-options__option__value__count': {
						fontSize: '0.8em',
						marginLeft: '6px',
					},
				},
			},
		}),
};

export const FacetHierarchyOptions = observer((properties: FacetHierarchyOptionsProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const defaultProps: Partial<FacetHierarchyOptionsProps> = {};

	const props = mergeProps('facetHierarchyOptions', globalTheme, defaultProps, properties);

	const { values, hideCount, onClick, disableStyles, previewOnFocus, valueProps, facet, horizontal, className, style, styleScript } = props;

	const styling: { css?: StylingCSS } = {};
	const stylingProps = props;

	if (styleScript && !disableStyles) {
		styling.css = [styleScript(stylingProps), style];
	} else if (!disableStyles) {
		styling.css = [horizontal ? CSS.hierarchyHorizontal(stylingProps) : CSS.hierarchy(stylingProps), style];
	} else if (style) {
		styling.css = [style];
	}

	const facetValues = values || facet?.values;

	return facetValues?.length ? (
		<CacheProvider>
			<div {...styling} className={classnames('ss__facet-hierarchy-options', className)}>
				{(facetValues as FacetHierarchyValue[]).map((value) => (
					<a
						className={classnames(
							'ss__facet-hierarchy-options__option',
							{ 'ss__facet-hierarchy-options__option--filtered': value.filtered },
							{ 'ss__facet-hierarchy-options__option--return': value.history && !value.filtered }
						)}
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
						<span className="ss__facet-hierarchy-options__option__value">
							{value.label}
							{!hideCount && value?.count > 0 && !value.filtered && (
								<span className="ss__facet-hierarchy-options__option__value__count">({value.count})</span>
							)}
						</span>
					</a>
				))}
			</div>
		</CacheProvider>
	) : (
		<Fragment></Fragment>
	);
});
export interface FacetHierarchyOptionsProps extends ComponentProps {
	values?: FacetHierarchyValue[];
	hideCount?: boolean;
	facet?: ValueFacet;
	horizontal?: boolean;
	onClick?: (e: React.MouseEvent) => void;
	previewOnFocus?: boolean;
	valueProps?: any;
}
