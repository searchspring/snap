import { Fragment, h } from 'preact';

import { useState } from 'preact/hooks';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';

import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, RootNodeProperties, SwatchOption, BreakpointsProps } from '../../../types';
import { useA11y, useDisplaySettings } from '../../../hooks';
import { Carousel, CarouselProps } from '../Carousel';
import { defined } from '../../../utilities';
import { Grid, GridProps } from '../Grid';
import { ImageProps, Image } from '../../Atoms/Image';
import deepmerge from 'deepmerge';
import { filters } from '@searchspring/snap-toolbox';

const CSS = {
	Swatches: ({ theme }: Partial<SwatchesProps>) =>
		css({
			marginTop: '10px',
			'.ss__swatches__carousel__swatch': {
				boxSizing: 'content-box',
				cursor: 'pointer',
				backgroundRepeat: 'no-repeat',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				border: `1px solid ${theme?.variables?.colors?.primary || '#333'}`,
				aspectRatio: '1/1',
				margin: 'auto',
				flexDirection: 'column',

				'&.ss__swatches__carousel__swatch--selected': {
					border: `2px solid ${theme?.variables?.colors?.primary || '#333'}`,
				},

				'&.ss__swatches__carousel__swatch--disabled:before, &.ss__swatches__carousel__swatch--unavailable:before': {
					content: '""',
					display: 'block',
					position: 'absolute',
					top: '50%',
					width: '90%',
					height: '1px',
					borderTop: '3px solid #eee',
					outline: '1px solid #ffff',
					transform: 'rotate(-45deg)',
				},

				'&.ss__swatches__carousel__swatch--disabled': {
					position: 'relative',
					cursor: 'none',
					pointerEvents: 'none',
					opacity: 0.5,
				},

				'&.ss__swatches__carousel__swatch--unavailable': {
					cursor: 'pointer',
					opacity: 0.5,
				},
			},
		}),
};

export function Swatches(properties: SwatchesProps): JSX.Element {
	const globalTheme: Theme = useTheme();
	const theme = { ...globalTheme, ...properties.theme };

	const defaultCarouselBreakpoints = {
		0: {
			carousel: {
				slidesPerView: 3,
				slidesPerGroup: 3,
				spaceBetween: 10,
			},
		},
		768: {
			carousel: {
				slidesPerView: 4,
				slidesPerGroup: 4,
				spaceBetween: 10,
			},
		},
		1200: {
			carousel: {
				slidesPerView: 5,
				slidesPerGroup: 5,
				spaceBetween: 10,
			},
		},
	};

	let props: SwatchesProps = {
		// default props
		type: 'carousel',
		hideLabels: true,
		// global theme
		...globalTheme?.components?.swatches,
		// props
		...properties,
		...properties.theme?.components?.swatches,
	};

	const breakpoints = props.breakpoints || (props.type == 'carousel' ? defaultCarouselBreakpoints : {});

	const displaySettings = useDisplaySettings(breakpoints);
	if (displaySettings && Object.keys(displaySettings).length) {
		const theme = deepmerge(props?.theme || {}, displaySettings?.theme || {}, { arrayMerge: (destinationArray, sourceArray) => sourceArray });
		props = {
			...props,
			...displaySettings,
			theme,
		};
	}

	const { onSelect, disabled, options, hideLabels, disableStyles, className, style, type, carousel, grid, treePath } = props;

	const subProps: SwatchesSubProps = {
		carousel: {
			// default props
			className: 'ss__swatches__carousel',
			loop: false,
			...carousel,
			// global theme
			...globalTheme?.components?.carousel,
			// inherited props
			...defined({
				breakpoints,
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
			treePath,
		},
		grid: {
			// default props
			className: 'ss__swatches__grid',
			hideLabels: hideLabels,
			overflowButtonInGrid: true,
			disableOverflowAction: true,
			rows: 1,
			columns: 6,
			...grid,
			// global theme
			...globalTheme?.components?.grid,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
			treePath,
		},
		image: {
			// default props
			className: 'ss__swatches__image',
			// global theme
			...globalTheme?.components?.image,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
			treePath,
		},
	};

	const selected = props.selected;

	const styling: RootNodeProperties = { 'ss-name': props.name };
	if (!disableStyles) {
		styling.css = [CSS.Swatches({ theme }), style];
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
				{type == 'carousel' ? (
					<Carousel {...subProps.carousel}>
						{options.map((option) => {
							const label = option.label;
							const selected = selection?.value == option.value;

							return (
								<div
									className={classnames(
										`ss__swatches__carousel__swatch ss__swatches__carousel__swatch--${filters.handleize(option.value?.toString())}`,
										{
											'ss__swatches__carousel__swatch--selected': selected,
											'ss__swatches__carousel__swatch--disabled': option?.disabled,
											'ss__swatches__carousel__swatch--unavailable': option?.available === false,
										}
									)}
									title={label}
									style={{ background: option.background ? option.background : option.backgroundImageUrl ? `` : option.value }}
									onClick={(e) => !disabled && !option?.disabled && makeSelection(e as any, option)}
									ref={(e) => useA11y(e)}
									role="option"
									aria-selected={selected}
								>
									{!option.background && option.backgroundImageUrl ? (
										<Image {...subProps.image} src={option.backgroundImageUrl} alt={option.label || option.value?.toString()} />
									) : (
										<Fragment />
									)}
									{!hideLabels && <span className="ss__swatches__carousel__swatch__value">{label || option.value}</span>}
								</div>
							);
						})}
					</Carousel>
				) : (
					<Grid
						{...subProps.grid}
						options={options}
						onSelect={(e, option) => {
							!disabled && makeSelection(e as any, option);
						}}
						selected={selected}
					/>
				)}
			</div>
		</CacheProvider>
	) : (
		<Fragment></Fragment>
	);
}

export type SwatchesProps = {
	options: SwatchOption[];
	onSelect?: (e: React.MouseEvent<HTMLElement>, option: SwatchOption) => void;
	selected?: SwatchOption;
	hideLabels?: boolean;
	breakpoints?: BreakpointsProps;
	disabled?: boolean;
	carousel?: Partial<CarouselProps>;
	grid?: Partial<GridProps>;
	type?: 'carousel' | 'grid';
} & // 			grid?: Partial<GridProps>; // 			type?: 'grid'; // 	| { // 	  } // 			carousel?: Partial<CarouselProps>; // 			type?: 'carousel'; // 	| { //  & (
// 	  }
// )
ComponentProps;

interface SwatchesSubProps {
	carousel: Partial<CarouselProps>;
	grid: Partial<GridProps>;
	image: Partial<ImageProps>;
}
