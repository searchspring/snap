/** @jsx jsx */
import { Fragment, h } from 'preact';
import { useState, useRef, useEffect, useCallback } from 'preact/hooks';

import { observer } from 'mobx-react-lite';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { useRanger } from 'react-ranger';

import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, StylingCSS } from '../../../types';
import { sprintf } from '../../../utilities';
import type { RangeFacet } from '@searchspring/snap-store-mobx';

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
						transform: 'translateY(0)',
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
					},
				},
			},

			'& .ss__facet-slider__handle__label': {
				display: 'inline-block',
				fontFamily: 'Roboto, Helvetica, Arial',
				fontSize: '14px',
				fontWeight: 400,
				color: 'black',
				marginTop: showTicks && !stickyHandleLabel ? '35px' : '20px',

				'&.ss__facet-slider__handle__label--pinleft': {
					left: '0px',
				},
				'&.ss__facet-slider__handle__label--pinright': {
					right: '0px',
				},
				'&.ss__facet-slider__handle__label--sticky': {
					position: 'absolute',
					top: '-17px',
					marginTop: '0px',
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

	const props: FacetSliderProps = {
		// default props
		tickSize: properties?.facet?.step ? properties.facet.step * 10 : 20,
		stickyHandleLabel: true,
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
		facet,
		stickyHandleLabel,
		onChange,
		onDrag,
		disableStyles,
		className,
		style,
	} = props;

	let { tickSize } = props;

	if (isNaN(Number(tickSize)) || Number(tickSize) <= 0) {
		// fallback to default (causes chrome to crash)
		tickSize = properties.facet?.step ? properties.facet?.step * 10 : 20;
	} else {
		tickSize = Number(tickSize);
	}

	const ref = useRef<HTMLLabelElement[]>([]);
	const overlapRef = useRef<HTMLLabelElement>(null);
	const facetRef = useRef<HTMLDivElement>(null);
	// const facetEl = facetRef?.current?.getBoundingClientRect();
	// const overlapEl = overlapRef?.current?.getBoundingClientRect();

	const [labelDOMRect, setLabelDOMRect] = useState({
		min: new DOMRect(),
		max: new DOMRect(),
	});
	const [isOverlapped, setOverlapped] = useState(false);
	const [isPinned, setPinned] = useState('');

	const [overlapPosition, setOverlapPosition] = useState({
		left: '',
		right: '',
	});

	const debounce = (func: () => void, timeout = 200) => {
		let timer;

		return ((...args) => {
			clearTimeout(timer);
			timer = setTimeout(() => {
				func.apply(this, args);
			}, timeout);
		})();
	};

	const calculate = (handles: { value: number }[]) => {
		const labels = ref.current;

		if (labels?.length > 1) {
			// labels[0] and labels[1] can flip
			// TOOD: need to add logic to determine which one is left and right based on left and right

			const label0 = labels[0].getBoundingClientRect();
			const label1 = labels[1].getBoundingClientRect();

			let minDomRect = label0;
			let maxDomRect = label1;
			if (label0.left > label1.left) {
				minDomRect = label1;
				maxDomRect = label0;
				console.log('handles swapped...');
			}
			const facetEl = facetRef?.current?.getBoundingClientRect();
			const overlapEl = overlapRef?.current?.getBoundingClientRect();

			let overlap = false;
			const overlapMin = minDomRect.right > maxDomRect.left;
			const overlapMax = maxDomRect.left < minDomRect.right;
			if (overlapMin || overlapMax) {
				overlap = true;
			}

			console.log(minDomRect);
			console.log(maxDomRect);
			setOverlapped(overlap);
			console.log('recalculated overlap', overlap);

			if (facet?.range?.high && handles?.length > 1 && overlapEl && facetEl) {
				console.log('overlapEl', overlapEl);
				console.log('facetEl', facetEl);
				const isOutOfBoundsRight = overlapEl.right > facetEl.right;
				const isOutOfBoundsLeft = overlapEl.left < facetEl.left;

				const handleLeft = handles[0];
				const handleLeftX = ((facet.range.high - (facet.range.high - handleLeft.value)) / facet.range.high) * 100;

				const handleRight = handles[1];
				const handleRightX = ((facet.range.high - (facet.range.high - handleRight.value)) / facet.range.high) * 100;

				const center = ((handleRightX - (handleRightX - handleLeftX) / 2) / 100) * 100;

				// let isOutOfBoundsRight = overlapEl.right - 2 >= facetEl.right;
				// let isOutOfBoundsLeft = overlapEl.left + 2 <= facetEl.left;

				console.log('overlapEl.right', overlapEl.right);

				// console.log('facetEl.right', facetEl.right);
				console.log('isOutOfBoundsRight', isOutOfBoundsRight);
				console.log('isOverlapped', isOverlapped);

				if (overlap) {
					if (isOutOfBoundsRight) {
						// setOverlapPosition({
						// 	left: '',
						// 	right: '0px',
						// });

						setPinned('right');

						// set opacaity to 0 on min-max label
						// show new min-max label (width: 100%, text-justify left/right)
					} else if (isOutOfBoundsLeft) {
						setPinned('left');

						// setOverlapPosition({
						// 	left: '0px',
						// 	right: '',
						// });
					} else {
						setPinned('');
					}
					setOverlapPosition({
						// ...overlapPosition,
						right: '',
						left: `calc(${center}% - (${overlapEl.width}px / 2))`,
					});
				}
			}
		}

		// console.log("overlapEl.left", overlapEl.left);
		// console.log("overlapEl.right", overlapEl.right);
		// console.log("facetEl.left", facetEl.left);
		// console.log("facetEl.right", facetEl.right);

		// console.log("isOutOfBoundsRight", isOutOfBoundsRight);
		// console.log("isOutOfBoundsLeft", isOutOfBoundsLeft);

		// console.log("overlapPosition", overlapPosition)
	};

	const [values, setValues] = useState([facet.active?.low, facet.active?.high]);
	const [active, setActive] = useState([facet.active?.low, facet.active?.high]);

	if ((facet.active?.low && facet.active?.high && values[0] != facet.active?.low) || values[1] != facet.active?.high) {
		setActive([facet.active?.low, facet.active?.high]);
		setValues([facet.active?.low, facet.active?.high]);
	}

	const {
		getTrackProps,
		ticks,
		segments,
		handles: unsortedHandles,
	} = useRanger({
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
			// stickyHandleLabel && onIntersection(ref.current);
			stickyHandleLabel && calculate(handles);
			// debounce(() => calculate(isOverlapped, handles));
		},
		min: facet.range?.low!,
		max: facet.range?.high!,
		stepSize: facet.step!,
		tickSize: tickSize,
	});

	const handles = unsortedHandles.sort((handleA, handleB) => {
		return handleA.value - handleB.value;
	});

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

	// do initial calculation
	// calculate(isOverlapped, handles);
	console.log('render isOverlapped', isOverlapped);
	console.log('render operlapPos', overlapPosition);

	return facet.range && facet.active && facet.step ? (
		<CacheProvider>
			<div className={classnames('ss__facet-slider', className)} {...getTrackProps()} {...styling}>
				<div ref={facetRef} style={{ border: '1px solid' }}>
					<div className="ss__facet-slider__slider">
						{showTicks &&
							ticks.map(({ value, getTickProps }) => (
								<div className="ss__facet-slider__tick" {...getTickProps()}>
									<div className="ss__facet-slider__tick__label">{value}</div>
								</div>
							))}

						{segments.map(({ getSegmentProps }, index: number) => (
							<div className={`${index === 1 ? 'ss__facet-slider__rail' : 'ss__facet-slider__segment'}`} {...getSegmentProps()} key={index} />
						))}

						{isOverlapped && (
							<label
								className={classnames('ss__facet-slider__overlap', 'ss__facet-slider__handle__label', 'ss__facet-slider__handle__label--sticky')}
								ref={overlapRef}
								style={{
									position: 'absolute',
									top: '-29px',
									width: '100px',
									...overlapPosition,
									opacity: isPinned ? '0' : '1',
								}}
							>
								{handles.map(({ value, active, getHandleProps }, idx) => sprintf(facet.formatValue, value)).join(`${facet.formatSeparator}`)}
							</label>
						)}

						{isOverlapped && isPinned && (
							<label
								className={classnames('ss__facet-slider__overlap', 'ss__facet-slider__handle__label', 'ss__facet-slider__handle__label--sticky')}
								style={{
									display: 'block',
									width: 'calc(100% + 2rem)',
									left: '-1rem',
									position: 'absolute',
									top: '-29px',
									// @ts-ignore
									textAlign: `${['left', 'right'].includes(isPinned) ? isPinned : ''}`,
								}}
							>
								{handles.map(({ value, active, getHandleProps }, idx) => sprintf(facet.formatValue, value)).join(`${facet.formatSeparator}`)}
							</label>
						)}

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
												ref={(el) => {
													if (el) return (ref.current[idx] = el);
												}}
												style={{
													opacity: isOverlapped ? '0' : '1',
												}}
											>
												{sprintf(facet.formatValue, value)}
											</label>
										)}
									</div>
								</button>
							))}
						</div>
					</div>
				</div>
			</div>
			{!stickyHandleLabel && (
				<div className={'ss__facet-slider__labels'}>
					{handles.map(({ value }, idx: number) => (
						<label className={classnames('ss__facet-slider__label', `ss__facet-slider__label--${idx}`)}>{sprintf(facet.formatValue, value)}</label>
					))}
				</div>
			)}
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
