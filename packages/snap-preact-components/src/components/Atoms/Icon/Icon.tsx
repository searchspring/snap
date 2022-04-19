/** @jsx jsx */
import { h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';

import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps } from '../../../types';
import { iconPaths, IconType } from './paths';

const CSS = {
	icon: ({ color, height, width, size, theme }) =>
		css({
			fill: color || theme.colors?.primary,
			width: width || size,
			height: height || size,
			position: 'relative',
		}),
};

export function Icon(properties: IconProps): JSX.Element {
	const globalTheme: Theme = useTheme();
	const theme = { ...globalTheme, ...properties.theme };

	const props: IconProps = {
		// default props
		size: '16px',
		viewBox: '0 0 56 56',
		// global theme
		...globalTheme?.components?.icon,
		// props
		...properties,
		...properties.theme?.components?.icon,
	};
	const { color, icon, path, size, width, height, viewBox, disableStyles, className, style } = props;

	const iconPath = iconPaths[icon] || path;

	const styling: { css?: any } = {};
	if (!disableStyles) {
		styling.css = [CSS.icon({ color, width, height, size, theme }), style];
	} else if (style) {
		styling.css = [style];
	}

	return (
		iconPath && (
			<CacheProvider>
				<svg
					{...styling}
					className={classnames('ss__icon', icon ? `ss__icon--${icon}` : null, className)}
					viewBox={viewBox}
					xmlns="http://www.w3.org/2000/svg"
					width={disableStyles && (width || size)}
					height={disableStyles && (height || size)}
				>
					<path fill={disableStyles && color} d={iconPath} />
				</svg>
			</CacheProvider>
		)
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
