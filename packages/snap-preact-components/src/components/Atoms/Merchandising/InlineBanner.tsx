/** @jsx jsx */
import { h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';

import { InlineBannerContent } from '../../../types';
import { Theme, useTheme } from '../../../providers/theme';
import { ComponentProps } from '../../../types';
import { LayoutType } from '../../../types';

const CSS = {
	inlineBanner: ({ width, style }) => css ({
		height: '100%',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		maxWidth: width ? "initial" : '260px',
		width: width || "auto",

		'& iframe': {
			maxWidth: '100%',
		},
		...style,
	}),
	
	list: () => css({
		flexDirection: 'row',
		display:"block",
		width: "100%",
	}),

	grid: () => css({
		flexDirection: 'column',
	}),

};

export function InlineBanner(properties: InlineBannerProps): JSX.Element {
	const globalTheme: Theme = useTheme();

	const props: InlineBannerProps = {
		// default props
		disableStyles: false,
		layout: "grid",
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
				className={classnames('ss-inlineBanner', className)}
				css={!disableStyles && css`${CSS.inlineBanner({ width, style })} ${CSS[layout]()}`}
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
