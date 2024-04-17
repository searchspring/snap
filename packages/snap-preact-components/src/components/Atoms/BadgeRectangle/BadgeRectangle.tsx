/** @jsx jsx */
import { Fragment, h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, StylingCSS } from '../../../types';

const CSS = {
	BadgeRectangle: (props: BadgeRectangleProps) => {
		return css({
			display: 'inline-block',
			padding: '0.2em 0.5em',
			background: props.color,
			color: props.colorText,
			textOverflow: 'ellipsis',
			whiteSpace: 'nowrap',
			overflow: 'hidden',
			maxWidth: '100%',
		});
	},
};

export const BadgeRectangle = observer((properties: BadgeRectangleProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const props: BadgeRectangleProps = {
		// default props
		color: 'rgba(255, 255, 255, 0.5)',
		colorText: '#000000',
		// global theme
		...globalTheme?.components?.badgeRectangle,
		// props
		...properties,
		...properties.theme?.components?.badgeRectangle,
	};
	const { value, disableStyles, className, style } = props;

	const styling: { css?: StylingCSS } = {};

	if (!disableStyles) {
		styling.css = [CSS.BadgeRectangle(props), style];
	} else if (style) {
		styling.css = [style];
	}

	return value ? (
		<CacheProvider>
			<div {...styling} className={classnames('ss__badge-rectangle', className)}>
				{value}
			</div>
		</CacheProvider>
	) : (
		<Fragment />
	);
});

export interface BadgeRectangleProps extends ComponentProps {
	value: string;
	color?: string;
	colorText?: string;
}
