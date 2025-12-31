/** @jsx jsx */
import { Fragment, h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';

import { ComponentProps, StylingCSS } from '../../../../types';
import { Theme, useTheme, CacheProvider, withController, withTracking } from '../../../../providers';
import { BannerContent, ContentType } from '@searchspring/snap-store-mobx';
import type { SearchController, AutocompleteController, RecommendationController } from '@searchspring/snap-controller';
const CSS = {
	banner: () =>
		css({
			'& iframe, img': {
				maxWidth: '100%',
				height: 'auto',
			},
		}),
};

export const Banner = withController<any>(
	withTracking((properties: BannerProps): JSX.Element => {
		const globalTheme: Theme = useTheme();

		const props: BannerProps = {
			// global theme
			...globalTheme?.components?.banner,
			// props
			...properties,
			...properties.theme?.components?.banner,
		};

		const { trackingRef, content, type, disableStyles, className, style } = props;

		if (type === ContentType.INLINE) {
			console.warn(`BannerType '${ContentType.INLINE}' is not supported in <Banner /> component`);
			return <Fragment></Fragment>;
		}
		const styling: { css?: StylingCSS } = {};
		if (!disableStyles) {
			styling.css = [CSS.banner(), style];
		} else if (style) {
			styling.css = [style];
		}

		const banner = content?.[type]?.[0];
		const value = banner?.value;
		if (!type || !value) {
			return <Fragment></Fragment>;
		}

		return (
			<CacheProvider>
				<div
					className={classnames('ss__banner', `ss__banner--${type}`, className)}
					{...styling}
					ref={trackingRef}
					dangerouslySetInnerHTML={{
						__html: typeof value === 'string' ? value : value.join(''),
					}}
				/>
			</CacheProvider>
		);
	})
);

export interface BannerProps extends ComponentProps {
	content: BannerContent;
	type: ContentType;
	controller?: SearchController | AutocompleteController | RecommendationController;
}
