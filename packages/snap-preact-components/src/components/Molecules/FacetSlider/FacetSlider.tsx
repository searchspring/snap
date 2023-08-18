/** @jsx jsx */
import { Fragment, h } from 'preact';
import { useState } from 'preact/hooks';

import { observer } from 'mobx-react-lite';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { useRanger } from 'react-ranger';

import { Theme, useTheme, CacheProvider } from '../../../providers';
import { mergeProps } from '../../../utilities';
import { ComponentProps, StylingCSS } from '../../../types';
import { sprintf } from '../../../utilities';
import type { RangeFacet } from '@searchspring/snap-store-mobx';
import { useA11y } from '../../../hooks';

const CSS = {
	facetSlider: ({
		railColor,
		trackColor,
		handleColor,
		valueTextColor,
		handleDraggingColor,
		showTicks,
		stickyHandleLabel,
		tickTextColor,
		theme,
	}: Partial<FacetSliderProps>) =>
		css({
			display: 'flex',
			flexDirection: 'column',
			marginTop: '5px',
			marginBottom: showTicks && stickyHandleLabel ? '20px' : showTicks || stickyHandleLabel ? '10px' : '5px',

			'& .ss__facet-slider__slider': {
				position: 'relative',
				display: 'inline-block',
				height: '8px',
				width: 'calc(100% - 2rem)',
				margin: stickyHandleLabel ? '1rem' : '0 1rem',
				top: '10px',
			},

			'& .ss__facet-slider__tick': {
				'&:before': {
					content: "''",
					position: 'absolute',
					left: '0',
					background: 'rgba(0, 0, 0, 0.2)',
					height: '5px',
					width: '2px',
					transform: 'translate(-50%, 0.7rem)',
				},
				'& .ss__facet-slider__tick__label': {
					position: 'absolute',
					fontSize: '0.6rem',
					color: tickTextColor,
					top: '100%',
					transform: 'translate(-50%, 1.2rem)',
					whiteSpace: 'nowrap',
				},
			},
			'& .ss__facet-slider__rail': {
				background: railColor || theme?.colors?.primary || '#333',
				height: '100%',
			},
			'& .ss__facet-slider__segment': {
				background: trackColor || theme?.colors?.secondary || '#ccc',
				height: '100%',
			},
			'& .ss__facet-slider__handles': {
				textAlign: 'center',
				'& button': {
					'& .ss__facet-slider__handle': {
						background: handleColor || theme?.colors?.primary || '#333',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						width: '1.6rem',
						height: '1.6rem',
						borderRadius: '100%',
						fontSize: '0.7rem',
						whiteSpace: 'nowrap',
						color: valueTextColor || 'initial',
						fontWeight: 'normal',
						transform: 'translateY(0) scale(0.9)',
						transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
						position: 'relative',
						cursor: 'pointer',

						'&:after': {
							backgroundColor: '#ffffff',
							width: '30%',
							height: '30%',
							top: '0',
							bottom: '0',
							left: '0',
							content: '""',
							position: 'absolute',
							right: '0',
							borderRadius: '12px',
							margin: 'auto',
							cursor: 'pointer',
						},

						'&.ss__facet-slider__handle--active': {
							background: handleDraggingColor || handleColor || theme?.colors?.primary || '#000',
							'& label.ss__facet-slider__handle__label': {
								background: '#fff',
								padding: '0 5px',
							},
						},

						'& label.ss__facet-slider__handle__label': {
							display: 'inline-block',
							marginTop: showTicks && !stickyHandleLabel ? '35px' : '20px',

							'&.ss__facet-slider__handle__label--pinleft': {
								left: '0px',
							},
							'&.ss__facet-slider__handle__label--pinright': {
								right: '0px',
							},
							'&.ss__facet-slider__handle__label--sticky': {
								position: 'absolute',
								top: '-20px',
								fontFamily: 'Roboto, Helvetica, Arial',
								fontSize: '14px',
								marginTop: '0px',
							},
						},
					},
				},
			},

			'& .ss__facet-slider__labels': {
				textAlign: 'center',
				marginTop: showTicks && !stickyHandleLabel ? '40px' : '20px',
				color: valueTextColor,

				'& .ss__facet-slider__label--0': {
					'&:after': {
						content: '"-"',
						padding: '5px',
					},
				},
			},
		}),
};

