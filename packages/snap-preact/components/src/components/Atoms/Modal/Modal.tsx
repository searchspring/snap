import { ComponentChildren, h } from 'preact';
import { useState, StateUpdater, MutableRef, useEffect } from 'preact/hooks';

import { css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { ComponentProps, StyleScript } from '../../../types';
import { Theme, useTheme, CacheProvider, useTreePath } from '../../../providers';
import { useClickOutside, useMediaQuery } from '../../../hooks';
import { cloneWithProps, mergeProps, mergeStyles } from '../../../utilities';
import { useA11y } from '../../../hooks/useA11y';

const defaultStyles: StyleScript<ModalProps> = () => {
	return css({
		position: 'relative',
		'&.ss__modal--open': {
			'& .ss__modal__content': {
				visibility: 'visible',
				opacity: 1,
			},
		},
		'.ss__modal__button': {
			cursor: 'pointer',
		},
		'.ss__modal__content': {
			backgroundColor: '#fff',
			position: 'absolute',
			minWidth: '100%',
			visibility: 'hidden',
			opacity: 0,
			top: 'auto',
			left: 0,
		},
	});
};

export const Modal = observer((properties: ModalProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const globalTreePath = useTreePath();

	const defaultProps: Partial<ModalProps> = {
		startOpen: false,
		disableA11y: false,
		lockScroll: true,
		treePath: globalTreePath,
	};

	const props = mergeProps('modal', globalTheme, defaultProps, properties);

	const {
		button,
		content,
		buttonSelector,
		children,
		disabled,
		open,
		onClick,
		lockScroll,
		startOpen,
		disableClickOutside,
		disableA11y,
		className,
		treePath,
	} = props;

	let showContent: boolean | undefined, setShowContent: undefined | StateUpdater<boolean | undefined>;

	const stateful = open === undefined;
	if (stateful) {
		[showContent, setShowContent] = useState<boolean | undefined>(startOpen);
	} else {
		showContent = open;
	}

	let innerRef: MutableRef<HTMLElement | undefined> | undefined;
	if (!disableClickOutside) {
		innerRef = useClickOutside(() => {
			if (showContent) {
				if (!disabled) {
					stateful && setShowContent && setShowContent(false);
				}
			}
		});
	}

	const toggleShowContent = () => {
		if (stateful) {
			setShowContent &&
				setShowContent((prev?: boolean) => {
					return !prev;
				});
		}
		document.body.style.overflow = showContent && lockScroll ? 'hidden' : '';
	};

	const styling = mergeStyles<ModalProps>(props, defaultStyles);

	let existingButton: Element | null;
	if (buttonSelector) {
		if (typeof buttonSelector == 'string') {
			existingButton = document.querySelector(buttonSelector);
		} else {
			existingButton = buttonSelector;
		}
	}

	useEffect(() => {
		if (existingButton) {
			if (!disabled) {
				existingButton.addEventListener('click', (e) => {
					toggleShowContent();
					onClick && onClick(e as unknown as React.MouseEvent<HTMLDivElement, MouseEvent>);
				});
			}
		}
	});

	const isVisible = useMediaQuery('', () => {
		if (lockScroll) document.body.style.overflow = '';
	});

	document.body.style.overflow = isVisible && showContent && lockScroll ? 'hidden' : '';

	return (
		<CacheProvider>
			<div
				{...styling}
				className={classnames('ss__modal', { 'ss__modal--open': showContent }, className)}
				ref={innerRef as React.LegacyRef<HTMLDivElement>}
			>
				{!buttonSelector && button && (
					<div
						className="ss__modal__button"
						ref={(e) => (!disableA11y ? useA11y(e) : null)}
						aria-expanded={showContent}
						role="button"
						onClick={(e) => {
							if (!disabled) {
								toggleShowContent();
								onClick && onClick(e);
							}
						}}
					>
						{cloneWithProps(button, { open: showContent, toggleOpen: toggleShowContent, treePath })}
					</div>
				)}

				{(content || children) && showContent && (
					<div className={`ss__modal__content`} ref={(e) => (!disableA11y ? useA11y(e) : null)}>
						{cloneWithProps(content, { open: showContent, toggleOpen: toggleShowContent, treePath })}
						{cloneWithProps(children, { open: showContent, toggleOpen: toggleShowContent, treePath })}
					</div>
				)}
			</div>
		</CacheProvider>
	);
});

export interface ModalProps extends ComponentProps {
	button?: string | JSX.Element;
	lockScroll?: boolean;
	buttonSelector?: string | Element;
	content?: string | JSX.Element;
	children?: ComponentChildren;
	disabled?: boolean;
	open?: boolean;
	onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
	startOpen?: boolean;
	disableClickOutside?: boolean;
	disableA11y?: boolean;
}
