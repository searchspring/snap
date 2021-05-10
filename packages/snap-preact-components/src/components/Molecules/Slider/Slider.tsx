/** @jsx jsx */
import { h } from 'preact';
import { useState } from 'preact/hooks';
import { observer } from 'mobx-react-lite';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { useRanger } from 'react-ranger';

import { Theme, useTheme } from '../../../providers/theme';
import { ComponentProps, RangeFacet } from '../../../types';
import { sprintf } from '../../../utilities';

const CSS = {
	handle: ({ handleColor, handleTextColor, theme }) =>
		css({
			background: handleColor || theme.colors?.primary,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			width: '1.6rem',
			height: '1.6rem',
			borderRadius: '100%',
			fontSize: '0.7rem',
			whiteSpace: 'nowrap',
			color: handleTextColor,
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

			'& label': {
				position: 'absolute',
				top: '-20px',
				fontFamily: 'Roboto, Helvetica, Arial',
				fontSize: '14px',
			},
		}),
	handleActive: ({ handleDraggingColor, handleColor, handleTextColor, theme }) =>
		css({
			background: handleDraggingColor || handleColor || theme.colors?.primary,

			///need to find a way to spread the above styles here rather than repeat them
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			width: '1.6rem',
			height: '1.6rem',
			borderRadius: '100%',
			fontSize: '0.7rem',
			whiteSpace: 'nowrap',
			color: handleTextColor,
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

			'& label': {
				position: 'absolute',
				top: '-20px',
				fontFamily: 'Roboto, Helvetica, Arial',
				fontSize: '14px',
			},
		}),
	tick: () =>
		css({
			'&:before': {
				content: "''",
				position: 'absolute',
				left: '0',
				background: 'rgba(0, 0, 0, 0.2)',
				height: '5px',
				width: '2px',
				transform: 'translate(-50%, 0.7rem)',
			},
		}),
	track: ({ style }) =>
		css({
			display: 'inline-block',
			height: '8px',
			width: 'calc(100% - 38px)',
			margin: '20px 5% 25px',
			top: '10px',
			...style,
		}),
	tickLabel: ({ tickTextColor }) =>
		css({
			position: 'absolute',
			fontSize: '0.6rem',
			color: tickTextColor,
			top: '100%',
			transform: 'translate(-50%, 1.2rem)',
			whiteSpace: 'nowrap',
		}),
	segment: ({ trackColor, theme }) =>
		css({
			background: trackColor || theme.colors?.secondary,
			height: '100%',
		}),
	rail: ({ railColor, theme }) =>
		css({
			background: railColor || theme.colors?.primary,
			height: '100%',
		}),
};

export const Slider = observer(
	(properties: SliderProps): JSX.Element => {
		const globalTheme: Theme = useTheme();
		const theme = { ...globalTheme, ...properties.theme };

		const props: SliderProps = {
			// default props
			disableStyles: false,
			showTicks: false,
			tickSize: properties.facet?.step * 10 || 20,

			// global theme
			...globalTheme?.components?.slider,
			// props
			...properties,
			...properties.theme?.components?.slider,
		};

		const {
			tickTextColor,
			trackColor,
			handleTextColor,
			railColor,
			handleColor,
			handleDraggingColor,
			showTicks,
			tickSize,
			facet,
			onChange,
			onDrag,
			disableStyles,
			className,
			style,
		} = props;

		const [values, setValues] = useState([facet.active.low, facet.active.high]);

		const [active, setActive] = useState([facet.active.low, facet.active.high]);
		if (values[0] != facet.active.low || values[1] != facet.active.high) {
			setActive([facet.active.low, facet.active.high]);
			setValues([facet.active.low, facet.active.high]);
		}

		const { getTrackProps, ticks, segments, handles } = useRanger({
			values: active,
			onChange: (val) => {
				setActive(val);
				if (facet?.controller) {
					facet.controller.urlManager.remove('page').set(`filter.${facet.field}`, { low: val[0], high: val[1] }).go();
				}
				onChange && onChange(val);
			},
			onDrag: (val) => {
				setActive(val);
				onDrag && onDrag(val);
			},
			min: facet.range.low,
			max: facet.range.high,
			stepSize: facet.step,
			tickSize: tickSize,
		});

		return (
			facet.range &&
			facet.active &&
			facet.step && (
				<div className={classnames('ss-slider', className)} {...getTrackProps()} css={!disableStyles && CSS.track({ style })}>
					{showTicks &&
						ticks.map(({ value, getTickProps }) => (
							<div className={'ss-sliderTick'} {...getTickProps()} css={!disableStyles && CSS.tick()}>
								<div className={'ss-sliderTickLabel'} css={!disableStyles && CSS.tickLabel({ tickTextColor })}>
									{value}
								</div>
							</div>
						))}

					{segments.map(({ getSegmentProps }, i) => (
						<Segment
							trackColor={trackColor}
							railColor={railColor}
							theme={theme}
							getSegmentProps={...getSegmentProps()}
							index={i}
							disableStyles={disableStyles}
						/>
					))}
					{handles.map(({ value, active, getHandleProps }) => (
						<button
							{...getHandleProps({
								style: {
									appearance: 'none',
									border: 'none',
									background: 'transparent',
									outline: 'none',
								},
							})}
						>
							<Handle
								active={active}
								value={value}
								formatValue={facet.formatValue}
								handleColor={handleColor}
								handleTextColor={handleTextColor}
								handleDraggingColor={handleDraggingColor}
								disableStyles={disableStyles}
								theme={theme}
							/>
						</button>
					))}
				</div>
			)
		);
	}
);

export function Segment(props: {
	index: any;
	getSegmentProps: any;
	trackColor: any;
	railColor: any;
	disableStyles: boolean;
	theme?: any;
}): JSX.Element {
	const { index, getSegmentProps, trackColor, railColor, theme, disableStyles } = props;

	return (
		<div
			css={!disableStyles && (index === 1 ? CSS.rail({ railColor, theme }) : CSS.segment({ trackColor, theme }))}
			className={`${index === 1 ? 'ss-sliderRail' : 'ss-sliderSegment'}`}
			{...getSegmentProps}
			index={index}
		/>
	);
}

export function Handle(props: {
	active: any;
	value: any;
	formatValue: string;
	handleColor: any;
	handleTextColor: any;
	handleDraggingColor: any;
	disableStyles: boolean;
	theme?: any;
}): JSX.Element {
	const { active, value, formatValue, handleColor, handleTextColor, handleDraggingColor, theme, disableStyles } = props;

	return (
		<div
			css={
				!disableStyles &&
				(active
					? CSS.handleActive({ handleDraggingColor, handleColor, handleTextColor, theme })
					: CSS.handle({ handleColor, handleTextColor, theme }))
			}
			className={'ss-sliderHandle'}
		>
			<label>{sprintf(formatValue, value)}</label>
		</div>
	);
}

export interface SliderProps extends ComponentProps {
	trackColor?: string;
	railColor?: string;
	handleColor?: string;
	handleDraggingColor?: string;
	handleTextColor?: string;
	showTicks?: boolean;
	tickSize?: number;
	tickTextColor?: string;
	facet: RangeFacet;
	onChange?: (values: number[]) => void;
	onDrag?: (values: number[]) => void;
}
