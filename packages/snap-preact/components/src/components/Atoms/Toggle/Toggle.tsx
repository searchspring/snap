import { h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';
import { mergeProps } from '../../../utilities';
import { ComponentProps, RootNodeProperties } from '../../../types';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { useState } from 'react';
import { useA11y } from '../../../hooks';

const CSS = {
	toggle: ({ activeColor, inactiveColor: deActiveColor, buttonColor, size }: Partial<ToggleProps>) =>
		css({
			display: 'flex',
			alignItems: 'center',

			'&.ss__toggle--disabled': {
				opacity: '.5',
				cursor: 'none',
				pointerEvents: 'none',
			},

			/* The switch - the box around the slider */
			'& .ss__toggle__switch': {
				position: 'relative',
				display: 'inline-block',
				width: size,
				height: `calc(${size} / 2 + 4px)`,
				margin: '10px',
			},

			/* Hide default HTML checkbox */
			'& .ss__toggle__switch input': {
				opacity: '0',
				width: '0',
				height: '0',
			},

			/* The slider */
			'& .ss__toggle__slider-box': {
				position: 'absolute',
				cursor: 'pointer',
				top: '0',
				left: '0',
				right: '0',
				bottom: '0',
				backgroundColor: `${deActiveColor}`,
				transition: '.4s',
			},

			'.ss__toggle__slider': {
				position: 'absolute',
				content: "''",
				height: `calc(${size} / 2 - 4px)`,
				width: `calc(${size} / 2 - 4px)`,
				left: '4px',
				bottom: '4px',
				backgroundColor: `${buttonColor}`,
				transition: '.4s',
				zIndex: 1,
			},

			'& .ss__toggle__switch--filtered .ss__toggle__slider-box': {
				backgroundColor: `${activeColor}`,
			},

			'& .ss__toggle__switch--filtered .ss__toggle__slider-box .ss__toggle__slider': {
				transform: `translateX(calc(${size} / 2 - 4px))`,
			},

			/* Rounded sliders */
			'& .ss__toggle__slider-box.ss__toggle__slider-box--round': {
				borderRadius: `calc(${size} * 2)`,
			},

			'& .ss__toggle__slider.ss__toggle__slider--round': {
				borderRadius: `calc(${size} / 2)`,
			},
		}),
};

export const Toggle = observer((properties: ToggleProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const defaultProps: Partial<ToggleProps> = {
		round: true,
		size: '60px',
		activeColor: '#2196F3',
		inactiveColor: '#ccc',
		buttonColor: 'white',
	};

	const props = mergeProps('toggle', globalTheme, defaultProps, properties);

	const { toggled, round, onClick, label, disabled, disableStyles, className, style, styleScript } = props;

	const styling: RootNodeProperties = { 'ss-name': props.name };
	const stylingProps = props;

	if (styleScript && !disableStyles) {
		styling.css = [styleScript(stylingProps), style];
	} else if (!disableStyles) {
		styling.css = [CSS.toggle(stylingProps), style];
	} else if (style) {
		styling.css = [style];
	}
	const [toggledState, setToggleState] = useState(toggled || false);

	const clickFunc = (e: React.MouseEvent<Element, MouseEvent>) => {
		onClick && onClick(e, !toggledState);
		setToggleState(!toggledState);
	};

	return (
		<CacheProvider>
			<div {...styling} className={classnames('ss__toggle', disabled ? 'ss__toggle--disabled' : '', className)}>
				{label && <label className="ss__toggle__label">{label}</label>}

				<div
					className={`ss__toggle__switch ${!disabled && toggledState ? 'ss__toggle__switch--filtered' : ''}`}
					onClick={(e) => {
						clickFunc(e);
					}}
					ref={(e) => useA11y(e)}
					aria-label={`currently ${toggledState ? 'selected' : 'not selected'} toggle switch ${label ? `for ${label}` : ''} `}
					aria-checked={toggledState}
				>
					<div className={`ss__toggle__slider-box ${round ? 'ss__toggle__slider-box--round' : ''}`}>
						<div className={`ss__toggle__slider ${round ? 'ss__toggle__slider--round' : ''}`}></div>
					</div>
				</div>
			</div>
		</CacheProvider>
	);
});

export interface ToggleProps extends ComponentProps {
	toggled?: boolean;
	label?: string;
	round?: boolean;
	onClick?: (e: React.MouseEvent, toggled: boolean) => void;
	activeColor?: string;
	inactiveColor?: string;
	buttonColor?: string;
	size?: string;
	disabled?: boolean;
}
