import { h } from 'preact';
import { CacheProvider as EmotionCacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import type { EmotionCache } from '@emotion/cache';

const emotionCache = createCache({
	key: 'ss',
	prepend: true,
});

export const CacheProvider = (props: { cache?: EmotionCache; children: any }): JSX.Element => {
	return <EmotionCacheProvider value={props.cache || emotionCache}>{props.children}</EmotionCacheProvider>;
};
