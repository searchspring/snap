import { h, Fragment, ComponentChildren } from 'preact';
import { useState } from 'preact/hooks';
import { observer } from 'mobx-react-lite';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';

import { defined, cloneWithProps, mergeProps } from '../../../utilities';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, RootNodeProperties } from '../../../types';
import { useMediaQuery } from '../../../hooks';
import { Overlay, OverlayProps } from '../../Atoms/Overlay';

const CSS = {
	slideout: ({ isActive, width, transitionSpeed, slideDirection }: Partial<SlideoutProps> & { isActive: boolean }) =>
		css({
			display: 'block',
			position: 'fixed',
			transition: `${slideDirection ? slideDirection : 'left'} ${transitionSpeed}`,
			left: slideDirection == 'left' ? (isActive ? '0' : `-${width}`) : slideDirection != 'right' ? '0' : 'initial',
			right: slideDirection == 'right' ? (isActive ? '0' : `-${width}`) : 'initial',
			bottom: slideDirection == 'bottom' ? (isActive ? '0' : `-100vh`) : 'initial',
			top: slideDirection == 'top' ? (isActive ? '0' : `-100vh`) : slideDirection == 'bottom' ? 'initial' : '0',
			height: '100%',
			zIndex: '10004',
			width: width?.endsWith('%') && parseInt(width.split('%')[0]) > 90 ? width : '90%',
			maxWidth: width,
			padding: '10px',
			background: '#fff',
			boxSizing: 'border-box',
			overflowY: 'auto',
		}),
};

export const Slideout = observer((properties: SlideoutProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const defaultProps: Partial<SlideoutProps> = {
		active: false,
		displayAt: '',
		slideDirection: 'left',
		width: '300px',
		buttonContent: 'click me',
		overlayColor: 'rgba(0,0,0,0.8)',
		transitionSpeed: '0.25s',
	};

	const props = mergeProps('slideout', globalTheme, defaultProps, properties);

	const {
		children,
		active,
		buttonContent,
		noButtonWrapper,
		displayAt,
		transitionSpeed,
		overlayColor,
		disableStyles,
		className,
		style,
		styleScript,
		treePath,
	} = props;

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
			theme: props?.theme,
			treePath,
		},
	};

	// state
	const [isActive, setActive] = useState(Boolean(active));
	const [renderContent, setRenderContent] = useState(Boolean(active));
	const toggleActive = () => {
		if (isActive) {
			setTimeout(() => {
				setRenderContent(!renderContent);
			}, 250);
		} else {
			setRenderContent(!isActive);
		}

		setActive(!isActive);

		document.body.style.overflow = isActive ? 'hidden' : '';
	};

	const isVisible = useMediaQuery(displayAt!, () => {
		document.body.style.overflow = '';
	});

	document.body.style.overflow = isVisible && isActive ? 'hidden' : '';

	const styling: RootNodeProperties = { 'ss-name': props.name };
	const stylingProps = { ...props, isActive };

	if (styleScript && !disableStyles) {
		styling.css = [styleScript(stylingProps), style];
	} else if (!disableStyles) {
		styling.css = [CSS.slideout(stylingProps), style];
	} else if (style) {
		styling.css = [style];
	}

	return isVisible ? (
		<CacheProvider>
			{buttonContent &&
				(noButtonWrapper ? (
					cloneWithProps(buttonContent, { toggleActive, active: isActive, treePath })
				) : (
					<div className="ss__slideout__button" onClick={() => toggleActive()}>
						{cloneWithProps(buttonContent, { active: isActive, treePath })}
					</div>
				))}

			<div className={classnames('ss__slideout', className, { 'ss__slideout--active': isActive })} {...styling}>
				{renderContent && cloneWithProps(children, { toggleActive, active: isActive, treePath })}
			</div>
			<Overlay {...subProps.overlay} active={isActive} onClick={toggleActive} />
		</CacheProvider>
	) : (
		<Fragment></Fragment>
	);
});

export interface SlideoutProps extends ComponentProps {
	children?: ComponentChildren;
	active?: boolean;
	buttonContent?: string | JSX.Element;
	noButtonWrapper?: boolean;
	width?: string;
	displayAt?: string;
	transitionSpeed?: string;
	overlayColor?: string;
	slideDirection?: SlideDirectionType;
}

export type SlideDirectionType = 'top' | 'right' | 'bottom' | 'left';
interface SlideoutSubProps {
	overlay: Partial<OverlayProps>;
}
