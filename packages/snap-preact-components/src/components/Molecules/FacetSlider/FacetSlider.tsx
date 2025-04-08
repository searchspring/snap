/** @jsx jsx */
import { h } from 'preact';
import { useState } from 'preact/hooks';

import { observer } from 'mobx-react';
import { jsx, css } from '@emotion/react';
import { Theme, useTheme } from '../../../providers';
import { ComponentProps, StylingCSS } from '../../../types';
import type { RangeFacet } from '@searchspring/snap-store-mobx';
import { useEffect } from 'react';

const RangeSlider = ({ min, max, value, step, onChange }: any) => {
	const [minValue, setMinValue] = useState(value ? value.min : min);
	const [maxValue, setMaxValue] = useState(value ? value.max : max);

	useEffect(() => {
		if (value) {
			setMinValue(value.min);
			setMaxValue(value.max);
		}
	}, [value]);

	const handleMinChange = (e: any) => {
		e.preventDefault();
		const newMinVal = Math.min(+e.target.value, maxValue - step);
		if (!value) setMinValue(newMinVal);
		onChange({ min: newMinVal, max: maxValue });
	};

	const handleMaxChange = (e: any) => {
		e.preventDefault();
		const newMaxVal = Math.max(+e.target.value, minValue + step);
		if (!value) setMaxValue(newMaxVal);
		onChange({ min: minValue, max: newMaxVal });
	};

	const minPos = ((minValue - min) / (max - min)) * 100;
	const maxPos = ((maxValue - min) / (max - min)) * 100;

	return (
		<div className="wrapper">
			<div className="input-wrapper">
				<input className="input" type="range" value={minValue} min={min} max={max} step={step} onChange={handleMinChange} />
				<input className="input" type="range" value={maxValue} min={min} max={max} step={step} onChange={handleMaxChange} />
			</div>

			<div className="control-wrapper">
				<div className="control" style={{ left: `${minPos}%` }} />
				<div className="rail">
					<div className="inner-rail" style={{ left: `${minPos}%`, right: `${100 - maxPos}%` }} />
				</div>
				<div className="control" style={{ left: `${maxPos}%` }} />
			</div>
		</div>
	);
};

const CSS = {
	facetSlider: ({}: // railColor,
	// trackColor,
	// handleColor,
	// valueTextColor,
	// handleDraggingColor,
	// showTicks,
	// stickyHandleLabel,
	// tickTextColor,
	// theme,
	Partial<FacetSliderProps>) =>
		css({
			'#root': {
				maxWidth: '500px',
				padding: '12px',
				margin: 'auto',
			},

			'.wrapper': {
				position: 'relative',
				display: 'flex',
				alignItems: 'center',
				margin: '40px calc(50px / 2)',
				paddingTop: '1.6rem',
				height: 'calc(50px + 1.6rem)',
			},

			'.input-wrapper': {
				width: 'calc(100% + 50px)',
				margin: '0 calc(50px / -2)',
				position: 'absolute',
				height: '50px',
			},

			'.control-wrapper': {
				width: '100%',
				position: 'absolute',
				height: '50px',
			},

			'.input': {
				position: 'absolute',
				width: '100%',
				pointerEvents: 'none',
				appearance: 'none',
				height: '100%',
				opacity: '0',
				zIndex: '3',
				padding: '0',

				'&::-ms-track': {
					// @include track-styles;
					appearance: 'none',
					background: 'transparent',
					border: 'transparent',
				},

				'&::-moz-range-track': {
					// @include track-styles;
					appearance: 'none',
					background: 'transparent',
					border: 'transparent',
				},

				'&:focus::-webkit-slider-runnable-track': {
					// @include track-styles;
					appearance: 'none',
					background: 'transparent',
					border: 'transparent',
				},

				'&::-ms-thumb': {
					// @include thumb-styles;
					appearance: 'none',
					pointerEvents: 'all',
					width: '50px',
					height: '50px',
					borderRadius: '0px',
					border: '0 none',
					cursor: 'grab',
					backgroundColor: 'red',

					'&:active': {
						cursor: 'grabbing',
					},
				},

				'&::-moz-range-thumb': {
					// @include thumb-styles;
					appearance: 'none',
					pointerEvents: 'all',
					width: '50px',
					height: '50px',
					borderRadius: '0px',
					border: '0 none',
					cursor: 'grab',
					backgroundColor: 'red',

					'&:active': {
						cursor: 'grabbing',
					},
				},

				'&::-webkit-slider-thumb': {
					// @include thumb-styles;
					appearance: 'none',
					pointerEvents: 'all',
					width: '50px',
					height: '50px',
					borderRadius: '0px',
					border: '0 none',
					cursor: 'grab',
					backgroundColor: 'red',

					'&:active': {
						cursor: 'grabbing',
					},
				},
			},

			'.rail': {
				position: 'absolute',
				width: '100%',
				top: '50%',
				transform: 'translateY(-50%)',
				height: '6px',
				borderRadius: '3px',
				background: 'lightgrey',
			},

			'.inner-rail': {
				position: 'absolute',
				height: '100%',
				background: 'hotpink',
				opacity: '0.5',
			},

			'.control': {
				width: '50px',
				height: '50px',
				borderRadius: '50%',
				position: 'absolute',
				background: 'hotpink',
				top: '50%',
				marginLeft: 'calc(50px / -2)',
				transform: 'translate3d(0, -50%, 0)',
				zIndex: '2',
			},
		}),
};

export const FacetSlider = observer((properties: FacetSliderProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const theme = { ...globalTheme, ...properties.theme };

	const props: FacetSliderProps = {
		// default props
		tickSize: properties.facet?.step ? properties.facet?.step * 10 : 20,
		// global theme
		...globalTheme?.components?.facetSlider,
		// props
		...properties,
		...properties.theme?.components?.facetSlider,
	};
	const {
		tickTextColor,
		trackColor,
		valueTextColor,
		railColor,
		handleColor,
		handleDraggingColor,
		showTicks,
		// facet,
		stickyHandleLabel,
		// onChange,
		// onDrag,
		disableStyles,
		// className,
		style,
	} = props;

	const [value, setValue] = useState({ min: 0, max: 100 });

	const styling: { css?: StylingCSS } = {};
	if (!disableStyles) {
		styling.css = [
			CSS.facetSlider({
				railColor,
				trackColor,
				handleColor,
				valueTextColor,
				handleDraggingColor,
				showTicks,
				stickyHandleLabel,
				tickTextColor,
				theme,
			}),
			style,
		];
	} else if (style) {
		styling.css = [style];
	}

	return (
		<div {...styling}>
			<RangeSlider min={0} max={100} step={5} value={value} onChange={setValue} />
		</div>
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
