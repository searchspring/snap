/** @jsx jsx */
import { h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';

import { InlineBannerContent } from '../../../types';
import { Theme, useTheme } from '../../../providers/theme';
import { ComponentProps } from '../../../types';

const CSS = {
	inlineBanner: ({ style }) =>
		css({
			width: '100%',
			height: '100%',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
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
		disableStyles: false,
		banner: {},
		// global theme
		...globalTheme?.components?.banner,
		// props
		...properties,
		...properties.theme?.components?.banner,
	};

	const { banner, disableStyles, className, style } = props;

	return (
		banner &&
		banner.value && (
			<div
				className={classnames('ss-inlineBanner', className)}
				css={!disableStyles && CSS.inlineBanner({ style })}
				dangerouslySetInnerHTML={{
					__html: banner.value,
				}}
			/>
		)
	);
}

export interface InlineBannerProps extends ComponentProps {
	banner: InlineBannerContent;
}
