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
			height: '100%',
			'& img': {
				visibility,
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
		// global theme
		...globalTheme?.components?.image,
		// props
		...properties,
		...properties.theme?.components?.image,
	};

	const { alt, src, fallback, hoverSrc, onMouseOver, onMouseOut, onLoad, onClick, disableStyles, className, style } = props;

	const [visibility, setVisibility] = useState('hidden');
	const [isHovering, setHover] = useState(false);

	const prevSrcRef = useRef();
	useEffect(() => {
		prevSrcRef.current = src;
	});
	if (prevSrcRef.current && prevSrcRef.current != src) {
		setVisibility('hidden');
	}
	return (
		<CacheProvider>
			<div css={!disableStyles ? [CSS.image({ visibility }), style] : [style]} className={classnames('ss__image', className)}>
				<img
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
}
