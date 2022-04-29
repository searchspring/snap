/** @jsx jsx */
import { h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';

import { BannerContent, BannerType, ComponentProps } from '../../../types';
import { Theme, useTheme, CacheProvider } from '../../../providers';

const CSS = {
	banner: () =>
		css({
			'& iframe, img': {
				maxWidth: '100%',
				height: 'auto',
			},
		}),
};

export function Banner(properties: BannerProps): JSX.Element {
	const globalTheme: Theme = useTheme();

	const props: BannerProps = {
		// default props
		content: [],
		type: '',
		// global theme
		...globalTheme?.components?.banner,
		// props
		...properties,
		...properties.theme?.components?.banner,
	};

	const { content, type, disableStyles, className, style } = props;

	if (type === BannerType.INLINE) {
		console.warn(`BannerType '${BannerType.INLINE}' is not supported in <Banner /> component`);
		return;
	}
	const styling: { css?: any } = {};
	if (!disableStyles) {
		styling.css = [CSS.banner(), style];
	} else if (style) {
		styling.css = [style];
	}
	return (
		content &&
		content[type]?.length > 0 && (
			<CacheProvider>
				<div
					className={classnames('ss__banner', `ss__banner--${type}`, className)}
					{...styling}
					dangerouslySetInnerHTML={{
						__html: content[props.type].join(''),
					}}
				/>
			</CacheProvider>
		)
	);
}

export interface BannerProps extends ComponentProps {
	content: BannerContent | [];
	type: BannerType;
}
