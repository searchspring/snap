import { Fragment, h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react';

import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, RootNodeProperties } from '../../../types';
import { defined, mergeProps } from '../../../utilities';
import { Checkbox, CheckboxProps } from '../Checkbox/Checkbox';
import { createHoverProps } from '../../../toolbox';
import type { FacetValue, ValueFacet } from '@searchspring/snap-store-mobx';
import { Lang, useLang } from '../../../hooks';
import deepmerge from 'deepmerge';

const CSS = {
	list: ({ theme, horizontal, hideCheckbox }: Partial<FacetListOptionsProps>) =>
		css({
			display: horizontal ? 'flex' : undefined,
			flexWrap: horizontal ? 'wrap' : undefined,

			'& .ss__facet-list-options__option': {
				display: horizontal ? undefined : 'flex',
				alignItems: horizontal ? undefined : 'center',
				flex: horizontal ? '0 1 auto' : undefined,
				padding: '6px',
				textDecoration: 'none',
				'&:hover': {
					cursor: 'pointer',
					background: theme?.variables?.colors?.hover?.background,
				},
				'&.ss__facet-list-options__option--filtered': {
					fontWeight: 'bold',
					color: theme?.variables?.colors?.primary,
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
	const defaultProps: Partial<FacetListOptionsProps> = {
		hideCheckbox: properties.horizontal ? true : false,
	};

	const props = mergeProps('facetListOptions', globalTheme, defaultProps, properties);

	const { values, hideCheckbox, hideCount, onClick, previewOnFocus, valueProps, facet, disableStyles, className, style, styleScript, treePath } =
		props;

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
			treePath,
		},
	};

	const styling: RootNodeProperties = { 'ss-name': props.name };
	const stylingProps = props;

	if (styleScript && !disableStyles) {
		styling.css = [styleScript(stylingProps), style];
	} else if (!disableStyles) {
		styling.css = [CSS.list(stylingProps), style];
	} else if (style) {
		styling.css = [style];
	}

	const facetValues = values || facet?.refinedValues;

	return facetValues?.length ? (
		<CacheProvider>
			<div {...styling} className={classnames('ss__facet-list-options', className)}>
				{(facetValues as FacetValue[]).map((value) => {
					//initialize lang
					const defaultLang = {
						listOption: {
							attributes: {
								'aria-label': `${
									value.filtered
										? `remove selected filter ${facet?.label || ''} - ${value.label}`
										: facet?.label
										? `filter by ${facet?.label} - ${value.label}`
										: `filter by ${value.label}`
								}`,
							},
						},
					};

					//deep merge with props.lang
					const lang = deepmerge(defaultLang, props.lang || {});
					const mergedLang = useLang(lang as any, {
						facet,
						value,
					});

					return (
						<a
							className={classnames('ss__facet-list-options__option', { 'ss__facet-list-options__option--filtered': value.filtered })}
							href={value.url?.link?.href}
							{...valueProps}
							onClick={(e: React.MouseEvent<Element, MouseEvent>) => {
								value.url?.link?.onClick(e);
								onClick && onClick(e);
							}}
							{...(previewOnFocus ? createHoverProps(() => value?.preview && value.preview()) : {})}
							{...mergedLang.listOption?.all}
						>
							{!hideCheckbox && <Checkbox {...subProps.checkbox} checked={value.filtered} disableA11y={true} />}
							<span className="ss__facet-list-options__option__value">
								{value.label}
								{!hideCount && value?.count > 0 && <span className="ss__facet-list-options__option__value__count">({value.count})</span>}
							</span>
						</a>
					);
				})}
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
	horizontal?: boolean;
	onClick?: (e: React.MouseEvent) => void;
	previewOnFocus?: boolean;
	valueProps?: any;
	lang?: Partial<FacetListOptionsLang>;
}

export interface FacetListOptionsLang {
	listOption: Lang<{
		facet: ValueFacet;
		value: FacetValue;
	}>;
}

interface FacetListOptionsSubProps {
	checkbox: CheckboxProps;
}
