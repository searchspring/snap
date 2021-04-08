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
	handle: ({ handleColor, handleTextColor }) =>
		css({
			background: handleColor,
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
	handleActive: ({ handleDraggingColor, handleColor, handleTextColor }) =>
		css({
			background: handleDraggingColor || handleColor,

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
			width: 'calc(100% - 25px)',
			margin: '20px 5% 20px',
			top: '10px',
			...style,
		}),
	tickLabel: ({ textColor }) =>
		css({
			position: 'absolute',
			fontSize: '0.6rem',
			color: textColor,
			top: '100%',
			transform: 'translate(-50%, 1.2rem)',
			whiteSpace: 'nowrap',
		}),
	segment: ({ trackColor }) =>
		css({
			background: trackColor,
			height: '100%',
		}),
	rail: ({ railColor }) =>
		css({
			background: railColor,
			height: '100%',
		}),
};

export const Slider = observer(
	(properties: SliderProps): JSX.Element => {
		const globalTheme: Theme = useTheme();

		const props: SliderProps = {
			// default props
			disableStyles: false,
			textColor: '#515151',
			showTicks: false,
			trackColor: '#F8F8F8',
			handleTextColor: '#515151',
			handleColor: '#4C37B3',
			railColor: '#4C37B3',
			tickSize: 20,

			// global theme
			...globalTheme?.components?.slider,
			// props
			...properties,
			...properties.theme?.components?.slider,
		};

		const {
			textColor,
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
								<div className={'ss-sliderTickLabel'} css={!disableStyles && CSS.tickLabel({ textColor })}>
									{value}
								</div>
							</div>
						))}

					{segments.map(({ getSegmentProps }, i) => (
						<Segment trackColor={trackColor} railColor={railColor} getSegmentProps={...getSegmentProps()} index={i} disableStyles={disableStyles} />
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
							/>
						</button>
					))}
				</div>
			)
		);
	}
);

export function Segment(props: { index: any; getSegmentProps: any; trackColor: any; railColor: any; disableStyles: boolean }): JSX.Element {
	const { index, getSegmentProps, trackColor, railColor, disableStyles } = props;

	return (
		<div
			css={!disableStyles && (index === 1 ? CSS.rail({ railColor }) : CSS.segment({ trackColor }))}
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
}): JSX.Element {
	const { active, value, formatValue, handleColor, handleTextColor, handleDraggingColor, disableStyles } = props;

	return (
		<div
			css={
				!disableStyles &&
				(active ? CSS.handleActive({ handleDraggingColor, handleColor, handleTextColor }) : CSS.handle({ handleColor, handleTextColor }))
			}
			className={'ss-sliderHandle'}
		>
			<label>{sprintf(formatValue, value)}</label>
		</div>
	);
}

export interface SliderProps extends ComponentProps {
	textColor?: string;
	trackColor?: string;
	handleTextColor?: string;
	railColor?: string;
	handleColor?: string;
	handleDraggingColor?: string;
	showTicks?: boolean;
	tickSize?: number;
	facet: RangeFacet;
	onChange?: (values: number[]) => void;
	onDrag?: (values: number[]) => void;
}
