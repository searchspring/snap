import { h, Fragment, ComponentChildren } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { observer } from 'mobx-react-lite';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';

import { defined, cloneWithProps, mergeProps, mergeStyles } from '../../../utilities';
import { Theme, useTheme, CacheProvider, useTreePath } from '../../../providers';
import { ComponentProps, StyleScript } from '../../../types';
import { useMediaQuery } from '../../../hooks';
import { Overlay, OverlayProps } from '../../Atoms/Overlay';

const defaultStyles: StyleScript<SlideoutProps> = ({ slideDirection, transitionSpeed, width }) => {
	return css({
		display: 'block',
		position: 'fixed',
		transition: `${slideDirection ? slideDirection : 'left'} ${transitionSpeed}`,
		left: slideDirection == 'left' ? `-${width}` : slideDirection != 'right' ? '0' : 'initial',
		right: slideDirection == 'right' ? `-${width}` : 'initial',
		bottom: slideDirection == 'bottom' ? `-100vh` : 'initial',
		top: slideDirection == 'top' ? `-100vh` : slideDirection == 'bottom' ? 'initial' : '0',
		height: '100%',
		zIndex: '10004',
		width: width?.endsWith('%') && parseInt(width.split('%')[0]) > 90 ? width : '90%',
		maxWidth: width,
		padding: '10px',
		background: '#fff',
		boxSizing: 'border-box',
		overflowY: 'auto',

		'&.ss__slideout--active': {
			left: slideDirection == 'left' ? '0' : slideDirection != 'right' ? '0' : 'initial',
			right: slideDirection == 'right' ? '0' : 'initial',
			bottom: slideDirection == 'bottom' ? '0' : 'initial',
			top: slideDirection == 'top' ? '0' : slideDirection == 'bottom' ? 'initial' : '0',
		},
	});
};

export const Slideout = observer((properties: SlideoutProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const globalTreePath = useTreePath();

	const defaultProps: Partial<SlideoutProps> = {
		active: false,
		displayAt: '',
		slideDirection: 'left',
		width: '300px',
		overlayColor: 'rgba(0,0,0,0.8)',
		transitionSpeed: '0.25s',
		treePath: globalTreePath,
		rerender: true,
	};

	const props = mergeProps('slideout', globalTheme, defaultProps, properties);

	const {
		children,
		active,
		rerender,
		buttonContent,
		buttonSelector,
		noButtonWrapper,
		displayAt,
		transitionSpeed,
		overlayColor,
		disableStyles,
		className,
		treePath,
	} = props;

	const subProps: SlideoutSubProps = {
		overlay: {
			// default props
			className: 'ss__slideout__overlay',
			// inherited props
			...defined({
				disableStyles,
				color: overlayColor,
				transitionSpeed,
			}),
			// component theme overrides
			theme: props?.theme,
			treePath,
		},
	};

	// state
	const [isActive, setActive] = useState(Boolean(active));
	const [renderContent, setRenderContent] = useState(Boolean(active));

	const toggleActive = () => {
		if (isActive) {
			setActive(false);
			if (rerender) {
				setTimeout(() => {
					setRenderContent(false);
				}, 250);
			}
		} else {
			setActive(true);
			setRenderContent(true);
		}

		document.body.style.overflow = isActive ? 'hidden' : '';
	};

	//this is used to update active state if active prop is changed from parent component.
	useEffect(() => {
		setRenderContent(Boolean(active));
		if (isActive !== active) {
			setActive(Boolean(active));
		}
	}, [active]);

	const isVisible = useMediaQuery(displayAt!, () => {
		document.body.style.overflow = '';
	});

	document.body.style.overflow = isVisible && isActive ? 'hidden' : '';

	const styling = mergeStyles<SlideoutProps>(props, defaultStyles);

	useEffect(() => {
		if (buttonSelector) {
			let button;
			if (typeof buttonSelector == 'string') {
				button = document.querySelector(buttonSelector);
			} else {
				button = buttonSelector;
			}
			if (button) {
				button.addEventListener('click', () => toggleActive());
			}
		}
	}, []);

	return isVisible || !rerender ? (
		<CacheProvider>
			{buttonContent &&
				(noButtonWrapper ? (
					cloneWithProps(buttonContent, { toggleActive, active: isActive, treePath })
				) : (
					<div className="ss__slideout__button" onClick={() => toggleActive()}>
						{cloneWithProps(buttonContent, { active: isActive, treePath })}
					</div>
				))}

			<div
				className={classnames('ss__slideout', className, { 'ss__slideout--active': isActive })}
				style={{ visibility: !rerender ? (isVisible ? 'visible' : 'hidden') : 'visible' }}
				{...styling}
			>
				{renderContent && cloneWithProps(children, { toggleActive, active: isActive, treePath })}
			</div>
			<Overlay {...subProps.overlay} active={isActive} onClick={toggleActive} />
		</CacheProvider>
	) : (
		<Fragment></Fragment>
	);
});

export interface SlideoutProps extends ComponentProps {
	buttonContent?: string | JSX.Element;
	children?: ComponentChildren;
	active?: boolean;
	noButtonWrapper?: boolean;
	width?: string;
	displayAt?: string;
	transitionSpeed?: string;
	overlayColor?: string;
	slideDirection?: SlideDirectionType;
	rerender?: boolean;
	buttonSelector?: string | Element;
}

export type SlideDirectionType = 'top' | 'right' | 'bottom' | 'left';
interface SlideoutSubProps {
	overlay: Partial<OverlayProps>;
}
