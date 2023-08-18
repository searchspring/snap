/** @jsx jsx */
import { Fragment, h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { Theme, useTheme, CacheProvider } from '../../../../providers';
import { ComponentProps, ResultsLayout, ResultsLayoutType, StylingCSS } from '../../../../types';
import { mergeProps } from '../../../../utilities';

import type { Banner } from '@searchspring/snap-store-mobx';

const CSS = {
	inlineBanner: ({ width }: Partial<InlineBannerProps>) =>
		css({
			height: '100%',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			width: width,
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
	const theme = { ...globalTheme, ...properties.theme };
	const defaultProps: Partial<InlineBannerProps> = {
		layout: ResultsLayout.GRID,
		width: 'auto',
	};

	const props = mergeProps('inlineBanner', globalTheme, defaultProps, properties);

	const { banner, disableStyles, className, layout, onClick, style, styleScript } = props;

	const styling: { css?: StylingCSS } = {};
	const stylingProps = { ...props, theme };

	if (styleScript) {
		styling.css = [styleScript(stylingProps), style];
	} else if (!disableStyles) {
		styling.css = [CSS.inlineBanner(stylingProps), style];
	} else if (style) {
		styling.css = [style];
	}

	return banner && banner.value ? (
		<CacheProvider>
			<div
				onClick={(e: React.MouseEvent<Element, MouseEvent>) => {
					onClick && onClick(e, banner);
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
	banner: Banner;
	width?: string;
	layout?: ResultsLayoutType;
	onClick?: (e: React.MouseEvent, banner: Banner) => void;
}
