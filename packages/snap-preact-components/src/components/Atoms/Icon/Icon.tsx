/** @jsx jsx */
import { Fragment, h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';

import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, StylingCSS } from '../../../types';
import { iconPaths, IconType } from './paths';
import { mergeProps } from '../../../utilities';

const CSS = {
	icon: ({ color, height, width, size, theme }: IconProps) =>
		css({
			fill: color || theme?.colors?.primary,
			width: width || size,
			height: height || size,
			position: 'relative',
		}),
};

export function Icon(properties: IconProps): JSX.Element {
	const globalTheme: Theme = useTheme();
	const theme = { ...globalTheme, ...properties.theme };
	const defaultProps: Partial<IconProps> = {
		size: '16px',
		viewBox: '0 0 56 56',
	};

	const props = mergeProps('icon', globalTheme, defaultProps, properties);

	const { color, icon, path, size, width, height, viewBox, disableStyles, className, style, styleScript } = props;

	const iconPath = iconPaths[icon as keyof typeof iconPaths] || path;

	const styling: { css?: StylingCSS } = {};
	const stylingProps = { ...props, theme };

	if (styleScript && !disableStyles) {
		styling.css = [styleScript(stylingProps), style];
	} else if (!disableStyles) {
		styling.css = [CSS.icon(stylingProps), style];
	} else if (style) {
		styling.css = [style];
	}

	return iconPath ? (
		<CacheProvider>
			<svg
				{...styling}
				className={classnames('ss__icon', icon ? `ss__icon--${icon}` : null, className)}
				viewBox={viewBox}
				xmlns="http://www.w3.org/2000/svg"
				width={disableStyles ? width || size : undefined}
				height={disableStyles ? height || size : undefined}
			>
				<path fill={disableStyles ? color : undefined} d={iconPath} />
			</svg>
		</CacheProvider>
	) : (
		<Fragment></Fragment>
	);
}

export interface IconProps extends ComponentProps {
	color?: string;
	icon?: IconType | string;
	path?: string;
	size?: string;
	width?: string;
	height?: string;
	viewBox?: string;
}
