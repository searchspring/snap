/** @jsx jsx */
import { h } from 'preact';

import { useState, useEffect, useRef } from 'preact/hooks';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';

import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps } from '../../../types';

export const FALLBACK_IMAGE_URL = '//cdn.searchspring.net/ajax_search/img/default_image.png';

const CSS = {
	image: ({ visibility }) =>
		css({
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			height: 'auto',
			'& img': {
				visibility,
				flexShrink: '0',
				objectFit: 'contain',
				maxWidth: '100%',
				maxHeight: '100%',
			},
		}),
};

export function Image(properties: ImageProps): JSX.Element {
	const globalTheme: Theme = useTheme();

	const props: ImageProps = {
		// default props
		fallback: FALLBACK_IMAGE_URL,
		lazy: true,
		// global theme
		...globalTheme?.components?.image,
		// props
		...properties,
		...properties.theme?.components?.image,
	};

	const { alt, src, fallback, hoverSrc, lazy, onMouseOver, onMouseOut, onLoad, onClick, disableStyles, className, style } = props;

	const [visibility, setVisibility] = useState('hidden');
	const [isHovering, setHover] = useState(false);

	const prevSrcRef = useRef('');
	useEffect(() => {
		prevSrcRef.current = src;
	});
	if (prevSrcRef.current && prevSrcRef.current != src) {
		setVisibility('hidden');
	}

	const styling: { css?: any } = {};
	if (!disableStyles) {
		styling.css = [CSS.image({ visibility }), style];
	} else if (style) {
		styling.css = [style];
	}
	return (
		<CacheProvider>
			<div {...styling} className={classnames('ss__image', className)}>
				<img
					src={(isHovering ? hoverSrc : src) || fallback}
					alt={alt}
					title={alt}
					loading={lazy ? 'lazy' : undefined}
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
			</div>
		</CacheProvider>
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
	lazy?: boolean;
}
