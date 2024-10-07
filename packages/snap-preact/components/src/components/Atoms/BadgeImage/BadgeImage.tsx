import { Fragment, h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react';

import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, RootNodeProperties } from '../../../types';

const CSS = {
	BadgeImage: () => {
		return css({
			maxHeight: '100%',
			maxWidth: '100%',
		});
	},
};

export const BadgeImage = observer((properties: BadgeImageProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const props: BadgeImageProps = {
		// default props
		// global theme
		...globalTheme?.components?.badgeImage,
		// props
		...properties,
		...properties.theme?.components?.badgeImage,
	};
	const { label, url, tag, disableStyles, className, style } = props;

	const styling: RootNodeProperties = { 'ss-name': props.name };

	if (!disableStyles) {
		styling.css = [CSS.BadgeImage(), style];
	} else if (style) {
		styling.css = [style];
	}

	return url ? (
		<CacheProvider>
			<img {...styling} className={classnames('ss__badge-image', `ss__badge-image--${tag}`, className)} alt={label || `${tag} badge`} src={url} />
		</CacheProvider>
	) : (
		<Fragment />
	);
});

export interface BadgeImageProps extends ComponentProps<BadgeImageProps> {
	url: string;
	label?: string;
	tag?: string;
}
