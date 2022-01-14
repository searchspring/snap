/** @jsx jsx */
import { Fragment, h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { filters } from '@searchspring/snap-toolbox';

import { defined } from '../../../utilities';
import { ValueFacetValue, ComponentProps } from '../../../types';
import { Icon, IconProps } from '../../Atoms/Icon';
import { Theme, useTheme, CacheProvider } from '../../../providers';

const CSS = {
	palette: ({ columns, gapSize, theme }) =>
		css({
			display: 'flex',
			flexFlow: 'row wrap',
			'& .ss__facet-palette-options__option': {
				width: `calc(100% / ${columns} - ${2 * Math.round((columns + 2) / 2)}px )`,
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
						borderColor: theme.colors?.primary || '#333',
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
				gridTemplateColumns: `repeat(${columns}, 1fr)`,
				gap: gapSize,
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
		values: [],
		columns: 4,
		gapSize: '8px',
		// global theme
		...globalTheme?.components?.facetPaletteOptions,
		// props
		...properties,
		...properties.theme?.components?.facetPaletteOptions,
	};

	const { values, hideLabel, columns, gapSize, hideIcon, onClick, previewOnFocus, valueProps, disableStyles, className, style } = props;

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
			theme: props.theme,
		},
	};

	const styling: { css?: any } = {};
	if (!disableStyles) {
		styling.css = [CSS.palette({ columns, gapSize, theme }), style];
	} else if (style) {
		styling.css = [style];
	}

	return (
		values?.length && (
			<CacheProvider>
				<div {...styling} className={classnames('ss__facet-palette-options', className)}>
					{values.map((value) => (
						<a
							className={classnames('ss__facet-palette-options__option', { 'ss__facet-palette-options__option--filtered': value.filtered })}
							onClick={onClick}
							aria-label={value.value}
							onFocus={() => previewOnFocus && value.preview && value.preview()}
							{...valueProps}
							{...value.url?.link}
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
		)
	);
});

export interface FacetPaletteOptionsProps extends ComponentProps {
	values: ValueFacetValue[];
	hideLabel?: boolean;
	columns?: number;
	gapSize?: string;
	hideIcon?: boolean;
	onClick?: (e: Event) => void;
	previewOnFocus?: boolean;
	valueProps?: any;
}

interface FacetPaletteOptionsSubProps {
	icon: IconProps;
}
