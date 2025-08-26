import { Fragment, h } from 'preact';

import { useState } from 'preact/hooks';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';

import { Theme, useTheme, CacheProvider, useTreePath } from '../../../providers';
import { ComponentProps, SwatchOption, BreakpointsProps, StyleScript } from '../../../types';
import { useA11y, useDisplaySettings } from '../../../hooks';
import { Carousel, CarouselProps } from '../Carousel';
import { defined, mergeProps, mergeStyles } from '../../../utilities';
import { Grid, GridProps } from '../Grid';
import { ImageProps, Image } from '../../Atoms/Image';
import deepmerge from 'deepmerge';
import { filters } from '@searchspring/snap-toolbox';
import Color from 'color';

const defaultStyles: StyleScript<SwatchesProps> = ({ theme }) => {
	return css({
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

			'.ss__swatches__carousel__swatch__inner': {
				aspectRatio: '1/1',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				margin: 'auto',
				height: '100%',
			},

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

			'&.ss__swatches__carousel__swatch--dark-mode': {
				color: '#fff',
			},
		},
	});
};

export function Swatches(properties: SwatchesProps): JSX.Element {
	const globalTheme: Theme = useTheme();
	const globalTreePath = useTreePath();

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

	const defaultProps: Partial<SwatchesProps> = {
		// default props
		type: 'carousel',
		hideLabels: true,
		treePath: globalTreePath,
	};

	let props = mergeProps('swatches', globalTheme, defaultProps, properties);

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

	const { onSelect, disabled, options, hideLabels, disableStyles, className, type, carousel, grid, treePath } = props;

	const subProps: SwatchesSubProps = {
		carousel: {
			// default props
			className: 'ss__swatches__carousel',
			loop: false,
			...carousel,
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

	const styling = mergeStyles<SwatchesProps>(props, defaultStyles);

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
							let isDark = false;
							try {
								const color = new Color(
									option.background ? option.background.toLowerCase() : option.backgroundImageUrl ? `` : option.value.toString().toLowerCase()
								);
								isDark = color.isDark();
							} catch (err) {}

							return (
								<div
									className={classnames(`ss__swatches__carousel__swatch`, {
										'ss__swatches__carousel__swatch--selected': selected,
										'ss__swatches__carousel__swatch--disabled': option?.disabled,
										'ss__swatches__carousel__swatch--unavailable': option?.available === false,
										'ss__swatches__carousel__swatch--dark-mode': isDark,
									})}
									title={label}
									onClick={(e) => !disabled && !option?.disabled && makeSelection(e as any, option)}
									ref={(e) => useA11y(e)}
									aria-disabled={option.disabled || option?.available === false}
									role="option"
									aria-selected={selected}
								>
									<div
										className={classnames(
											`ss__swatches__carousel__swatch__inner`,
											`ss__swatches__carousel__swatch__inner--${filters.handleize(option.value?.toString())}`
										)}
										style={{ background: option.background ? option.background : option.backgroundImageUrl ? `` : option.value }}
									>
										{!option.background && option.backgroundImageUrl ? (
											<Image {...subProps.image} src={option.backgroundImageUrl} alt={option.label || option.value?.toString()} />
										) : (
											<Fragment />
										)}
										{!hideLabels && <span className="ss__swatches__carousel__swatch__value">{label || option.value}</span>}
									</div>
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
} & ComponentProps;

interface SwatchesSubProps {
	carousel: Partial<CarouselProps>;
	grid: Partial<GridProps>;
	image: Partial<ImageProps>;
}
