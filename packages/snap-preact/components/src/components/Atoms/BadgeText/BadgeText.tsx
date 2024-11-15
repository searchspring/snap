import { Fragment, h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, StyleScript } from '../../../types';
import { mergeStyles } from '../../../utilities';

const defaultStyles: StyleScript<BadgeTextProps> = ({ colorText }) => {
	return css({
		display: 'inline-block',
		boxSizing: 'border-box',
		padding: '0.3em 0.9em',
		color: colorText,
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		maxWidth: '100%',
	});
};

export const BadgeText = observer((properties: BadgeTextProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const props: BadgeTextProps = {
		// default props
		colorText: '#000000',
		// global theme
		...globalTheme?.components?.badgeText,
		// props
		...properties,
		...properties.theme?.components?.badgeText,
	};
	const { value, tag, className } = props;

	const styling = mergeStyles<BadgeTextProps>(props, defaultStyles);

	return value ? (
		<CacheProvider>
			<div {...styling} className={classnames('ss__badge-text', `ss__badge-text--${tag}`, className)}>
				<span className="ss__badge-text__value">{value}</span>
			</div>
		</CacheProvider>
	) : (
		<Fragment />
	);
});

export interface BadgeTextProps extends ComponentProps<BadgeTextProps> {
	value: string;
	colorText?: string;
	tag?: string;
}
