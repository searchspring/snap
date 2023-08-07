/** @jsx jsx */
import { ComponentChildren, h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, StylingCSS } from '../../../types';
import { mergeProps } from '../../../utilities';

const CSS = {
	badge: ({ position }: BadgeProps) =>
		css({
			display: 'inline-block',
			position: 'absolute',
			...position,
		}),
};

export const Badge = observer((properties: BadgeProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const defaultProps: Partial<BadgeProps> = {
		position: {
			top: 0,
			left: 0,
		},
	};

	const props = mergeProps('badge', globalTheme, defaultProps, properties);

	const { content, title, children, position, disableStyles, className, style } = props;

	const styling: { css?: StylingCSS } = {};

	if (!disableStyles) {
		styling.css = [CSS.badge({ position }), style];
	} else if (style) {
		styling.css = [style];
	}

	return (
		<CacheProvider>
			<div {...styling} className={classnames('ss__badge', className)} title={title}>
				{content || children}
			</div>
		</CacheProvider>
	);
});

export interface BadgeProps extends ComponentProps {
	content?: any;
	children?: ComponentChildren;
	position?: {
		top?: string | number;
		right?: string | number;
		bottom?: string | number;
		left?: string | number;
	};
	title?: string;
}
