/** @jsx jsx */
import { ComponentChildren, h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { Theme, useTheme, CacheProvider } from '../../../../providers';
import { ComponentProps, StylingCSS } from '../../../../types';
import { mergeProps } from '../../../../utilities';

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
	}: ContainerProps) =>
		css({
			display: item ? undefined : 'flex',
			width,
			height,
			flexDirection,
			textAlign: textAlign ? (textAlign as any) : undefined,
			flexBasis: flexBasis ? (flexBasis as any) : undefined,
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

export const Container = observer((properties: ContainerProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const defaultProps: Partial<ContainerProps> = {};

	const props = mergeProps('container', globalTheme, defaultProps, properties);

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
		href,
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
			{href ? (
				<a {...styling} href={href} className={classnames(item ? 'ss__container-item' : 'ss__container', className)}>
					{children}
				</a>
			) : (
				<div {...styling} className={classnames(item ? 'ss__container-item' : 'ss__container', className)}>
					{children}
				</div>
			)}
		</CacheProvider>
	);
});

export interface ContainerProps extends ComponentProps {
	children?: ComponentChildren;
	width?: string | number;
	height?: string | number;
	alignItems?:
		| 'normal'
		| 'stretch'
		| 'center'
		| 'start'
		| 'end'
		| 'flex-start'
		| 'flex-end'
		| 'self-start'
		| 'self-end'
		| 'baseline'
		| 'first baseline'
		| 'last baseline'
		| 'safe center'
		| 'unsafe center'
		| 'inherit'
		| 'initial'
		| 'revert'
		| 'revert-layer'
		| 'unset';
	alignContent?:
		| 'center'
		| 'start'
		| 'end'
		| 'flex-start'
		| 'flex-end'
		| 'normal'
		| 'baseline'
		| 'first baseline'
		| 'last baseline'
		| 'space-between'
		| 'space-around'
		| 'space-evenly'
		| 'stretch'
		| 'safe center'
		| 'unsafe center'
		| 'inherit'
		| 'initial'
		| 'revert'
		| 'revert-layer'
		| 'unset';
	flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
	flexDirection?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
	flexGrow?: number | 'inherit' | 'initial' | 'revert' | 'revert-layer' | 'unset';
	flexShrink?: number | 'inherit' | 'initial' | 'revert' | 'revert-layer' | 'unset';
	alignSelf?:
		| 'auto'
		| 'normal'
		| 'center'
		| 'start'
		| 'end'
		| 'self-start'
		| 'self-end'
		| 'flex-start'
		| 'flex-end'
		| 'baseline'
		| 'first baseline'
		| 'last baseline'
		| 'stretch'
		| 'safe center'
		| 'unsafe center'
		| 'inherit'
		| 'initial'
		| 'revert'
		| 'revert-layer'
		| 'unset';
	flexFlow?:
		| 'row'
		| 'row-reverse'
		| 'column'
		| 'column-reverse'
		| 'nowrap'
		| 'wrap'
		| 'wrap-reverse'
		| 'row nowrap'
		| 'column wrap'
		| 'column-reverse wrap-reverse'
		| 'inherit'
		| 'initial'
		| 'revert'
		| 'revert-layer'
		| 'unset';
	justifyContent?:
		| 'center'
		| 'start'
		| 'end'
		| 'flex-start'
		| 'flex-end'
		| 'left'
		| 'right'
		| 'normal'
		| 'space-between'
		| 'space-around'
		| 'space-evenly'
		| 'stretch'
		| 'safe center'
		| 'unsafe center'
		| 'inherit'
		| 'initial'
		| 'revert'
		| 'revert-layer'
		| 'unset';
	flex?: string | number;
	flexBasis?: string | number;
	textAlign?: 'left' | 'right' | 'center' | 'justify' | 'initial' | 'inherit';
	gap?: string | number;
	rowGap?: string | number;
	columnGap?: string | number;
	item?: boolean;
	href?: string;
}
