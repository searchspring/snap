/** @jsx jsx */
import { Fragment, h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, StylingCSS } from '../../../types';

const CSS = {
	BadgeImage: (props: BadgeImageProps) => {
		return css({
			maxHeight: props.overflow ? '100%' : undefined,
			maxWidth: props.overflow ? '100%' : 'unset',
		});
	},
};

export const BadgeImage = observer((properties: BadgeImageProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const props: BadgeImageProps = {
		// default props
		overflow: false,
		// global theme
		...globalTheme?.components?.badgeImage,
		// props
		...properties,
		...properties.theme?.components?.badgeImage,
	};
	const { label, url, disableStyles, className, style } = props;

	const styling: { css?: StylingCSS } = {};

	if (!disableStyles) {
		styling.css = [CSS.BadgeImage(props), style];
	} else if (style) {
		styling.css = [style];
	}

	return url ? (
		<CacheProvider>
			<img {...styling} className={classnames('ss__badge-image', className)} alt={label} src={url} />
		</CacheProvider>
	) : (
		<Fragment />
	);
});

export interface BadgeImageProps extends ComponentProps {
	url: string;
	label?: string;
	overflow?: boolean;
}
