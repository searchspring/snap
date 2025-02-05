import { Fragment, h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { Theme, useTheme, CacheProvider, useTreePath } from '../../../providers';
import { mergeProps, mergeStyles } from '../../../utilities';
import { createHoverProps } from '../../../toolbox';
import { ComponentProps, StyleScript } from '../../../types';
import type { FacetValue, ValueFacet } from '@searchspring/snap-store-mobx';
import { Lang, useLang } from '../../../hooks';
import deepmerge from 'deepmerge';
import Color from 'color';

const defaultStyles: StyleScript<FacetGridOptionsProps> = ({ columns, gapSize, gridSize, theme }) => {
	const variables = theme?.variables;
	const backgroundColor = new Color(variables?.colors.primary);
	const color = backgroundColor.isDark() ? '#fff' : '#000';

	return css({
		display: 'flex',
		flexFlow: 'row wrap',
		gridTemplateColumns: columns ? `repeat(${columns}, 1fr)` : `repeat(auto-fill, minmax(${gridSize}, 1fr))`,
		gap: gapSize,
		gridAutoRows: `1fr`,

		'& .ss__facet-grid-options__option': {
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			flex: '0 1 auto',
			border: `1px solid ${backgroundColor.hex() || '#333'}`,
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
				background: backgroundColor.hex() || '#ccc',
				color: color || '#333',
			},
			'&:hover:not(.ss__facet-grid-options__option--filtered)': {
				cursor: 'pointer',
				background: backgroundColor.hex() || '#f8f8f8',
				color: color || '#333',
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
	});
};

export const FacetGridOptions = observer((properties: FacetGridOptionsProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const globalTreePath = useTreePath();

	const defaultProps: Partial<FacetGridOptionsProps> = {
		columns: 4,
		gapSize: '8px',
		gridSize: '45px',
		treePath: globalTreePath,
	};

	const props = mergeProps('facetGridOptions', globalTheme, defaultProps, properties);

	const { values, onClick, previewOnFocus, valueProps, facet, horizontal, className } = props;

	if (horizontal) {
		props.columns = 0;
	}

	const styling = mergeStyles<FacetGridOptionsProps>(props, defaultStyles);

	const facetValues = values || facet?.refinedValues;

	return facetValues?.length ? (
		<CacheProvider>
			<div {...styling} className={classnames('ss__facet-grid-options', className)}>
				{(facetValues as FacetValue[]).map((value) => {
					//initialize lang
					const defaultLang = {
						gridOption: {
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
							className={classnames('ss__facet-grid-options__option', { 'ss__facet-grid-options__option--filtered': value.filtered })}
							href={value.url?.link?.href}
							{...valueProps}
							onClick={(e: React.MouseEvent<Element, MouseEvent>) => {
								value.url?.link?.onClick(e);
								onClick && onClick(e);
							}}
							{...(previewOnFocus ? createHoverProps(() => value?.preview && value.preview()) : {})}
							{...mergedLang.gridOption?.all}
						>
							<span
								className={classnames('ss__facet-grid-options__option__value', {
									'ss__facet-grid-options__option__value--smaller': value.label.length > 3,
								})}
							>
								{value.label}
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

export interface FacetGridOptionsProps extends ComponentProps {
	values?: FacetValue[];
	columns?: number;
	gridSize?: string;
	gapSize?: string;
	horizontal?: boolean;
	onClick?: (e: React.MouseEvent) => void;
	facet?: ValueFacet;
	previewOnFocus?: boolean;
	valueProps?: any;
	lang?: Partial<FacetGridOptionsLang>;
}

export interface FacetGridOptionsLang {
	gridOption: Lang<{
		facet: ValueFacet;
		value: FacetValue;
	}>;
}
