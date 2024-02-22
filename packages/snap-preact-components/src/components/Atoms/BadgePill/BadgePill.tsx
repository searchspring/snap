/** @jsx jsx */
import { Fragment, h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, StylingCSS } from '../../../types';
import type { ResultBadge, OverlayResultBadge } from '@searchspring/snap-store-mobx';

const CSS = {
	BadgePill: (props: BadgePillProps) => {
		const { parameters } = props.badge;
		const { color, colorText } = parameters;
		return css({
			padding: '0.2em 0.5em',

			background: color || 'rgba(255, 255, 255, 0.5)',
			color: colorText || '#000000',
		});
	},
};

export const BadgePill = observer((properties: BadgePillProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const props: BadgePillProps = {
		// default props
		// global theme
		...globalTheme?.components?.badgePill,
		// props
		...properties,
		...properties.theme?.components?.badgePill,
	};
	const { badge, disableStyles, className, style } = props;

	const styling: { css?: StylingCSS } = {};

	if (!disableStyles) {
		styling.css = [CSS.BadgePill(props), style];
	} else if (style) {
		styling.css = [style];
	}

	return badge ? (
		<CacheProvider>
			<div
				{...styling}
				className={classnames(
					'ss__badge-pill',
					`ss__badge-pill--${badge.component}`,
					`ss__badge-pill--${badge.location}`,
					`ss__badge-pill--${badge.tag}`,
					className
				)}
			>
				{badge.label}
			</div>
		</CacheProvider>
	) : (
		<Fragment />
	);
});

export interface BadgePillProps extends ComponentProps {
	badge: ResultBadge | OverlayResultBadge;
}
