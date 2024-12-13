import { Fragment, h, ComponentChildren } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';

import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, StyleScript } from '../../../types';
import { iconPaths, IconType } from './paths';
import { mergeProps, mergeStyles } from '../../../utilities';

const defaultStyles: StyleScript<IconProps> = ({ color, theme, width, height, size }) => {
	return css({
		fill: color || theme?.variables?.colors?.primary || '#333',
		stroke: color || theme?.variables?.colors?.primary || '#333',
		width: isNaN(Number(width || size)) ? width || size : `${width || size}px`,
		height: isNaN(Number(height || size)) ? height || size : `${height || size}px`,
		position: 'relative',
	});
};

export function Icon(properties: IconProps): JSX.Element {
	const globalTheme: Theme = useTheme();
	const defaultProps: Partial<IconProps> = {
		size: '16px',
		viewBox: '0 0 56 56',
	};

	const props = mergeProps('icon', globalTheme, defaultProps, properties);

	const {
		color,
		icon,
		path,
		children,
		size,
		width,
		height,
		viewBox,
		disableStyles,
		className,
		style: _,
		styleScript: __,
		themeStyleScript: ___,
		name: ____,
		treePath: _____,
		...otherProps
	} = props;

	const iconPath = iconPaths[icon as IconType] || path;
	const pathType = typeof iconPath;
	const styling = mergeStyles<IconProps>(props, defaultStyles);

	return children || (iconPath && (pathType === 'string' || (pathType === 'object' && Array.isArray(iconPath)))) ? (
		<CacheProvider>
			<svg
				{...styling}
				className={classnames('ss__icon', icon ? `ss__icon--${icon}` : null, className)}
				viewBox={viewBox}
				xmlns="http://www.w3.org/2000/svg"
				width={disableStyles ? width || size : undefined}
				height={disableStyles ? height || size : undefined}
				{...otherProps}
			>
				{(() => {
					if (children) {
						return children;
					} else if (pathType === 'string') {
						return <path fill={disableStyles ? color : undefined} d={iconPath as string} />;
					} else if (iconPath && pathType === 'object' && Array.isArray(iconPath)) {
						return (iconPath as SVGPathElement[]).map((p, i) => <p.type key={i} {...p.attributes} />);
					}
				})()}
			</svg>
		</CacheProvider>
	) : (
		<Fragment></Fragment>
	);
}

export type SVGPathElement = {
	type: string;
	attributes: {
		[attribute: string]: string;
	};
};

export interface IconProps extends ComponentProps {
	color?: string;
	icon?: IconType;
	path?: string | SVGPathElement[];
	children?: ComponentChildren;
	size?: string | number;
	width?: string | number;
	height?: string | number;
	viewBox?: string;
	name?: IconNames;
}
export type IconNames =
	| 'bundle-cart'
	| 'bundle-selector'
	| 'next'
	| 'prev'
	| 'active'
	| 'inactive'
	| 'star--empty'
	| 'star--full'
	| 'selection'
	| 'open'
	| 'close'
	| 'option'
	| 'expand'
	| 'collapse';
