# UrlTranslator

The `UrlTranslator` translator uses query strings and hash fragments in combination with pushState (via History API) during navigation. `UrlState` is read in and output via query parameters and hash fragments in the URL. This is accomplished via the `serialize` and `deserialize` methods.

```js
const urlTranslator = new UrlTranslator();

const state = {
	filter: {
		color: ['red', 'orange'],
		brand: ['adidas'],
		price: [{ low: 99.99, high: 299.99 }],
	},
	page: 7,
	query: 'shoes',
	sort: [
		{
			field: 'name',
			direction: 'desc',
		},
	],
};

const url = urlTranslator.serialize(state);
console.log(url); // ?q=shoes&page=7#/filter:color:red/filter:color:orange/filter:brand:adidas/filter:price:99.99:299.99/sort:name:desc

```

As you can see, some of the parameters in the state become query parameters, and others hash fragments. The inverse occurs when running the `deserialize` method - a URL is passed in and a state containing all of the parameters is returned.

```js
const url = '?q=shoes&page=7#/filter:color:red/filter:color:orange/filter:brand:adidas/filter:price:99.99:299.99/sort:name:desc';

const state = urlTranslator.deserialize(url);

console.log(state);
/*
{
	filter: {
		color: ['red', 'orange'],
		brand: ['adidas'],
		price: [{ low: 99.99, high: 299.99 }],
	},
	page: 7,
	query: 'shoes',
	sort: [
		{
			field: 'name',
			direction: 'desc',
		},
	],
}
*/
```

The `serialize` and `deserialize` methods are abstracted away by the `UrlManager` and will typically never be used in this way, but have been included here for insight.

## Configuration

| option | description | default value |
|---|---|:---:|
| urlRoot | used to redirect to other URLs | ➖ |
| settings.corePrefix | specify a prefix to all core parameters | ➖ |
| settings.coreType | quickly change the type of all core parameters | ➖ |
| settings.customType | specify how custom parameters should be serialized | 'hash' |
| settings.serializeUrlRoot | sets parameters found within urlRoot to global state in UrlManager | true |
| parameters.core | optional mapping of core param names and types  | ➖ |
| parameters.custom | optional mapping of custom param types | ➖ |

<br>


### Core Parameter Configuration

Default core parameter configuration:
```javascript
query: { name: 'q', type: 'query' },
oq: { name: 'oq', type: 'query' },
rq: { name: 'rq', type: 'query' },
tag: { name: 'tag', type: 'query' },
page: { name: 'page', type: 'query' },
pageSize: { name: 'pageSize', type: 'hash' },
sort: { name: 'sort', type: 'hash' },
filter: { name: 'filter', type: 'hash' },
```

All of the core parameters can be fully customized via the `parameters.core` configuration. For example, the `query` core parameter by default is named `'q'` and is set as a `query` parameter type. This could be changed to any query name and either `hash` or `query` parameter type.

```js
import { UrlManager, UrlTranslator } from '@searchspring/snap-url-manager';

const urlManager = new UrlManager(
	new UrlTranslator({
		urlRoot: '/search.html',
		parameters: {
			core: {
				query: { name: 'thequery' },
				page: { name: 'p', type: 'hash' },
			},
		},
	})
);

const setUrlManager = urlManager.set({ query: 'blue shoe', page: 3 });

console.log(setUrlManager.href); // /search.html?thequery=blue%20shoe#/p:3

```

If you wanted to make all of the core parameters `query` or `hash` types, you could do so individually as shown above, or as a whole utilizing the `settings.coreType` configuration. Individual type configurations under `parameters.core` override the `coreType`.

The `settings.corePrefix` configuration allows for all of the core parameters to be prefixed with a string. This adds the specified prefix to the default or custom name configuration for each core parameter.

```js
import { UrlManager, UrlTranslator } from '@searchspring/snap-url-manager';

const urlManager = new UrlManager(
	new UrlTranslator({
		urlRoot: '/search.html',
		settings: {
			coreType: 'hash',
			corePrefix: 'ss-',
		},
		parameters: {
			core: {
				query: { name: 'que' },
				page: { name: 'p' },
			},
		},
	})
);

const setUrlManager = urlManager.set({ query: 'bright', page: 3, filter: { color: ['blue'] } });

console.log(setUrlManager.href); // /search.html#/ss-que:bright/ss-p:3/ss-filter:color:blue

```

### Custom Parameter Configuration

A custom parameter is any non-core parameter. The `UrlTranslator` will automatically determine how to handle parameters found in the URL when it is initialized. However for parameters that do not yet exist, the default behavior is to treat them as hash fragments. This can be customized using the `settings.customType` configuration. In the example below, the 'view' custom parameter is set as a `query` type and the 'store' custom parameter is set to a `hash` type (default `customType` setting of 'hash').

```js
import { UrlManager, UrlTranslator } from '@searchspring/snap-url-manager';

const urlManager = new UrlManager(
	new UrlTranslator({
		urlRoot: '/search',
		parameters: {
			custom: {
				view: { type: 'query' },
			},
		},
	})
);

const setUrlManager = urlManager.set({ store: 'products', view: 'spring' });

console.log(setUrlManager.state.store); // products
console.log(setUrlManager.state.view); // spring
console.log(setUrlManager.href); // /search?view=spring#/store:products

```

### urlRoot Configuration

`urlRoot` specifies a root URL to use when URLs are created in the `serialize` method. By default any parameters in the `urlRoot` will be preserved and added to the final serialized URL; this can be disabled by setting the `settings.serializeUrlRoot` configuration to `false`.

```js
import { UrlManager, UrlTranslator } from '@searchspring/snap-url-manager';

const urlManager = new UrlManager(
	new UrlTranslator({
		urlRoot: '/search?view=shop',
		parameters: {
			core: {
				query: { name: 'search' },
			},
		},
	})
);

const queriedUrlManager = urlManager.set({ query: 'green shirt', filter: { color: ['green'] } });

console.log(queriedUrlManager.state.query); // green shirt
console.log(queriedUrlManager.href); // /search?view=shop&search=green%20shirt#/filter:color:green
```
