import { Fragment, h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, StylingCSS } from '../../../types';
import { defined, mergeProps } from '../../../utilities';
import { Checkbox, CheckboxProps } from '../Checkbox/Checkbox';
import { createHoverProps } from '../../../toolbox';
import type { FacetValue, ValueFacet } from '@searchspring/snap-store-mobx';

const CSS = {
	list: ({ theme, hideCheckbox }: Partial<FacetListOptionsProps>) =>
		css({
			'& .ss__facet-list-options__option': {
				display: 'flex',
				padding: '6px',
				textDecoration: 'none',
				alignItems: 'center',
				'&:hover': {
					cursor: 'pointer',
					background: theme?.variables?.color?.hover?.background,
				},
				'&.ss__facet-list-options__option--filtered': {
					fontWeight: 'bold',
					color: theme?.variables?.color?.primary,
				},
				'& .ss__facet-list-options__option__value': {
					marginLeft: hideCheckbox ? '' : '8px',
					'& .ss__facet-list-options__option__value__count': {
						fontSize: '0.8em',
						marginLeft: '6px',
					},
				},
			},
		}),
};

export const FacetListOptions = observer((properties: FacetListOptionsProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const defaultProps: Partial<FacetListOptionsProps> = {};

	const props = mergeProps('facetListOptions', globalTheme, defaultProps, properties);

	const { values, hideCheckbox, hideCount, onClick, previewOnFocus, valueProps, facet, disableStyles, className, style, styleScript } = props;

	const subProps: FacetListOptionsSubProps = {
		checkbox: {
			// default props
			className: 'ss__facet-list-options__checkbox',
			// global theme
			...globalTheme?.components?.checkbox,
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
		styling.css = [CSS.list(stylingProps), style];
	} else if (style) {
		styling.css = [style];
	}

	const facetValues = values || facet?.values;

	return facetValues?.length ? (
		<CacheProvider>
			<div {...styling} className={classnames('ss__facet-list-options', className)}>
				{(facetValues as FacetValue[]).map((value) => (
					<a
						className={classnames('ss__facet-list-options__option', { 'ss__facet-list-options__option--filtered': value.filtered })}
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
						{!hideCheckbox && <Checkbox {...subProps.checkbox} checked={value.filtered} disableA11y={true} />}
						<span className="ss__facet-list-options__option__value">
							{value.label}
							{!hideCount && value?.count > 0 && <span className="ss__facet-list-options__option__value__count">({value.count})</span>}
						</span>
					</a>
				))}
			</div>
		</CacheProvider>
	) : (
		<Fragment></Fragment>
	);
});

export interface FacetListOptionsProps extends ComponentProps {
	values?: FacetValue[];
	hideCheckbox?: boolean;
	hideCount?: boolean;
	facet?: ValueFacet;
	onClick?: (e: React.MouseEvent) => void;
	previewOnFocus?: boolean;
	valueProps?: any;
	horizontal?: boolean;
}

interface FacetListOptionsSubProps {
	checkbox: CheckboxProps;
}
