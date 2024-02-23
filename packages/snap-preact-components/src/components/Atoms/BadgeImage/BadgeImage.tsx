/** @jsx jsx */
import { Fragment, h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, StylingCSS } from '../../../types';
import type { ResultBadge, OverlayResultBadge } from '@searchspring/snap-store-mobx';

const CSS = {
	BadgeImage: ({}: BadgeImageProps) => {
		return css({});
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
	const { badge, disableStyles, className, style } = props;

	const styling: { css?: StylingCSS } = {};

	if (!disableStyles) {
		styling.css = [CSS.BadgeImage(props), style];
	} else if (style) {
		styling.css = [style];
	}

	return badge?.parameters?.url ? (
		<CacheProvider>
			<img {...styling} className={classnames('ss__badge-image', className)} alt={badge.label} src={badge.parameters.url} />
		</CacheProvider>
	) : (
		<Fragment />
	);
});

export interface BadgeImageProps extends ComponentProps {
	badge: ResultBadge | OverlayResultBadge;
}
