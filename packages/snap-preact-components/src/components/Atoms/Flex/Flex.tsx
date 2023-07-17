/** @jsx jsx */
import { ComponentChildren, h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, StylingCSS } from '../../../types';

const _CSS = {
	flex: ({ flex, flexDirection, textAlign, flexBasis, flexGrow, flexShrink, gap, item, justifyContent, width, height }: FlexProps) =>
		css({
			display: item ? undefined : 'flex',
			width,
			height,
			flexDirection,
			textAlign: textAlign ? (textAlign as any) : undefined,
			flexBasis,
			flexGrow,
			flexShrink,
			gap,
			justifyContent,
			flex,
		}),
};

export const Flex = observer((properties: FlexProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const props: FlexProps = {
		// default props

		// global theme
		...globalTheme?.components?.flex,
		// props
		...properties,
		...properties.theme?.components?.flex,
	};
	const {
		children,
		flex,
		flexDirection,
		textAlign,
		flexBasis,
		flexGrow,
		flexShrink,
		gap,
		item,
		justifyContent,
		width,
		height,
		disableStyles,
		className,
		style,
	} = props;

	const styling: { css?: StylingCSS } = {};

	if (!disableStyles) {
		styling.css = [_CSS.flex({ flex, flexDirection, textAlign, flexBasis, flexGrow, flexShrink, gap, item, justifyContent, width, height }), style];
	} else if (style) {
		styling.css = [style];
	}

	return (
		<CacheProvider>
			<div {...styling} className={classnames(item ? 'ss__flex-item' : 'ss__flex', className)}>
				{children}
			</div>
		</CacheProvider>
	);
});

export interface FlexProps extends ComponentProps {
	children?: ComponentChildren;
	width?: string;
	height?: string;
	justifyContent?: string;
	flex?: string;
	flexDirection?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
	flexGrow?: number;
	flexShrink?: number;
	flexBasis?: string;
	textAlign?: string;
	gap?: string;
	item?: boolean;
}
