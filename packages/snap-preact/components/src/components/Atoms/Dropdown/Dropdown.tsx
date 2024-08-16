import { ComponentChildren, h } from 'preact';
import { useState, StateUpdater, MutableRef } from 'preact/hooks';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react';

import { ComponentProps, RootNodeProperties } from '../../../types';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { useClickOutside } from '../../../hooks';
import { cloneWithProps, mergeProps } from '../../../utilities';
import { useA11y } from '../../../hooks/useA11y';

const CSS = {
	dropdown: ({ disableOverlay, classId }: Partial<DropdownProps> & { classId: string }) =>
		css({
			position: 'relative',
			'&.ss__dropdown--open': {
				[`& .ss__dropdown__content--${classId}`]: {
					position: disableOverlay ? 'relative' : undefined,
					visibility: 'visible',
					opacity: 1,
				},
			},
			'.ss__dropdown__button': {
				cursor: `${disableOverlay ? 'default' : 'pointer'}`,
			},
			[`.ss__dropdown__content`]: {
				position: 'absolute',
				minWidth: '100%',
				visibility: 'hidden',
				opacity: 0,
				top: 'auto',
				left: 0,
			},
		}),
};

export const Dropdown = observer((properties: DropdownProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const defaultProps = {
		startOpen: false,
		disableA11y: false,
	};

	const props = mergeProps('dropdown', globalTheme, defaultProps, properties);

	const {
		button,
		content,
		children,
		disabled,
		open,
		onClick,
		onToggle,
		startOpen,
		disableClickOutside,
		disableA11y,
		disableStyles,
		className,
		style,
		styleScript,
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
		innerRef = useClickOutside((e) => {
			if (showContent) {
				if (!disabled) {
					stateful && setShowContent && setShowContent(false);
					onToggle && onToggle(e, false);
				}
			}
		});
	}

	const toggleShowContent = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		if (stateful) {
			setShowContent &&
				setShowContent((prev?: boolean) => {
					onToggle && onToggle(e, !prev);
					return !prev;
				});
		}
	};

	const styling: RootNodeProperties = { 'ss-name': props.name };

	const [classId] = useState((Math.random() + 1).toString(36).substring(7));
	const stylingProps: Partial<DropdownProps> & { classId: string } = { ...props, classId: classId };

	if (styleScript && !disableStyles) {
		styling.css = [styleScript(stylingProps), style];
	} else if (!disableStyles) {
		styling.css = [CSS.dropdown(stylingProps), style];
	} else if (style) {
		styling.css = [style];
	}
	return (
		<CacheProvider>
			<div
				{...styling}
				className={classnames('ss__dropdown', { 'ss__dropdown--open': showContent }, className)}
				ref={innerRef as React.LegacyRef<HTMLDivElement>}
			>
				<div
					className="ss__dropdown__button"
					ref={(e) => (!disableA11y ? useA11y(e) : null)}
					aria-expanded={showContent}
					role="button"
					onClick={(e) => {
						if (!disabled) {
							toggleShowContent(e);
							onClick && onClick(e);
						}
					}}
				>
					{cloneWithProps(button, { open: showContent, toggleOpen: toggleShowContent, treePath })}
				</div>

				{(content || children) && (
					<div className={`ss__dropdown__content ss__dropdown__content--${classId}`}>
						{cloneWithProps(content, { open: showContent, toggleOpen: toggleShowContent, treePath })}
						{cloneWithProps(children, { open: showContent, toggleOpen: toggleShowContent, treePath })}
					</div>
				)}
			</div>
		</CacheProvider>
	);
});

export interface DropdownProps extends ComponentProps {
	button: string | JSX.Element;
	content?: string | JSX.Element;
	children?: ComponentChildren;
	disabled?: boolean;
	open?: boolean;
	disableOverlay?: boolean;
	onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
	onToggle?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>, showContent: boolean) => void;
	startOpen?: boolean;
	disableClickOutside?: boolean;
	disableA11y?: boolean;
}
