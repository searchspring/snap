import { ComponentChildren, h } from 'preact';
import { useState, StateUpdater, MutableRef } from 'preact/hooks';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { ComponentProps, StyleScript } from '../../../types';
import { Theme, useTheme, CacheProvider, useTreePath } from '../../../providers';
import { useClickOutside } from '../../../hooks';
import { cloneWithProps, mergeProps, mergeStyles } from '../../../utilities';
import { useA11y } from '../../../hooks/useA11y';

const defaultStyles: StyleScript<DropdownProps> = ({ disableOverlay }) => {
	return css({
		position: 'relative',
		'&.ss__dropdown--open': {
			'& .ss__dropdown__content': {
				position: disableOverlay ? 'relative' : undefined,
				visibility: 'visible',
				opacity: 1,
			},
		},
		'.ss__dropdown__button': {
			cursor: `${disableOverlay ? 'default' : 'pointer'}`,
		},
		'.ss__dropdown__content': {
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

export const Dropdown = observer((properties: DropdownProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const globalTreePath = useTreePath();

	const defaultProps: Partial<DropdownProps> = {
		startOpen: false,
		disableA11y: false,
		treePath: globalTreePath,
	};

	const props = mergeProps('dropdown', globalTheme, defaultProps, properties);

	const {
		button,
		content,
		children,
		disabled,
		open,
		toggleOnHover,
		onMouseEnter,
		onMouseLeave,
		disableClick,
		onClick,
		onToggle,
		focusTrapContent,
		startOpen,
		disableClickOutside,
		disableA11y,
		className,
		internalClassName,
		treePath,
	} = props;

	let dropdownOpen: boolean | undefined, setDropdownOpen: undefined | StateUpdater<boolean | undefined>;

	const stateful = open === undefined;
	if (stateful) {
		[dropdownOpen, setDropdownOpen] = useState<boolean | undefined>(startOpen);
	} else {
		dropdownOpen = open;
	}

	// state to track touch interactions
	const [isTouchInteraction, setIsTouchInteraction] = useState(false);

	let innerRef: MutableRef<HTMLElement | undefined> | undefined;
	if (!disableClickOutside) {
		innerRef = useClickOutside((e) => {
			if (dropdownOpen) {
				if (!disabled) {
					stateful && setDropdownOpen && setDropdownOpen(false);
					onToggle && onToggle(e, false);
				}
			}
		});
	}

	const toggleOpenDropdown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, state?: boolean) => {
		if (stateful) {
			setDropdownOpen &&
				setDropdownOpen((prev?: boolean) => {
					const newState = state ?? !prev;
					if (newState != prev) {
						onToggle && onToggle(e, newState);
					}
					return newState;
				});
		}
	};

	const styling = mergeStyles<DropdownProps>(props, defaultStyles);

	const hoverProps: {
		onMouseEnter?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
		onMouseLeave?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
	} = {
		onMouseEnter:
			(toggleOnHover || onMouseEnter) &&
			((e) => {
				// skip if it's a touch interaction
				if (isTouchInteraction) return;

				if (toggleOnHover && !disabled) {
					toggleOpenDropdown(e, true);
				}
				onMouseEnter && onMouseEnter(e);
			}),
		onMouseLeave:
			(toggleOnHover || onMouseLeave) &&
			((e) => {
				// skip if it's a touch interaction
				if (isTouchInteraction) return;

				if (toggleOnHover && !disabled) {
					toggleOpenDropdown(e, false);
				}
				onMouseLeave && onMouseLeave(e);
			}),
	};

	return (
		<CacheProvider>
			<div
				{...styling}
				className={classnames('ss__dropdown', { 'ss__dropdown--open': dropdownOpen }, className, internalClassName)}
				ref={innerRef as React.LegacyRef<HTMLDivElement>}
				{...hoverProps}
			>
				<div
					className="ss__dropdown__button"
					ref={(e) => (!disableA11y ? useA11y(e) : null)}
					aria-expanded={dropdownOpen}
					role="button"
					onTouchStart={() => {
						// mark this as a touch interaction to avoid hover state conflicts
						setIsTouchInteraction(true);
					}}
					onClick={(e) => {
						if (!disabled && !disableClick) {
							toggleOpenDropdown(e);
							onClick && onClick(e);
						}

						// reset touch interaction after a short delay
						// this gives time for the click handler to complete before allowing hover events again
						setTimeout(() => {
							setIsTouchInteraction(false);
						}, 300);
					}}
				>
					{cloneWithProps(button, { open: dropdownOpen, toggleOpen: toggleOpenDropdown, treePath })}
				</div>

				{(content || children) && (
					<div
						className={`ss__dropdown__content`}
						ref={(e) =>
							!disableA11y
								? useA11y(e, 0, Boolean(focusTrapContent), (e) => {
										if (stateful) {
											toggleOpenDropdown(e);
										} else {
											onClick && onClick(e);
										}
								  })
								: null
						}
					>
						{cloneWithProps(content, { open: dropdownOpen, toggleOpen: toggleOpenDropdown, treePath })}
						{cloneWithProps(children, { open: dropdownOpen, toggleOpen: toggleOpenDropdown, treePath })}
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
	disableClick?: boolean;
	disableOverlay?: boolean;
	onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
	onMouseEnter?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
	onMouseLeave?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
	onToggle?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>, showContent: boolean) => void;
	startOpen?: boolean;
	toggleOnHover?: boolean;
	disableClickOutside?: boolean;
	focusTrapContent?: boolean;
	disableA11y?: boolean;
}
