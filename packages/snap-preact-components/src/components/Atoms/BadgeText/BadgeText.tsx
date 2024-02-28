/** @jsx jsx */
import { Fragment, h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';
import type { CSSObject } from '@emotion/serialize';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, StylingCSS } from '../../../types';

const CSS = {
	BadgeText: (props: BadgeTextProps) => {
		const overflow: CSSObject = props.overflow
			? {
					textOverflow: 'ellipsis',
					whiteSpace: 'nowrap',
					overflow: 'hidden',
					maxWidth: '200%',
			  }
			: {};

		return css({
			display: 'inline-block',
			padding: '0.2em 0.5em',
			background: props.color,
			color: props.colorText,
			...overflow,
		});
	},
};

export const BadgeText = observer((properties: BadgeTextProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const props: BadgeTextProps = {
		// default props
		overflow: true,
		color: 'rgba(255, 255, 255, 0.5)',
		colorText: '#000000',
		// global theme
		...globalTheme?.components?.badgeText,
		// props
		...properties,
		...properties.theme?.components?.badgeText,
	};
	const { label, disableStyles, className, style } = props;

	const styling: { css?: StylingCSS } = {};

	if (!disableStyles) {
		styling.css = [CSS.BadgeText(props), style];
	} else if (style) {
		styling.css = [style];
	}

	return label ? (
		<CacheProvider>
			<div {...styling} className={classnames('ss__badge-text', className)}>
				{label}
			</div>
		</CacheProvider>
	) : (
		<Fragment />
	);
});

export interface BadgeTextProps extends ComponentProps {
	label: string;
	color?: string;
	colorText?: string;
	overflow?: boolean;
}
