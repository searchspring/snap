import { Fragment, h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { Theme, useTheme, CacheProvider } from '../../../../providers';
import { mergeProps, mergeStyles } from '../../../../utilities';
import type { Banner } from '@searchspring/snap-store-mobx';
import { useA11y } from '../../../../hooks/useA11y';
import { ComponentProps, StyleScript, ResultsLayout } from '../../../../types';

const defaultStyles: StyleScript<InlineBannerProps> = ({ width }) => {
	return css({
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
	});
};

export function InlineBanner(properties: InlineBannerProps): JSX.Element {
	const globalTheme: Theme = useTheme();
	const defaultProps: Partial<InlineBannerProps> = {
		layout: ResultsLayout.grid,
		width: 'auto',
	};

	const props = mergeProps('inlineBanner', globalTheme, defaultProps, properties);

	const { banner, className, disableA11y, layout, onClick } = props;

	const styling = mergeStyles<InlineBannerProps>(props, defaultStyles);

	return banner && banner.value ? (
		<CacheProvider>
			<div
				onClick={(e: React.MouseEvent<Element, MouseEvent>) => {
					onClick && onClick(e, banner);
				}}
				role={'article'}
				ref={(e) => (!disableA11y ? useA11y(e) : null)}
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
	layout?: keyof typeof ResultsLayout | ResultsLayout;
	onClick?: (e: React.MouseEvent, banner: Banner) => void;
	disableA11y?: boolean;
}
