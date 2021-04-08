import { h } from 'preact';
import { useRef, useEffect } from 'preact/hooks';

import classnames from 'classnames';

import { Theme, useTheme } from '../../../providers/theme';
import { ComponentProps } from '../../../types';

export const FALLBACK_IMAGE_URL = '//cdn.searchspring.net/ajax_search/img/default_image.png';

//if the product image link is bad, it will run this code
function handleImageError(ImgRef: preact.RefObject<HTMLElement>, fallback?: string) {
	const source = ImgRef.current as HTMLImageElement;
	if (source) {
		const imgSRC = source.src;
		// if you pass in a relative fallback, we need to add the host url check against or it will loop forever
		if (source.src === 'https://' + window.location.host + '/' + fallback || source.src === 'http://' + window.location.host + '/' + fallback) {
			fallback = FALLBACK_IMAGE_URL;
		}
		if (fallback && imgSRC === fallback) {
			source.src = FALLBACK_IMAGE_URL;
		} else if (imgSRC === FALLBACK_IMAGE_URL) {
			source.removeAttribute('onError');
			source.src = '';
		} else {
			source.src = fallback ? fallback : FALLBACK_IMAGE_URL;
		}
	}
}

function swapImgUrl(ImgRef: preact.RefObject<HTMLElement>, newUrl?: string) {
	const source = ImgRef.current as HTMLImageElement;
	if (source && newUrl) {
		source.src = newUrl;
	}
}

function setVisibility(ImgRef: preact.RefObject<HTMLElement>, visibility: string = null) {
	const source = ImgRef.current as HTMLImageElement;
	if (source) {
		source.style.visibility = visibility;
	}
}

export function Image(properties: ImageProps): JSX.Element {
	const globalTheme: Theme = useTheme();

	const props: ImageProps = {
		// default props
		disableStyles: false,
		fallback: FALLBACK_IMAGE_URL,
		// global theme
		...globalTheme?.components?.image,
		// props
		...properties,
		...properties.theme?.components?.image,
	};

	const { alt, src, hoverSrc, onMouseOver, onMouseOut, onLoad, onClick, disableStyles, className, style } = props;
	let { fallback } = props;

	const ImgRef = useRef(null);

	useEffect(() => {
		setVisibility(ImgRef, 'hidden');
	}, [src]);

	//this is mainly for storybook bug
	if ((fallback && typeof fallback !== 'string') || !fallback) {
		fallback = FALLBACK_IMAGE_URL;
	}

	return (
		<img
			style={!disableStyles && style}
			className={classnames('ss-image', className)}
			src={src || fallback}
			alt={alt}
			title={alt}
			ref={ImgRef}
			loading="lazy"
			onLoad={() => {
				setVisibility(ImgRef);
				onLoad && onLoad();
			}}
			onClick={onClick}
			onError={() => handleImageError(ImgRef, fallback)}
			onMouseOver={(e) => {
				onMouseOver && onMouseOver(e);
				hoverSrc && swapImgUrl(ImgRef, hoverSrc);
			}}
			onMouseOut={(e) => {
				onMouseOut && onMouseOut(e);
				hoverSrc && swapImgUrl(ImgRef, src);
			}}
		/>
	);
}

export interface ImageProps extends ComponentProps {
	alt: string;
	src: string;
	fallback?: string;
	hoverSrc?: string;
	onMouseOver?: (e: Event) => void;
	onMouseOut?: (e: Event) => void;
	onLoad?: () => void;
	onClick?: (e: Event) => void;
}
