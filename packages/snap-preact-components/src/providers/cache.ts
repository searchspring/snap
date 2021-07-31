export { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';

export const cache = createCache({
	key: 'ss',
	prepend: true,
});
