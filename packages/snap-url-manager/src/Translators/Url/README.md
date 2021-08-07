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

The `serialize` and `deserialize` methods are abstracted away by the `UrlManager` and will typically never be used in this way, but have been included in here for insight.

## Configuration

| option | description | default value |
|---|---|:---:|
| queryParameter | used to specify a different query parameter for 'query' | 'q' |
| urlRoot | used to redirect to other URLs | ➖ |
| parameters.hash | used to tell the translator how to handle custom state | ➖ |
| parameters.search | used to tell the translator how to handle custom state | ➖ |

<br>

The `UrlTranslator` will automatically determine how to handle parameters found in the URL when it is initialized. However for parameters that do not yet exist the default behavior is to treat them as hash fragments. This can be customized using the `parameters` configuration.

```js
import { UrlManager, UrlTranslator } from '@searchspring/snap-url-manager';

const urlManager = new UrlManager(new UrlTranslator({ parameters: { hash: ['store'], search: ['view'] } }));

const setUrlManager = urlManager.set({ store: 'products', view: 'spring' });

console.log(setUrlManager.state.store); // products
console.log(setUrlManager.state.view); // spring
console.log(setUrlManager.href); // /search?view=spring#/store:products

```

The `queryParameter` is the paremeter used to drive searches. By default, it's `'q'`, so the UrlManager's internal `query` value will be `'foo'` if the URL matches `?q=foo`.

`urlRoot` specifies a root URL to use when URLs are created in the `serialize` method.

Consider a website with a different query parameter:

```html
<form id="search" action="/search">
	<input type="text" name="search" />
	<input type="submit" value="Search" />
</form>
```

You would want to override the default `queryParameter` and `urlRoot` options during instantiation of the `UrlTranslator`:

```js
import { UrlManager, UrlTranslator } from '@searchspring/snap-url-manager';

const urlManager = new UrlManager(new UrlTranslator({ queryParameter: 'search', urlRoot: '/search' }));

const queriedUrlManager = urlManager.set({ query: 'green shirt' });

console.log(queriedUrlManager.state.query); // green shirt
console.log(queriedUrlManager.href); // /search?search=green%20shirt
```
