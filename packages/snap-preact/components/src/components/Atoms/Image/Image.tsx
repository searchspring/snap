import { h } from 'preact';

import { useState, useEffect, useRef } from 'preact/hooks';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';

import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, RootNodeProperties } from '../../../types';
import { mergeProps } from '../../../utilities';

export const FALLBACK_IMAGE_URL = '//cdn.searchspring.net/ajax_search/img/default_image.png';

const CSS = {
	image: ({ visibility }: Partial<ImageProps> & { visibility: string }) =>
		css({
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			height: 'auto',
			'& img': {
				visibility: visibility as React.CSSProperties['visibility'],
				flexShrink: '0',
				objectFit: 'contain',
				maxWidth: '100%',
				maxHeight: '100%',
			},
		}),
};

export function Image(properties: ImageProps): JSX.Element {
	const globalTheme: Theme = useTheme();
	const defaultProps: Partial<ImageProps> = {
		fallback: FALLBACK_IMAGE_URL,
		lazy: true,
	};

	const props = mergeProps('image', globalTheme, defaultProps, properties);

	const { alt, src, fallback, hoverSrc, lazy, onMouseOver, onMouseOut, onError, onLoad, onClick, disableStyles, className, style, styleScript } =
		props;

	const [visibility, setVisibility] = useState('hidden');
	const [isHovering, setHover] = useState(false);

	const prevSrcRef = useRef('');
	useEffect(() => {
		prevSrcRef.current = src;
	});
	if (prevSrcRef.current && prevSrcRef.current != src) {
		setVisibility('hidden');
	}

	const styling: RootNodeProperties = { 'ss-name': props.name };
	const stylingProps = { ...props, visibility };

	if (styleScript && !disableStyles) {
		styling.css = [styleScript(stylingProps), style];
	} else if (!disableStyles) {
		styling.css = [CSS.image(stylingProps), style];
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
					onLoad={(e: React.MouseEvent<HTMLImageElement>) => {
						setVisibility('visible');
						onLoad && onLoad(e);
					}}
					onClick={(e: React.MouseEvent<HTMLImageElement>) => onClick && onClick(e)}
					onError={(e: React.MouseEvent<HTMLImageElement>) => {
						(e.target as HTMLImageElement).src = fallback || '';
						onError && onError(e);
					}}
					onMouseOver={(e: React.MouseEvent<HTMLImageElement>) => {
						hoverSrc && setHover(true);
						onMouseOver && onMouseOver(e);
					}}
					onMouseOut={(e: React.MouseEvent<HTMLImageElement>) => {
						hoverSrc && setHover(false);
						onMouseOut && onMouseOut(e);
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
	onMouseOver?: (e: React.MouseEvent<HTMLImageElement>) => void;
	onMouseOut?: (e: React.MouseEvent<HTMLImageElement>) => void;
	onError?: (e: React.MouseEvent<HTMLImageElement>) => void;
	onLoad?: (e: React.MouseEvent<HTMLImageElement>) => void;
	onClick?: (e: React.MouseEvent<HTMLImageElement>) => void;
	lazy?: boolean;
}
