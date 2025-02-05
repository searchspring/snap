import { Fragment, h } from 'preact';
import { observer } from 'mobx-react-lite';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';

import { Theme, useTheme, CacheProvider, useTreePath } from '../../../../providers';
import { mergeProps, mergeStyles } from '../../../../utilities';

import { BannerContent, ContentType } from '@searchspring/snap-store-mobx';
import type { SearchController } from '@searchspring/snap-controller';
import { ComponentProps, StyleScript } from '../../../../types';

const defaultStyles: StyleScript<BannerProps> = () => {
	return css({
		' *': {
			boxSizing: 'border-box',
		},
		'& iframe, img': {
			maxWidth: '100%',
			height: 'auto',
		},
	});
};

export const Banner = observer((properties: BannerProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const globalTreePath = useTreePath();

	const defaultProps: Partial<BannerProps> = {
		treePath: globalTreePath,
	};

	const props = mergeProps('banner', globalTheme, defaultProps, properties);

	const { controller, type, className } = props;

	const content = props.content || controller?.store?.merchandising.content;

	if (type === ContentType.INLINE) {
		console.warn(`BannerType '${ContentType.INLINE}' is not supported in <Banner /> component`);
		return <Fragment></Fragment>;
	}

	const styling = mergeStyles<BannerProps>(props, defaultStyles);

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

export type BannerNames = 'left' | 'header' | 'banner' | 'footer';
