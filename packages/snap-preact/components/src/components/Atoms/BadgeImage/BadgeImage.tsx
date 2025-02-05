import { Fragment, h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react';

import { Theme, useTheme, CacheProvider, useTreePath } from '../../../providers';
import { ComponentProps, StyleScript } from '../../../types';
import { mergeProps, mergeStyles } from '../../../utilities';

const defaultStyles: StyleScript<BadgeImageProps> = () => {
	return css({
		maxHeight: '100%',
		maxWidth: '100%',
	});
};

export const BadgeImage = observer((properties: BadgeImageProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const globalTreePath = useTreePath();

	const defaultProps: Partial<BadgeImageProps> = {
		// default props
		treePath: globalTreePath,
	};

	const props = mergeProps('badgeImage', globalTheme, defaultProps, properties);

	const { label, url, tag, className } = props;

	const styling = mergeStyles<BadgeImageProps>(props, defaultStyles);

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
