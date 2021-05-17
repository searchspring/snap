/** @jsx jsx */
import { h, Fragment, cloneElement } from 'preact';
import { useState } from 'preact/hooks';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';

import { defined } from '../../../utilities';
import { Theme, useTheme } from '../../../providers/theme';
import { ComponentProps } from '../../../types';
import { useMediaQuery } from '../../../hooks';
import { Overlay, OverlayProps } from '../../Atoms/Overlay';

const CSS = {
	slideout: ({ isActive, width, transitionSpeed, style }) =>
		css({
			display: 'block',
			position: 'fixed',
			transition: `left ${transitionSpeed}`,
			left: isActive ? '0' : `-${width}`,
			top: '0',
			height: '100%',
			zIndex: '10004',
			width: '90%',
			maxWidth: width,
			padding: '10px',
			background: '#fff',
			boxSizing: 'border-box',
			overflowY: 'auto',
			...style,
		}),
};

export function Slideout(properties: SlideoutProps): JSX.Element {
	const globalTheme: Theme = useTheme();

	const props: SlideoutProps = {
		// default props
		active: false,
		displayAt: '',
		width: '300px',
		buttonContent: 'click me',
		overlayColor: 'rgba(0,0,0,0.8)',
		transitionSpeed: '0.25s',
		// global theme
		...globalTheme?.components?.slideout,
		// props
		...properties,
		...properties.theme?.components?.slideout,
	};

	const { children, active, buttonContent, width, displayAt, transitionSpeed, overlayColor, disableStyles, className, style } = props;

	const subProps: SlideoutSubProps = {
		overlay: {
			// default props
			className: 'ss__slideout__overlay',
			// global theme
			...globalTheme?.components?.overlay,
			// inherited props
			...defined({
				disableStyles,
				color: overlayColor,
				transitionSpeed,
			}),
			// component theme overrides
			...props.theme?.components?.overlay,
		},
	};

	// state
	const [isActive, setActive] = useState(active);
	const toggleActive = () => {
		setActive(!isActive);
		document.body.style.overflow = isActive ? 'hidden' : '';
	};
	const isVisible = useMediaQuery(displayAt, () => {
		document.body.style.overflow = '';
	});
	document.body.style.overflow = isVisible && isActive ? 'hidden' : '';

	return (
		isVisible && (
			<>
				{buttonContent && (
					<div className="ss__slideout__button" onClick={() => toggleActive()}>
						{buttonContent}
					</div>
				)}

				<div className={classnames('ss__slideout', className)} css={!disableStyles && CSS.slideout({ isActive, width, transitionSpeed, style })}>
					{children && cloneElement(children, { toggleActive, active: isActive })}
				</div>
				<Overlay {...subProps.overlay} active={isActive} onClick={toggleActive} />
			</>
		)
	);
}

export interface SlideoutProps extends ComponentProps {
	children?: JSX.Element;
	active: boolean;
	buttonContent?: string | JSX.Element;
	width?: string;
	displayAt?: string;
	transitionSpeed?: string;
	overlayColor?: string;
}

interface SlideoutSubProps {
	overlay?: OverlayProps;
}
