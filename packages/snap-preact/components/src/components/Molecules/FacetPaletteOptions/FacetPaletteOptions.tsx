import { Fragment, h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { filters } from '@searchspring/snap-toolbox';

import { defined, mergeProps, mergeStyles } from '../../../utilities';
import { ComponentProps, StyleScript } from '../../../types';
import { Icon, IconProps } from '../../Atoms/Icon';
import { Theme, useTheme, CacheProvider, useTreePath } from '../../../providers';
import { createHoverProps } from '../../../toolbox';
import type { FacetValue, ValueFacet } from '@searchspring/snap-store-mobx';
import { Checkbox, CheckboxProps } from '../Checkbox';
import { Lang, useLang } from '../../../hooks';
import deepmerge from 'deepmerge';

const defaultStyles: StyleScript<FacetPaletteOptionsProps> = ({ columns, gridSize, gapSize, horizontal, theme }) => {
	return css({
		display: 'flex',
		flexFlow: 'row wrap',
		gridTemplateColumns: columns
			? `repeat(${columns}, calc((100% - (${columns! - 1} * ${gapSize}))/ ${columns}))`
			: `repeat(auto-fill, minmax(${gridSize}, 1fr))`,
		gap: gapSize,

		'.ss__facet-palette-options__option--list': {
			display: 'flex',
			flexDirection: 'row',
		},

		'.ss__facet-palette-options__option': {
			width: `calc(100% / ${columns} - ${2 * Math.round((columns! + 2) / 2)}px )`,
			marginRight: gapSize,
			marginBottom: gapSize,
			[`:nth-of-type(${columns}n)`]: {
				marginRight: '0',
			},

			'.ss__facet-palette-options__option__wrapper': {
				border: `2px solid transparent`,
				borderRadius: '100%',
				padding: '2px',
			},

			'.ss__facet-palette-options__option__palette': {
				paddingTop: 'calc(100% - 2px)',
				border: '1px solid #EBEBEB',
				borderRadius: '100%',
				position: 'relative',
				'.ss__facet-palette-options__icon': {
					position: 'absolute',
					top: 0,
					right: 0,
					left: 0,
					margin: 'auto',
					bottom: 0,
					textAlign: 'center',
					stroke: 'black',
					strokeWidth: '3px',
					strokeLinejoin: 'round',
					opacity: 0,
				},
			},
			'.ss__facet-palette-options__option__value': {
				display: 'block',
				textAlign: 'center',
				overflow: 'hidden',
				textOverflow: 'ellipsis',
				whiteSpace: 'nowrap',
			},
		},
		'@supports (display: grid)': {
			display: 'grid',

			'.ss__facet-palette-options__option': {
				margin: '0',
				width: 'initial',
			},
		},

		'&.ss__facet-palette-options--list': {
			display: 'flex',
			flexDirection: horizontal ? 'row' : 'column',

			'.ss__facet-palette-options__option__wrapper': {
				borderColor: 'transparent',
				width: '16px',
				height: 'fit-content',
			},

			'.ss__facet-palette-options__option--filtered': {
				'.ss__facet-palette-options__option__value': {
					fontWeight: 'bold',
				},
			},

			'.ss__facet-palette-options__option--list': {
				alignItems: 'center',
			},

			'.ss__facet-palette-options__option__value__count': {
				marginLeft: '5px',
			},

			'.ss__facet-palette-options__checkbox': {
				marginRight: '5px',
			},
		},

		'&.ss__facet-palette-options--grid': {
			'.ss__facet-palette-options__checkbox': {
				display: 'flex',
				textAlign: 'center',
				overflow: 'hidden',
				margin: 'auto',
				marginBottom: '5px',
			},

			'.ss__facet-palette-options__option--filtered': {
				'.ss__facet-palette-options__option__wrapper': {
					borderColor: theme?.variables?.colors?.primary || '#333' + ' !important',
					padding: '0px',
					borderWidth: '4px',
				},
			},

			'.ss__facet-palette-options__option': {
				'&:hover': {
					cursor: 'pointer',
					'.ss__facet-palette-options__option__wrapper': {
						borderColor: '#EBEBEB',
					},
					'.ss__facet-palette-options__option__palette': {
						'.ss__facet-palette-options__icon': {
							opacity: 1,
						},
					},
				},
			},
		},

		'.ss__facet-palette-options__option__value__count': {
			fontSize: '0.8em',
			display: 'block',
			textAlign: 'center',
			overflow: 'hidden',
			textOverflow: 'ellipsis',
			whiteSpace: 'nowrap',
		},
	});
};

export const FacetPaletteOptions = observer((properties: FacetPaletteOptionsProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const globalTreePath = useTreePath();
	const defaultProps: Partial<FacetPaletteOptionsProps> = {
		columns: 4,
		layout: 'grid',
		gridSize: '45px',
		gapSize: properties.layout == 'list' ? '2px' : '8px',
		hideCount: true,
		hideCheckbox: true,
		treePath: globalTreePath,
	};

	const props = mergeProps('facetPaletteOptions', globalTheme, defaultProps, properties);

	const {
		values,
		hideLabel,
		layout,
		hideCount,
		hideCheckbox,
		colorMapping,
		hideIcon,
		onClick,
		previewOnFocus,
		valueProps,
		facet,
		horizontal,
		disableStyles,
		className,
		treePath,
	} = props;

	if (horizontal) {
		props.columns = 0;
	}

	const subProps: FacetPaletteOptionsSubProps = {
		icon: {
			// default props
			className: 'ss__facet-palette-options__icon',
			// inherited props
			...defined({
				disableStyles,
				icon: 'close-thin',
				color: 'white',
				size: '40%',
			}),
			// component theme overrides
			theme: props?.theme,
			treePath,
		},
		checkbox: {
			// default props
			className: 'ss__facet-palette-options__checkbox',
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
			treePath,
		},
	};

	const styling = mergeStyles<FacetPaletteOptionsProps>(props, defaultStyles);

	const facetValues = values || facet?.values;

	return facetValues?.length ? (
		<CacheProvider>
			<div {...styling} className={classnames('ss__facet-palette-options', `ss__facet-palette-options--${layout?.toLowerCase()}`, className)}>
				{(facetValues as FacetValue[]).map((value) => {
					//initialize lang
					const defaultLang = {
						paletteOption: {
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
							key={value.value}
							className={classnames(
								'ss__facet-palette-options__option',
								{ 'ss__facet-palette-options__option--filtered': value.filtered },
								`ss__facet-palette-options__option--${layout?.toLowerCase()}`
							)}
							href={value.url?.link?.href}
							{...(hideLabel ? { title: value.label } : {})}
							{...valueProps}
							onClick={(e: React.MouseEvent<Element, MouseEvent>) => {
								value.url?.link?.onClick(e);
								onClick && onClick(e);
							}}
							aria-atomic="false"
							{...(previewOnFocus ? createHoverProps(() => value?.preview && value.preview()) : {})}
							{...mergedLang.paletteOption?.all}
						>
							{!hideCheckbox && <Checkbox {...subProps.checkbox} checked={value.filtered} disableA11y={true} />}
							<div className="ss__facet-palette-options__option__wrapper">
								<div
									className={classnames(
										'ss__facet-palette-options__option__palette',
										`ss__facet-palette-options__option__palette--${filters.handleize(value.value)}`
									)}
									style={{
										background:
											colorMapping && colorMapping[value.label] && colorMapping[value.label].background
												? colorMapping[value.label].background
												: value.value,
									}}
								>
									{!hideIcon && value.filtered && layout?.toLowerCase() == 'grid' && <Icon {...subProps.icon} />}
								</div>
							</div>
							{!hideLabel && (
								<span className="ss__facet-palette-options__option__value">
									{colorMapping && colorMapping[value.label] && colorMapping[value.label].label ? colorMapping[value.label].label : value.label}
								</span>
							)}
							{!hideCount && value?.count > 0 && <span className="ss__facet-palette-options__option__value__count">({value.count})</span>}
						</a>
					);
				})}
			</div>
		</CacheProvider>
	) : (
		<Fragment></Fragment>
	);
});

export interface FacetPaletteOptionsProps extends ComponentProps {
	values?: FacetValue[];
	hideLabel?: boolean;
	columns?: number;
	gridSize?: string;
	gapSize?: string;
	hideIcon?: boolean;
	facet?: ValueFacet;
	horizontal?: boolean;
	onClick?: (e: React.MouseEvent) => void;
	previewOnFocus?: boolean;
	valueProps?: any;
	layout?: 'list' | 'grid';
	hideCount?: boolean;
	hideCheckbox?: boolean;
	colorMapping?: {
		[name: string]: {
			label?: string;
			background?: string;
		};
	};
	lang?: Partial<FacetPaletteOptionsLang>;
}

export interface FacetPaletteOptionsLang {
	paletteOption: Lang<{
		facet: ValueFacet;
		value: FacetValue;
	}>;
}

interface FacetPaletteOptionsSubProps {
	icon: IconProps;
	checkbox: CheckboxProps;
}
