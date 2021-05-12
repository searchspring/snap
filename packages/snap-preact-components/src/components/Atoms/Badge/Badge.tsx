/** @jsx jsx */
import { h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { Theme, useTheme } from '../../../providers/theme';
import { ComponentProps } from '../../../types';

const CSS = {
	badge: ({ position, style }) =>
		css({
			display: 'inline-block',
			position: 'absolute',
			...position,
			...style,
		}),
};

export const Badge = observer(
	(properties: BadgeProps): JSX.Element => {
		const globalTheme: Theme = useTheme();

		const props: BadgeProps = {
			// default props
			position: {
				top: 0,
				left: 0,
			},
			// global theme
			...globalTheme?.components?.badge,
			// props
			...properties,
			...properties.theme?.components?.badge,
		};
		const { content, children, position, disableStyles, className, style } = props;

		return (
			<div css={!disableStyles && CSS.badge({ position, style })} className={classnames('ss-badge', className)}>
				{content || children}
			</div>
		);
	}
);

export interface BadgeProps extends ComponentProps {
	content?: any;
	children?: any;
	position?: {
		top?: string | number;
		right?: string | number;
		bottom?: string | number;
		left?: string | number;
	};
}
