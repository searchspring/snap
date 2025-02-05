import { Fragment, h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { Theme, useTheme, CacheProvider, useTreePath } from '../../../providers';
import { mergeProps, mergeStyles } from '../../../utilities';
import { ComponentProps, StyleScript } from '../../../types';
import { createHoverProps } from '../../../toolbox';
import type { FacetHierarchyValue, ValueFacet } from '@searchspring/snap-store-mobx';
import { Lang, useLang } from '../../../hooks';
import deepmerge from 'deepmerge';

const defaultStyles: StyleScript<FacetHierarchyOptionsProps> = ({ theme, horizontal }) => {
	if (horizontal) {
		return css({
			display: 'flex',
			flexWrap: 'wrap',
			'& .ss__facet-hierarchy-options__option': {
				margin: '0 5px 5px 0',
				padding: '6px',
				textDecoration: 'none',
				flex: '0 1 auto',

				'&:hover': {
					cursor: 'pointer',
				},
				'&.ss__facet-hierarchy-options__option--filtered': {
					fontWeight: 'bold',
					color: theme?.variables?.colors?.primary,
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
						color: theme?.variables?.colors?.primary,
					},
				},
				'& .ss__facet-hierarchy-options__option__value': {
					'& .ss__facet-hierarchy-options__option__value__count': {
						fontSize: '0.8em',
						marginLeft: '6px',
					},
				},
			},
		});
	} else {
		return css({
			'& .ss__facet-hierarchy-options__option': {
				display: 'flex',
				padding: '6px 0',
				textDecoration: 'none',
				alignItems: 'center',
				'&:hover': {
					cursor: 'pointer',
				},
				'&.ss__facet-hierarchy-options__option--filtered': {
					fontWeight: 'bold',
					color: theme?.variables?.colors?.primary,
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
						color: theme?.variables?.colors?.primary,
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
		});
	}
};

export const FacetHierarchyOptions = observer((properties: FacetHierarchyOptionsProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const globalTreePath = useTreePath();
	const defaultProps: Partial<FacetHierarchyOptionsProps> = {
		treePath: globalTreePath,
	};

	const props = mergeProps('facetHierarchyOptions', globalTheme, defaultProps, properties);

	const { values, hideCount, onClick, previewOnFocus, horizontal, valueProps, facet, className } = props;

	const styling = mergeStyles<FacetHierarchyOptionsProps>(props, defaultStyles);

	const facetValues = values || facet?.refinedValues;

	return facetValues?.length ? (
		<CacheProvider>
			<div {...styling} className={classnames('ss__facet-hierarchy-options', { 'ss__facet-hierarchy-options--horizontal': horizontal }, className)}>
				{(facetValues as FacetHierarchyValue[]).map((value) => {
					//initialize lang
					const defaultLang = {
						hierarchyOption: {
							attributes: {
								'aria-label': `${
									value.filtered
										? `selected ${value.label}`
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
							className={classnames(
								'ss__facet-hierarchy-options__option',
								{ 'ss__facet-hierarchy-options__option--filtered': value.filtered },
								{ 'ss__facet-hierarchy-options__option--return': value.history && !value.filtered }
							)}
							href={value.url?.link?.href}
							{...valueProps}
							onClick={(e: React.MouseEvent<Element, MouseEvent>) => {
								value.url?.link?.onClick(e);
								onClick && onClick(e);
							}}
							{...(previewOnFocus ? createHoverProps(() => value?.preview && value.preview()) : {})}
							{...mergedLang.hierarchyOption?.all}
						>
							<span className="ss__facet-hierarchy-options__option__value">
								{value.label}
								{!hideCount && value?.count > 0 && !value.filtered && (
									<span className="ss__facet-hierarchy-options__option__value__count">({value.count})</span>
								)}
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
export interface FacetHierarchyOptionsProps extends ComponentProps {
	values?: FacetHierarchyValue[];
	hideCount?: boolean;
	facet?: ValueFacet;
	horizontal?: boolean;
	onClick?: (e: React.MouseEvent) => void;
	previewOnFocus?: boolean;
	valueProps?: any;
	lang?: Partial<FacetHierarchyOptionsLang>;
}

export interface FacetHierarchyOptionsLang {
	hierarchyOption: Lang<{
		facet: ValueFacet;
		value: FacetHierarchyValue;
	}>;
}
