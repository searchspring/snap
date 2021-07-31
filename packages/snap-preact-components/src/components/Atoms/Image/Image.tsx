/** @jsx jsx */
import { h } from 'preact';

import { useState } from 'preact/hooks';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';

import { Theme, useTheme } from '../../../providers';
import { ComponentProps } from '../../../types';

export const FALLBACK_IMAGE_URL = '//cdn.searchspring.net/ajax_search/img/default_image.png';

const CSS = {
	image: ({ visibility, style }) =>
		css({
			visibility,
			...style,
		}),
};

export function Image(properties: ImageProps): JSX.Element {
	const globalTheme: Theme = useTheme();

	const props: ImageProps = {
		// default props
		fallback: FALLBACK_IMAGE_URL,
		// global theme
		...globalTheme?.components?.image,
		// props
		...properties,
		...properties.theme?.components?.image,
	};

	const { alt, src, fallback, hoverSrc, onMouseOver, onMouseOut, onLoad, onClick, disableStyles, className, style } = props;

	const [visibility, setVisibility] = useState('hidden');
	const [isHovering, setHover] = useState(false);

	return (
		<img
			css={!disableStyles && CSS.image({ visibility, style })}
			className={classnames('ss__image', className)}
			src={(isHovering ? hoverSrc : src) || fallback}
			alt={alt}
			title={alt}
			loading="lazy"
			onLoad={() => {
				setVisibility('visible');
				onLoad && onLoad();
			}}
			onClick={(e) => onClick && onClick(e as any)}
			onError={(e) => ((e.target as HTMLImageElement).src = fallback)}
			onMouseOver={(e) => {
				hoverSrc && setHover(true);
				onMouseOver && onMouseOver(e as any);
			}}
			onMouseOut={(e) => {
				hoverSrc && setHover(false);
				onMouseOut && onMouseOut(e as any);
			}}
		/>
	);
}

export interface ImageProps extends ComponentProps {
	alt: string;
	src: string;
	fallback?: string;
	hoverSrc?: string;
	onMouseOver?: (e: MouseEvent) => void;
	onMouseOut?: (e: MouseEvent) => void;
	onLoad?: () => void;
	onClick?: (e: MouseEvent) => void;
}
