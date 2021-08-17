/** @jsx jsx */
import { h } from 'preact';

import { useState } from 'preact/hooks';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';

import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps } from '../../../types';

export const FALLBACK_IMAGE_URL = '//cdn.searchspring.net/ajax_search/img/default_image.png';

const CSS = {
	image: ({ visibility, maxHeight, style }) =>
		css({
			height: maxHeight,
			'& img': {
				visibility,
				maxWidth: '100%',
				maxHeight: '100%',
				width: 'auto',
				height: 'auto',
				position: 'absolute',
				left: '50%',
				right: '50%',
				top: '50%',
				bottom: '50%',
				transform: 'translate(-50%, -50%)',
			},
			...style,
		}),
};

export function Image(properties: ImageProps): JSX.Element {
	const globalTheme: Theme = useTheme();

	const props: ImageProps = {
		// default props
		fallback: FALLBACK_IMAGE_URL,
		maxHeight: '320px',
		// global theme
		...globalTheme?.components?.image,
		// props
		...properties,
		...properties.theme?.components?.image,
	};

	const { alt, src, fallback, hoverSrc, maxHeight, onMouseOver, onMouseOut, onLoad, onClick, disableStyles, className, style } = props;

	const [visibility, setVisibility] = useState('hidden');
	const [isHovering, setHover] = useState(false);

	return (
		<CacheProvider>
			<div css={!disableStyles && CSS.image({ visibility, maxHeight, style })} className={classnames('ss__image', className)}>
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
	maxHeight?: string;
	onMouseOver?: (e: MouseEvent) => void;
	onMouseOut?: (e: MouseEvent) => void;
	onLoad?: () => void;
	onClick?: (e: MouseEvent) => void;
}
