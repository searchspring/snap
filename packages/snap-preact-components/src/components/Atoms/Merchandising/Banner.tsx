/** @jsx jsx */
import { Fragment, h } from 'preact';

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
		// global theme
		...globalTheme?.components?.banner,
		// props
		...properties,
		...properties.theme?.components?.banner,
	};

	const { content, type, disableStyles, className, style } = props;

	if (type === BannerType.inline) {
		console.warn(`BannerType '${BannerType.inline}' is not supported in <Banner /> component`);
		return <Fragment></Fragment>;
	}
	const styling: { css?: any } = {};
	if (!disableStyles) {
		styling.css = [CSS.banner(), style];
	} else if (style) {
		styling.css = [style];
	}
	let bannerContent;
	if (content && content[type]) {
		bannerContent = content[type] as string[];
	}
	return bannerContent && bannerContent.length ? (
		<CacheProvider>
			<div
				className={classnames('ss__banner', `ss__banner--${type}`, className)}
				{...styling}
				dangerouslySetInnerHTML={{
					__html: bannerContent.join(''),
				}}
			/>
		</CacheProvider>
	) : (
		<Fragment></Fragment>
	);
}

export interface BannerProps extends ComponentProps {
	content: BannerContent;
	type: BannerType;
}
