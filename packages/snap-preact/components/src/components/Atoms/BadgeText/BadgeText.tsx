import { Fragment, h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, RootNodeProperties } from '../../../types';

const CSS = {
	BadgeText: (props: BadgeTextProps) => {
		return css({
			display: 'inline-block',
			boxSizing: 'border-box',
			padding: '0.3em 0.9em',
			color: props.colorText,
			textOverflow: 'ellipsis',
			whiteSpace: 'nowrap',
			overflow: 'hidden',
			maxWidth: '100%',
		});
	},
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
	const { value, disableStyles, tag, className, style } = props;

	const styling: RootNodeProperties = { 'ss-name': props.name };

	if (!disableStyles) {
		styling.css = [CSS.BadgeText(props), style];
	} else if (style) {
		styling.css = [style];
	}

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
