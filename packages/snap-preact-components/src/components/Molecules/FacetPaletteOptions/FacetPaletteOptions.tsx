/** @jsx jsx */
import { Fragment, h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { filters } from '@searchspring/snap-toolbox';

import { defined, createHoverTimeoutProps } from '../../../utilities';
import { ComponentProps, StylingCSS } from '../../../types';
import { Icon, IconProps } from '../../Atoms/Icon';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import type { FacetValue, ValueFacet } from '@searchspring/snap-store-mobx';

const CSS = {
	palette: ({ columns, gapSize, theme }: Partial<FacetPaletteOptionsProps>) =>
		css({
			display: 'flex',
			flexFlow: 'row wrap',
			gridTemplateColumns: `repeat(${columns}, calc((100% - (${columns! - 1} * ${gapSize}))/ ${columns}))`,
			gap: gapSize,

			'& .ss__facet-palette-options__option': {
				width: `calc(100% / ${columns} - ${2 * Math.round((columns! + 2) / 2)}px )`,
				marginRight: gapSize,
				marginBottom: gapSize,
				[`:nth-of-type(${columns}n)`]: {
					marginRight: '0',
				},

				'&:hover': {
					cursor: 'pointer',
					'.ss__facet-palette-options__option__wrapper': {
						borderColor: '#EBEBEB',
					},
					'& .ss__facet-palette-options__option__palette': {
						'& .ss__facet-palette-options__icon': {
							opacity: 1,
						},
					},
				},
				'& .ss__facet-palette-options__option__wrapper': {
					border: `2px solid transparent`,
					borderRadius: '100%',
					padding: '2px',
				},
				'&.ss__facet-palette-options__option--filtered': {
					'& .ss__facet-palette-options__option__wrapper': {
						borderColor: theme?.colors?.primary || '#333',
						padding: '0px',
						borderWidth: '4px',
					},
				},
				'& .ss__facet-palette-options__option__palette': {
					paddingTop: 'calc(100% - 2px)',
					border: '1px solid #EBEBEB',
					borderRadius: '100%',
					position: 'relative',
					'& .ss__facet-palette-options__icon': {
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
				'& .ss__facet-palette-options__option__value': {
					display: 'block',
					textAlign: 'center',
					overflow: 'hidden',
					textOverflow: 'ellipsis',
					whiteSpace: 'nowrap',
				},
			},
			'@supports (display: grid)': {
				display: 'grid',

				'& .ss__facet-palette-options__option': {
					margin: '0',
					width: 'initial',
				},
			},
		}),
};

export const FacetPaletteOptions = observer((properties: FacetPaletteOptionsProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const theme = { ...globalTheme, ...properties.theme };

	const props: FacetPaletteOptionsProps = {
		// default props
		columns: 4,
		gapSize: '8px',
		// global theme
		...globalTheme?.components?.facetPaletteOptions,
		// props
		...properties,
		...properties.theme?.components?.facetPaletteOptions,
	};

	const {
		values,
		hideLabel,
		columns,
		gapSize,
		hideIcon,
		onClick,
		previewOnFocus,
		previewOnHover,
		valueProps,
		facet,
		disableStyles,
		className,
		style,
	} = props;

	const subProps: FacetPaletteOptionsSubProps = {
		icon: {
			// default props
			className: 'ss__facet-palette-options__icon',
			// global theme
			...globalTheme?.components?.icon,
			// inherited props
			...defined({
				disableStyles,
				icon: 'close-thin',
				color: 'white',
				size: '40%',
			}),
			// component theme overrides
			theme: props?.theme,
		},
	};

	const styling: { css?: StylingCSS } = {};
	if (!disableStyles) {
		styling.css = [CSS.palette({ columns, gapSize, theme }), style];
	} else if (style) {
		styling.css = [style];
	}

	const facetValues = values || facet?.values;

	return facetValues?.length ? (
		<CacheProvider>
			<div {...styling} className={classnames('ss__facet-palette-options', className)}>
				{(facetValues as FacetValue[]).map((value) => (
					<a
						className={classnames('ss__facet-palette-options__option', { 'ss__facet-palette-options__option--filtered': value.filtered })}
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
						onFocus={() => !previewOnHover && previewOnFocus && value.preview && value.preview()}
						{...(previewOnHover ? createHoverTimeoutProps(() => value?.preview && value.preview()) : {})}
					>
						<div className="ss__facet-palette-options__option__wrapper">
							<div
								className={classnames(
									'ss__facet-palette-options__option__palette',
									`ss__facet-palette-options__option__palette--${filters.handleize(value.value)}`
								)}
								css={{ background: value.value }}
							>
								{!hideIcon && value.filtered && <Icon {...subProps.icon} />}
							</div>
						</div>
						{!hideLabel && <span className="ss__facet-palette-options__option__value">{value.label}</span>}
					</a>
				))}
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
	gapSize?: string;
	hideIcon?: boolean;
	facet?: ValueFacet;
	onClick?: (e: React.MouseEvent) => void;
	previewOnFocus?: boolean;
	valueProps?: any;
	previewOnHover?: boolean;
}

interface FacetPaletteOptionsSubProps {
	icon: IconProps;
}
