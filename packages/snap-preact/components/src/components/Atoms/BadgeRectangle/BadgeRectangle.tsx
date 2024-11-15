import { Fragment, h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, StyleScript } from '../../../types';
import { mergeStyles } from '../../../utilities';

const defaultStyles: StyleScript<BadgeRectangleProps> = ({ color, colorText }) => {
	return css({
		display: 'inline-block',
		boxSizing: 'border-box',
		padding: '0.3em 0.9em',
		background: color,
		color: colorText,
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		maxWidth: '100%',
	});
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
	const { value, tag, className } = props;

	const styling = mergeStyles<BadgeRectangleProps>(props, defaultStyles);

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

export interface BadgeRectangleProps extends ComponentProps<BadgeRectangleProps> {
	value: string;
	color?: string;
	colorText?: string;
	tag?: string;
}
