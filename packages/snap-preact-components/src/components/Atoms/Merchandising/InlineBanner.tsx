/** @jsx jsx */
import { h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { Theme, useTheme } from '../../../providers';
import { InlineBannerContent, ComponentProps, Layout, LayoutType } from '../../../types';

const CSS = {
	inlineBanner: ({ width, style }) =>
		css({
			height: '100%',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			maxWidth: width ? 'initial' : '260px',
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
			...style,
		}),
};

export function InlineBanner(properties: InlineBannerProps): JSX.Element {
	const globalTheme: Theme = useTheme();

	const props: InlineBannerProps = {
		// default props
		layout: Layout.GRID,
		banner: {},
		// global theme
		...globalTheme?.components?.banner,
		// props
		...properties,
		...properties.theme?.components?.banner,
	};

	const { banner, disableStyles, className, width, layout, style } = props;

	return (
		banner &&
		banner.value && (
			<div
				className={classnames('ss__inline-banner', `ss__inline-banner--${layout}`, className)}
				css={!disableStyles && CSS.inlineBanner({ width, style })}
				dangerouslySetInnerHTML={{
					__html: banner.value,
				}}
			/>
		)
	);
}

export interface InlineBannerProps extends ComponentProps {
	banner: InlineBannerContent;
	width?: string;
	layout?: LayoutType;
}
