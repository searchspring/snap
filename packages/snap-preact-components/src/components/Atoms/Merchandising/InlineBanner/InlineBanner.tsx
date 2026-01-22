/** @jsx jsx */
import { Fragment, h } from 'preact';

import { observer } from 'mobx-react';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { Theme, useTheme, CacheProvider, withController, withTracking } from '../../../../providers';
import { ComponentProps, Layout, LayoutType, StylingCSS } from '../../../../types';
import type { SearchController, AutocompleteController, RecommendationController } from '@searchspring/snap-controller';

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

export const InlineBanner = withController<any>(
	withTracking(
		observer((properties: InlineBannerProps): JSX.Element => {
			const globalTheme: Theme = useTheme();

			const props: InlineBannerProps = {
				// default props
				layout: Layout.GRID,
				width: 'auto',
				// global theme
				...globalTheme?.components?.inlineBanner,
				// props
				...properties,
				...properties.theme?.components?.inlineBanner,
			};

			const { trackingRef, banner, disableStyles, className, width, layout, onClick, style } = props;

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
							onClick && onClick(e, banner);
						}}
						className={classnames('ss__inline-banner', `ss__inline-banner--${layout}`, className)}
						{...styling}
						ref={trackingRef}
						dangerouslySetInnerHTML={{
							__html: banner.value,
						}}
					/>
				</CacheProvider>
			) : (
				<Fragment></Fragment>
			);
		})
	)
);

export interface InlineBannerProps extends ComponentProps {
	banner: Banner;
	width?: string;
	layout?: LayoutType;
	onClick?: (e: React.MouseEvent, banner: Banner) => void;
	controller?: SearchController | AutocompleteController | RecommendationController;
}
