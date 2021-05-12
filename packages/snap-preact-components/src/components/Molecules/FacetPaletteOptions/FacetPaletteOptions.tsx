/** @jsx jsx */
import { Fragment, h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { defined } from '../../../utilities';
import { ValueFacetValue, ComponentProps } from '../../../types';
import { Icon, IconProps } from '../../Atoms/Icon';
import { Theme, useTheme } from '../../../providers/theme';

const CSS = {
	palette: ({ columns, gapSize, style }) =>
		css({
			display: 'grid',
			gridTemplateColumns: `repeat(${columns}, calc((100% - (${columns - 1} * ${gapSize}))/ ${columns}))`,
			gap: gapSize,
			'& .ss-palette__option': {
				position: 'relative',
				'&:hover': {
					cursor: 'pointer',
				},
				'& .ss-palette__option__palette': {
					paddingTop: '100%',
					border: '1px solid #EBEBEB',
					borderRadius: '100%',
					position: 'relative',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					'.ss-palette__icon': {
						position: 'absolute',
						top: 0,
						right: 0,
						left: 0,
						margin: 'auto',
						bottom: 0,
						textAlign: 'center',
					},
				},
				'& .ss-palette__option__value': {
					display: 'block',
					textAlign: 'center',
					overflow: 'hidden',
					textOverflow: 'ellipsis',
					whiteSpace: 'nowrap',
				},
			},
			...style,
		}),
};

export const FacetPaletteOptions = observer(
	(properties: FacetPaletteOptionsProps): JSX.Element => {
		const globalTheme: Theme = useTheme();
		const theme = { ...globalTheme, ...properties.theme };

		const props: FacetPaletteOptionsProps = {
			// default props
			values: [],
			columns: 4,
			gapSize: '8px',
			// global theme
			...globalTheme?.components?.facetpaletteoptions,
			// props
			...properties,
			...properties.theme?.components?.facetpaletteoptions,
		};

		const { values, hideLabel, columns, gapSize, hideIcon, onClick, previewOnFocus, valueProps, disableStyles, className, style } = props;

		const subProps: FacetPaletteOptionsSubProps = {
			icon: {
				// default props
				className: 'ss-palette__icon',
				// global theme
				...globalTheme?.components?.icon,
				// inherited props
				...defined({
					disableStyles,
				}),
				// component theme overrides
				...props.theme?.components?.icon,
			},
			icon_bg: {
				icon: 'close',
				color: 'black',
				size: '40%',
			},
			icon_fg: {
				icon: 'close-thin',
				color: 'white',
				size: '30%',
			},
		};

		return (
			values?.length && (
				<div css={!disableStyles && CSS.palette({ columns, gapSize, style })} className={classnames('ss-palette', className)}>
					{values.map((value) => (
						<a
							className={classnames('ss-palette__option', { 'ss-palette__option-filtered': value.filtered })}
							onClick={onClick}
							onFocus={() => previewOnFocus && value.preview && value.preview()}
							{...valueProps}
							{...value.url?.link}
						>
							<div className="ss-palette__option__palette" css={{ background: value.value }}>
								{!hideIcon && value.filtered && (
									<>
										<Icon {...subProps.icon} {...subProps.icon_bg} />
										<Icon {...subProps.icon} {...subProps.icon_fg} />
									</>
								)}
							</div>
							{!hideLabel && <span className="ss-palette__option__value">{value.label}</span>}
						</a>
					))}
				</div>
			)
		);
	}
);

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
	icon_bg: IconProps;
	icon_fg: IconProps;
}
