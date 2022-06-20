/** @jsx jsx */
import { Fragment, h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { InlineBannerContent, ComponentProps, Layout, LayoutType, StylingCSS } from '../../../types';

const CSS = {
	inlineBanner: ({ width }: InlineBannerProps) =>
		css({
			height: '100%',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			width: width || 'auto',
			'&.ss__inline-banner--grid': {
				flexDirection: 'column',
			},
			'&.ss__inline-banner--list': {
				flexDirection: 'row',
				display: 'block',
				width: '100%',
			},
			'& iframe': {
				maxWidth: '100%',
			},
		}),
};

export function InlineBanner(properties: InlineBannerProps): JSX.Element {
	const globalTheme: Theme = useTheme();

	const props: InlineBannerProps = {
		// default props
		layout: Layout.GRID,
		banner: {},
		// global theme
		...globalTheme?.components?.inlineBanner,
		// props
		...properties,
		...properties.theme?.components?.inlineBanner,
	};

	const { banner, disableStyles, className, width, layout, onClick, style } = props;

	const styling: { css?: StylingCSS } = {};
	if (!disableStyles) {
		styling.css = [CSS.inlineBanner({ width }), style];
	} else if (style) {
		styling.css = [style];
	}

	return banner && banner.value ? (
		<CacheProvider>
			<div
				onClick={(e: React.MouseEvent<Element, MouseEvent>) => {
					onClick && onClick(e);
				}}
				className={classnames('ss__inline-banner', `ss__inline-banner--${layout}`, className)}
				{...styling}
				dangerouslySetInnerHTML={{
					__html: banner.value,
				}}
			/>
		</CacheProvider>
	) : (
		<Fragment></Fragment>
	);
}

export interface InlineBannerProps extends ComponentProps {
	banner?: InlineBannerContent;
	width?: string;
	layout?: LayoutType;
	onClick?: (e: React.MouseEvent) => void;
}
