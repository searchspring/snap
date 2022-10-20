/** @jsx jsx */
import { h, Fragment, ComponentChildren } from 'preact';
import { useState } from 'preact/hooks';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';

import { defined, cloneWithProps } from '../../../utilities';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, StylingCSS } from '../../../types';
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
			width: '90%',
			maxWidth: width,
			padding: '10px',
			background: '#fff',
			boxSizing: 'border-box',
			overflowY: 'auto',
		}),
};

export function Slideout(properties: SlideoutProps): JSX.Element {
	const globalTheme: Theme = useTheme();

	const props: SlideoutProps = {
		// default props
		active: false,
		displayAt: '',
		slideDirection: 'left',
		width: '300px',
		buttonContent: <div className="ss__slideout__button">click me</div>,
		overlayColor: 'rgba(0,0,0,0.8)',
		transitionSpeed: '0.25s',
		// global theme
		...globalTheme?.components?.slideout,
		// props
		...properties,
		...properties.theme?.components?.slideout,
	};

	const { children, active, width, displayAt, transitionSpeed, overlayColor, slideDirection, disableStyles, className, style } = props;
	let buttonContent = props.buttonContent;

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
		},
	};

	// state
	const [isActive, setActive] = useState(Boolean(active));
	const toggleActive = () => {
		setActive(!isActive);
		document.body.style.overflow = isActive ? 'hidden' : '';
	};

	let isVisible = useMediaQuery(displayAt!, () => {
		document.body.style.overflow = '';
	});

	document.body.style.overflow = isVisible && isActive ? 'hidden' : '';

	const styling: { css?: StylingCSS } = {};
	if (!disableStyles) {
		styling.css = [CSS.slideout({ isActive, width, transitionSpeed, slideDirection }), style];
	} else if (style) {
		styling.css = [style];
	}

	return isVisible ? (
		<CacheProvider>
			<ButtonContent content={buttonContent} toggleActive={toggleActive} />

			<div className={classnames('ss__slideout', className, { 'ss__slideout--active': isActive })} {...styling}>
				{cloneWithProps(children, { toggleActive, active: isActive })}
			</div>
			<Overlay {...subProps.overlay} active={isActive} onClick={toggleActive} />
		</CacheProvider>
	) : (
		<Fragment></Fragment>
	);
}

const ButtonContent = (props: { content: string | JSX.Element | undefined; toggleActive: () => void }): JSX.Element => {
	const { content, toggleActive } = props;

	if (content && typeof content == 'string') {
		return (
			<div
				onClick={() => toggleActive()}
				dangerouslySetInnerHTML={{
					__html: content,
				}}
			/>
		);
	} else if (content && typeof content == 'object') {
		let elem = () => {
			let elemm: JSX.Element = cloneWithProps(content, {
				onClick: () => toggleActive(),
			});
			return elemm;
		};
		return elem();
	} else return <></>;
};

export interface SlideoutProps extends ComponentProps {
	children?: ComponentChildren;
	active?: boolean;
	buttonContent?: string | JSX.Element;
	width?: string;
	displayAt?: string;
	transitionSpeed?: string;
	overlayColor?: string;
	slideDirection?: SlideDirectionType;
}

export type SlideDirectionType = 'top' | 'right' | 'bottom' | 'left';
interface SlideoutSubProps {
	overlay: OverlayProps;
}
