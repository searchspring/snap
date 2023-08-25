/** @jsx jsx */
import { Fragment, h } from 'preact';
import { observer } from 'mobx-react-lite';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';

import { ComponentProps, StylingCSS } from '../../../../types';
import { Theme, useTheme, CacheProvider } from '../../../../providers';
import { mergeProps } from '../../../../utilities';

import { BannerContent, ContentType } from '@searchspring/snap-store-mobx';
import type { SearchController } from '@searchspring/snap-controller';

const CSS = {
	banner: ({}) =>
		css({
			'& iframe, img': {
				maxWidth: '100%',
				height: 'auto',
			},
		}),
};

export const Banner = observer((properties: BannerProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const theme = { ...globalTheme, ...properties.theme };
	const defaultProps: Partial<BannerProps> = {};

	const props = mergeProps('banner', globalTheme, defaultProps, properties);

	const { controller, type, disableStyles, className, style, styleScript } = props;

	const content = props.content || controller?.store?.merchandising.content;

	if (type === ContentType.INLINE) {
		console.warn(`BannerType '${ContentType.INLINE}' is not supported in <Banner /> component`);
		return <Fragment></Fragment>;
	}
	const styling: { css?: StylingCSS } = {};
	const stylingProps = { ...props, theme };

	if (styleScript && !disableStyles) {
		styling.css = [styleScript(stylingProps), style];
	} else if (!disableStyles) {
		styling.css = [CSS.banner(stylingProps), style];
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
});

export interface BannerProps extends ComponentProps {
	controller?: SearchController;
	content?: BannerContent;
	type: ContentType;
}
