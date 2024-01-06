import { Fragment, h, ComponentChildren } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';

import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, StylingCSS } from '../../../types';
import { iconPaths, IconType } from './paths';
import { mergeProps } from '../../../utilities';

const CSS = {
	icon: ({ color, height, width, size, theme }: Partial<IconProps>) =>
		css({
			fill: color || theme?.variables?.color?.primary || '#333',
			stroke: color || theme?.variables?.color?.primary || '#333',
			width: isNaN(Number(width || size)) ? width || size : `${width || size}px`,
			height: isNaN(Number(height || size)) ? height || size : `${height || size}px`,
			position: 'relative',
		}),
};

export function Icon(properties: IconProps): JSX.Element {
	const globalTheme: Theme = useTheme();
	const defaultProps: Partial<IconProps> = {
		size: '16px',
		viewBox: '0 0 56 56',
	};

	const props = mergeProps('icon', globalTheme, defaultProps, properties);

	const { color, icon, path, children, size, width, height, viewBox, disableStyles, className, style, styleScript, ...otherProps } = props;

	const iconPath = iconPaths[icon as keyof typeof iconPaths] || path;
	const pathType = typeof iconPath;
	const styling: { css?: StylingCSS } = {};
	const stylingProps = props;

	if (styleScript && !disableStyles) {
		styling.css = [styleScript(stylingProps), style];
	} else if (!disableStyles) {
		styling.css = [CSS.icon(stylingProps), style];
	} else if (style) {
		styling.css = [style];
	}

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
						return iconPath.map((p: SVGPathElement, i) => <p.type key={i} {...p.attributes} />);
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
	icon?: IconType | string;
	path?: string | SVGPathElement[];
	children?: ComponentChildren;
	size?: string | number;
	width?: string | number;
	height?: string | number;
	viewBox?: string;
}
