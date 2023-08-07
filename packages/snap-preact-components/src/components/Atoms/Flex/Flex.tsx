/** @jsx jsx */
import { ComponentChildren, h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, StylingCSS } from '../../../types';
import { mergeProps } from '../../../utilities';

const _CSS = {
	flex: ({
		flex,
		flexDirection,
		textAlign,
		flexBasis,
		flexGrow,
		flexShrink,
		flexWrap,
		flexFlow,
		gap,
		rowGap,
		columnGap,
		item,
		justifyContent,
		alignItems,
		alignContent,
		alignSelf,
		width,
		height,
	}: FlexProps) =>
		css({
			display: item ? undefined : 'flex',
			width,
			height,
			flexDirection,
			textAlign: textAlign ? (textAlign as any) : undefined,
			flexBasis,
			flexGrow,
			flexShrink,
			flexWrap,
			flexFlow,
			gap,
			rowGap,
			columnGap,
			justifyContent,
			alignItems,
			alignContent,
			alignSelf,
			flex,
		}),
};

export const Flex = observer((properties: FlexProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const defaultProps: Partial<FlexProps> = {};

	const props = mergeProps('flex', globalTheme, defaultProps, properties);

	const {
		children,
		flex,
		flexDirection,
		textAlign,
		flexBasis,
		flexGrow,
		flexShrink,
		flexWrap,
		flexFlow,
		gap,
		rowGap,
		columnGap,
		item,
		justifyContent,
		alignItems,
		alignContent,
		alignSelf,
		width,
		height,
		disableStyles,
		className,
		style,
	} = props;

	const styling: { css?: StylingCSS } = {};

	if (!disableStyles) {
		styling.css = [
			_CSS.flex({
				flex,
				flexDirection,
				textAlign,
				flexBasis,
				flexGrow,
				flexShrink,
				flexWrap,
				flexFlow,
				gap,
				rowGap,
				columnGap,
				item,
				justifyContent,
				alignItems,
				alignContent,
				alignSelf,
				width,
				height,
			}),
			style,
		];
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
	alignItems?: string;
	alignContent?: string;
	alignSelf?: string;
	justifyContent?: string;
	flex?: string;
	flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
	flexFlow?: string;
	flexDirection?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
	flexGrow?: number | string;
	flexShrink?: number | string;
	flexBasis?: string;
	textAlign?: string;
	gap?: string;
	rowGap?: string;
	columnGap?: string;
	item?: boolean;
}
