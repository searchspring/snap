/** @jsx jsx */
import { h } from 'preact';
import { useState } from 'preact/hooks';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { ComponentProps } from '../../../types';
import { Theme, useTheme, CacheProvider, cache } from '../../../providers';
import { useClickOutside } from '../../../hooks';

const CSS = {
	dropdown: ({ disableOverlay, style }) =>
		css({
			position: 'relative',
			'&.ss__dropdown--open': {
				'& .ss__dropdown__content': {
					position: `${disableOverlay ? 'initial' : null}`,
					visibility: 'visible',
					opacity: 1,
				},
			},
			'.ss__dropdown__button': {
				cursor: `${disableOverlay ? 'default' : 'pointer'}`,
			},
			'.ss__dropdown__content': {
				position: 'absolute',
				minWidth: '100%',
				visibility: 'hidden',
				opacity: 0,
				top: 'auto',
				left: 0,
			},
			...style,
		}),
};

export const Dropdown = observer((properties: DropdownProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const props: DropdownProps = {
		// default props
		startOpen: false,
		// global theme
		...globalTheme?.components?.dropdown,
		// props
		...properties,
		...properties.theme?.components?.dropdown,
	};

	const {
		button,
		content,
		children,
		disabled,
		open,
		disableOverlay,
		onClick,
		onToggle,
		startOpen,
		disableClickOutside,
		disableStyles,
		className,
		style,
	} = props;

	let showContent, setShowContent;

	const stateful = open === undefined;
	if (stateful) {
		[showContent, setShowContent] = useState(startOpen);
	} else {
		showContent = open;
	}

	const innerRef =
		!disableClickOutside &&
		useClickOutside<HTMLDivElement>((e) => {
			if (showContent) {
				if (!disabled) {
					stateful && setShowContent(false);
					onToggle && onToggle(e, false);
				}
			}
		});

	const toggleShowContent = (e) => {
		if (stateful) {
			setShowContent((prev) => {
				onToggle && onToggle(e, !prev);
				return !prev;
			});
		}
	};

	return (
		<CacheProvider value={cache}>
			<div
				css={!disableStyles && CSS.dropdown({ disableOverlay, style })}
				className={classnames('ss__dropdown', { 'ss__dropdown--open': showContent }, className)}
				ref={innerRef}
			>
				<div
					className="ss__dropdown__button"
					onClick={(e) => {
						if (!disabled) {
							toggleShowContent(e);
							onClick && onClick(e as any);
						}
					}}
				>
					{button}
				</div>

				<div className="ss__dropdown__content">
					{content}
					{children}
				</div>
			</div>
		</CacheProvider>
	);
});

export interface DropdownProps extends ComponentProps {
	button: string | JSX.Element;
	content?: string | JSX.Element;
	children?: any;
	disabled?: boolean;
	open?: boolean;
	disableOverlay?: string;
	onClick?: (event: Event) => void;
	onToggle?: (event: Event, showContent: boolean) => void;
	startOpen?: boolean;
	disableClickOutside?: boolean;
}