export const FacetSlider = observer((properties: FacetSliderProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const theme = { ...globalTheme, ...properties.theme };
	const defaultProps: Partial<FacetSliderProps> = {
		tickSize: properties.facet?.step ? properties.facet?.step * 10 : 20,
	};

	const props = mergeProps('facetSlider', globalTheme, defaultProps, properties);

	const { showTicks, facet, stickyHandleLabel, onChange, onDrag, disableStyles, className, style, styleScript } = props;

	let { tickSize } = props;

	if (isNaN(Number(tickSize)) || Number(tickSize) <= 0) {
		// fallback to default (causes chrome to crash)
		tickSize = properties.facet?.step ? properties.facet?.step * 10 : 20;
	} else {
		tickSize = Number(tickSize);
	}

	const [values, setValues] = useState([facet.active?.low, facet.active?.high]);
	const [active, setActive] = useState([facet.active?.low, facet.active?.high]);

	if (((facet.active?.low || facet.active?.low === 0) && facet.active?.high && values[0] != facet.active?.low) || values[1] != facet.active?.high) {
		setActive([facet.active?.low, facet.active?.high]);
		setValues([facet.active?.low, facet.active?.high]);
	}

	const { getTrackProps, ticks, segments, handles } = useRanger({
		values: active as number[],
		onChange: (val: number[]) => {
			setActive(val);
			if (facet?.services?.urlManager) {
				if (val[0] == facet.range!.low && val[1] == facet.range!.high) {
					facet.services.urlManager.remove('page').remove(`filter.${facet.field}`).go();
				} else {
					facet.services.urlManager.remove('page').set(`filter.${facet.field}`, { low: val[0], high: val[1] }).go();
				}
			}
			onChange && onChange(val);
		},
		onDrag: (val: number[]) => {
			setActive(val);
			onDrag && onDrag(val);
		},
		min: facet.range?.low!,
		max: facet.range?.high!,
		stepSize: facet.step!,
		tickSize: tickSize,
	});

	const styling: { css?: StylingCSS } = {};
	const stylingProps = { ...props, theme };

	if (styleScript) {
		styling.css = [styleScript(stylingProps), style];
	} else if (!disableStyles) {
		styling.css = [CSS.facetSlider(stylingProps), style];
	} else if (style) {
		styling.css = [style];
	}
	return facet.range && facet.active && facet.step ? (
		<CacheProvider>
			<div className={classnames('ss__facet-slider', className)} {...getTrackProps()} {...styling}>
				<div className="ss__facet-slider__slider">
					{showTicks &&
						ticks.map(({ value, getTickProps }) => (
							<div className="ss__facet-slider__tick" {...getTickProps()}>
								<div className="ss__facet-slider__tick__label">{value}</div>
							</div>
						))}

					{segments.map(({ getSegmentProps }, idx: number) => (
						<div className={`${idx === 1 ? 'ss__facet-slider__rail' : 'ss__facet-slider__segment'}`} {...getSegmentProps()} />
					))}
					<div className={'ss__facet-slider__handles'}>
						{handles.map(({ value, active, getHandleProps }, idx: number) => (
							<button
								type="button"
								{...getHandleProps({
									style: {
										appearance: 'none',
										border: 'none',
										background: 'transparent',
										outline: 'none',
									},
								})}
								aria-label={`${facet.label} slider button`}
								aria-valuetext={`${facet.label} slider button, current value ${value}, ${facet.range?.low ? `min value ${facet.range?.low},` : ``} ${
									facet.range?.high ? `max value ${facet.range?.high}` : ``
								}`}
								ref={(e) => useA11y(e)}
							>
								<div className={classnames('ss__facet-slider__handle', { 'ss__facet-slider__handle--active': active })}>
									{stickyHandleLabel && (
										<label
											className={classnames(
												'ss__facet-slider__handle__label',
												'ss__facet-slider__handle__label--sticky',
												`ss__facet-slider__handle__label--${idx}`,
												{ 'ss__facet-slider__handle__label--pinleft': idx == 0 && value == facet?.range?.low },
												{ 'ss__facet-slider__handle__label--pinright': idx == 1 && value == facet?.range?.high }
											)}
										>
											{sprintf(facet.formatValue, value)}
										</label>
									)}
								</div>
							</button>
						))}
					</div>
				</div>
				{!stickyHandleLabel && (
					<div className={'ss__facet-slider__labels'}>
						{handles.map(({ value }, idx: number) => (
							<label className={classnames('ss__facet-slider__label', `ss__facet-slider__label--${idx}`)}>{sprintf(facet.formatValue, value)}</label>
						))}
					</div>
				)}
			</div>
		</CacheProvider>
	) : (
		<Fragment></Fragment>
	);
});

export interface FacetSliderProps extends ComponentProps {
	trackColor?: string;
	railColor?: string;
	handleColor?: string;
	handleDraggingColor?: string;
	valueTextColor?: string;
	showTicks?: boolean;
	tickSize?: number;
	tickTextColor?: string;
	stickyHandleLabel?: boolean;
	facet: RangeFacet;
	onChange?: (values: number[]) => void;
	onDrag?: (values: number[]) => void;
}
