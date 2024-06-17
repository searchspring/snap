/** @jsxRuntime classic */
/** @jsx jsx */
import { Fragment, h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, StylingCSS } from '../../../types';

const CSS = {
	BadgeRectangle: (props: BadgeRectangleProps) => {
		return css({
			display: 'inline-block',
			boxSizing: 'border-box',
			padding: '0.3em 0.9em',
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
		color: 'rgba(58, 35, 173, 1)',
		colorText: '#fff',
		// global theme
		...globalTheme?.components?.badgeRectangle,
		// props
		...properties,
		...properties.theme?.components?.badgeRectangle,
	};
	const { value, disableStyles, tag, className, style } = props;

	const styling: { css?: StylingCSS } = {};

	if (!disableStyles) {
		styling.css = [CSS.BadgeRectangle(props), style];
	} else if (style) {
		styling.css = [style];
	}

	return value ? (
		<CacheProvider>
			<div {...styling} className={classnames('ss__badge-rectangle', `ss__badge-rectangle--${tag}`, className)}>
				<span className="ss__badge-rectangle__value">{value}</span>
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
	tag?: string;
}
