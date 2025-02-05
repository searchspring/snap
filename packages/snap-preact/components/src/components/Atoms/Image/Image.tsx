import { h } from 'preact';

import { useState, useEffect, useRef } from 'preact/hooks';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';

import { Theme, useTheme, CacheProvider, useTreePath } from '../../../providers';
import { ComponentProps, StyleScript } from '../../../types';
import { mergeProps, mergeStyles } from '../../../utilities';

export const FALLBACK_IMAGE_URL = '//cdn.searchspring.net/ajax_search/img/default_image.png';

const defaultStyles: StyleScript<ImageProps> = () => {
	return css({
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		height: 'auto',
		'& img': {
			flexShrink: '0',
			objectFit: 'contain',
			maxWidth: '100%',
			maxHeight: '100%',
		},

		'&.ss__image--hidden': {
			'& img': {
				visibility: 'hidden',
			},
		},
	});
};

export function Image(properties: ImageProps): JSX.Element {
	const globalTheme: Theme = useTheme();
	const globalTreePath = useTreePath();

	const defaultProps: Partial<ImageProps> = {
		fallback: FALLBACK_IMAGE_URL,
		lazy: true,
		treePath: globalTreePath,
	};

	const props = mergeProps('image', globalTheme, defaultProps, properties);

	const { alt, src, fallback, hoverSrc, lazy, onMouseOver, onMouseOut, onError, onLoad, onClick, className } = props;

	const [visibile, setVisibile] = useState(false);
	const [isHovering, setHover] = useState(false);

	const prevSrcRef = useRef('');
	useEffect(() => {
		prevSrcRef.current = src;
	});
	if (prevSrcRef.current && prevSrcRef.current != src) {
		setVisibile(false);
	}

	const styling = mergeStyles<ImageProps>(props, defaultStyles);

	return (
		<CacheProvider>
			<div {...styling} className={classnames('ss__image', { 'ss__image--hidden': !visibile }, className)}>
				<img
					src={(isHovering ? hoverSrc : src) || fallback}
					alt={alt}
					title={alt}
					loading={lazy ? 'lazy' : undefined}
					onLoad={(e: React.MouseEvent<HTMLImageElement>) => {
						setVisibile(true);
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
