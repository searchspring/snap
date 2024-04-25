/** @jsx jsx */
import { Fragment, h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';

import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, StylingCSS, SwatchOption, BreakpointsProps } from '../../../types';
import { useState } from 'react';
import { useA11y } from '../../../hooks';
import { Carousel, CarouselProps } from '../Carousel';
import { defined } from '../../../utilities';

const CSS = {
	Swatches: ({}: Partial<SwatchesProps>) =>
		css({
			marginTop: '10px',
			'.ss__swatches__carousel__swatch': {
				boxSizing: 'content-box',
				cursor: 'pointer',
				backgroundRepeat: 'no-repeat',
				display: 'inline-block',
				borderRadius: '50%',
				border: '4px solid #eee',
				width: '40px',
				height: '40px',
				margin: 'auto',
				backgroundSize: ' 40px !important',
				backgroundPosition: 'center !important',

				'& .ss__swatches__carousel__swatch__value': {
					textAlign: 'center',
					verticalAlign: 'middle',
					lineHeight: '40px',
					display: 'block',
					fontSize: '10px',
				},
				'&.ss__swatches__carousel__swatch--selected': {
					border: '4px solid black',
				},
				'&.ss__swatches__carousel__swatch--disabled': {
					position: 'relative',
					opacity: '0.4',
					'&:before': {
						content: '""',
						display: 'block',
						position: 'absolute',
						top: '20px',
						width: '40px',
						height: '1px',
						borderTop: '4px solid #eee',
						transform: 'rotate(-45deg)',
					},
				},
			},
		}),
};

export function Swatches(properties: SwatchesProps): JSX.Element {
	const globalTheme: Theme = useTheme();

	const props: SwatchesProps = {
		// default props
		// global theme
		...globalTheme?.components?.swatches,
		// props
		...properties,
		...properties.theme?.components?.swatches,
	};

	const { onSelect, disabled, options, showLabel, disableStyles, className, breakpoints, style, ...additionalProps } = props;

	const subProps: SwatchesSubProps = {
		carousel: {
			// default props
			className: 'ss__swatches__carousel',
			loop: false,
			// global theme
			...globalTheme?.components?.carousel,
			// inherited props
			...defined({
				breakpoints,
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
		},
	};

	const selected = props.selected;

	const styling: { css?: StylingCSS } = {};
	if (!disableStyles) {
		styling.css = [CSS.Swatches({}), style];
	} else if (style) {
		styling.css = [style];
	}

	// selection state
	const [selection, setSelection] = useState((selected as SwatchOption) || undefined);

	const makeSelection = (e: React.MouseEvent<HTMLElement>, option: SwatchOption) => {
		if (onSelect) {
			onSelect(e, option);
		}
		setSelection(option);
	};

	return typeof options == 'object' && options?.length ? (
		<CacheProvider>
			<div {...styling} className={classnames('ss__swatches', className)}>
				<Carousel {...subProps.carousel} {...additionalProps}>
					{options.map((option) => {
						const label = option.label;
						const background = option.thumbnailImageUrl ? `url(${option.thumbnailImageUrl})` : option.background ? option.background : option.value;
						const selected = selection?.value == option.value;

						return (
							<div
								className={`ss__swatches__carousel__swatch ${selected ? 'ss__swatches__carousel__swatch--selected' : ''} ${
									option.disabled ? 'ss__swatches__carousel__swatch--disabled' : ''
								}`}
								title={label}
								style={{ background: background }}
								onClick={(e) => !disabled && makeSelection(e as any, option)}
								ref={(e) => useA11y(e)}
								role="option"
								aria-selected={selected}
							>
								{showLabel && <span className="ss__swatches__carousel__swatch__value">{label}</span>}
							</div>
						);
					})}
				</Carousel>
			</div>
		</CacheProvider>
	) : (
		<Fragment></Fragment>
	);
}

export interface SwatchesProps extends ComponentProps {
	options: SwatchOption[];
	onSelect?: (e: React.MouseEvent<HTMLElement>, option: SwatchOption) => void;
	selected?: SwatchOption;
	showLabel?: boolean;
	breakpoints?: BreakpointsProps;
}

interface SwatchesSubProps {
	carousel: CarouselProps;
}
