/** @jsx jsx */
import { Fragment, h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, StylingCSS } from '../../../types';

const CSS = {
	BadgePill: (props: BadgePillProps) => {
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
			borderRadius: '1em',
		});
	},
};

export const BadgePill = observer((properties: BadgePillProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const props: BadgePillProps = {
		// default props
		color: 'rgba(58, 35, 173, 0.5)',
		colorText: '#fff',
		// global theme
		...globalTheme?.components?.badgePill,
		// props
		...properties,
		...properties.theme?.components?.badgePill,
	};
	const { value, disableStyles, tag, className, style } = props;

	const styling: { css?: StylingCSS } = {};

	if (!disableStyles) {
		styling.css = [CSS.BadgePill(props), style];
	} else if (style) {
		styling.css = [style];
	}

	return value ? (
		<CacheProvider>
			<div {...styling} className={classnames('ss__badge-pill', `ss__badge-pill--${tag}`, className)}>
				<span className="ss__badge-pill__value">{value}</span>
			</div>
		</CacheProvider>
	) : (
		<Fragment />
	);
});

export interface BadgePillProps extends ComponentProps {
	value: string;
	color?: string;
	colorText?: string;
	tag?: string;
}
