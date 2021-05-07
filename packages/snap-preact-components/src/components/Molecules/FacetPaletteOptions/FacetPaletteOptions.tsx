/** @jsx jsx */
import { Fragment, h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { defined } from '../../../utilities';
import { ValueFacetValue, ComponentProps } from '../../../types';
import { Icon, IconProps } from '../../Atoms/Icon';
import { Theme, useTheme } from '../../../providers/theme';

const WHITE = /^(?:white|#fff(?:fff)?|rgba?\(\s*255\s*,\s*255\s*,\s*255\s*(?:,\s*1\s*)?\))$/i;

const CSS = {
	palette: ({ columns, gapSize, style }) =>
		css({
			display: 'grid',
			gridTemplateColumns: `repeat(${columns}, calc((100% - (${columns - 1} * ${gapSize}))/ ${columns}))`,
			gap: gapSize,
			...style,
		}),
	optionWrapper: () =>
		css({
			position: 'relative',
			'&:hover': {
				cursor: 'pointer',
			},
		}),
	paletteOption: ({ color }) =>
		css({
			paddingTop: '100%',
			// background: TODO: add 'n/a' background image fallback for non-valid valid css colors
			background: color,
			border: '1px solid #EBEBEB', //fallback for non-valid css colors
			borderColor: `${String(color).match(WHITE) ? '#EBEBEB' : color}`,
			webkitBorderRadius: '100%',
			mozBorderRadius: '100%',
			msBorderRadius: '100%',
			oBorderRadius: '100%',
			borderRadius: '100%',
			position: 'relative',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
		}),
	icon: () =>
		css({
			position: 'absolute',
			top: 0,
			right: 0,
			left: 0,
			margin: 'auto',
			bottom: 0,
			textAlign: 'center',
		}),
	content: () =>
		css({
			display: 'block',
			textAlign: 'center',
			overflow: 'hidden',
			textOverflow: 'ellipsis',
			whiteSpace: 'nowrap',
		}),
};

export const FacetPaletteOptions = observer(
	(properties: FacetPaletteOptionsProps): JSX.Element => {
		const globalTheme: Theme = useTheme();
		const theme = { ...globalTheme, ...properties.theme };

		const props: FacetPaletteOptionsProps = {
			// default props
			disableStyles: false,
			values: [],
			hideLabel: false,
			columns: 4,
			gapSize: '8px',
			hideIcon: false,
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
				...props.theme?.components?.icon, //TODO: should this be ...theme?.components?.icon
			},
		};

		return (
			values?.length && (
				<div
					css={
						!disableStyles &&
						CSS.palette({
							columns,
							gapSize,
							style,
						})
					}
					className={classnames('ss-palette', className)}
				>
					{values.map((value) => {
						return (
							<a
								css={!disableStyles && CSS.optionWrapper()}
								onClick={onClick}
								onFocus={() => {
									previewOnFocus && value.preview && value.preview();
								}}
								{...valueProps}
								{...value.url?.link}
							>
								<div css={!disableStyles && CSS.paletteOption({ color: value.value })} className={'ss-palette-option'}>
									{/* TODO: fuuuuture add imageurl  */}
									{!hideIcon && value.filtered && (
										<>
											{/* TODO look into subProps here - maybe change icon to support svg outlines? */}
											<Icon icon={'close'} size={'40%'} color={'black'} {...subProps.icon} css={!disableStyles && CSS.icon()} />
											<Icon icon={'close-thin'} size={'30%'} color={'white'} {...subProps.icon} css={!disableStyles && CSS.icon()} />
										</>
									)}
								</div>

								{!hideLabel && (
									<span css={!disableStyles && CSS.content()} className={classnames('ss-label', { filtered: value.filtered })}>
										{value.label}
									</span>
								)}
							</a>
						);
					})}
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
}
