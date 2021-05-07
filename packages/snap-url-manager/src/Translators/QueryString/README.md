# QueryStringTranslator
### Introduction

This translator uses query strings with pushState (via History API) during navigation. All `UrlState` is read in and output via query parameters in the URL. This is accomplished via the `serialize` and `deserialize` methods.

```js
const queryTranslator = new QueryStringTranslator();

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

const url = queryTranslator.serialize(state);
console.log(url); // ?q=shoes&page=7&filter.color=red&filter.color=orange&filter.brand=adidas&filter.price.low=99.99&filter.price.high=299.99&sort.name=desc

```

As you can see, all of the parameters in the state become query parameters to be used in the URL. The inverse occurs when running the `deserialize` method - a URL is passed in and a state containing all of the parameters is returned.

```js
const url = '?q=shoes&page=7&filter.color=red&filter.color=orange&filter.brand=adidas&filter.price.low=99.99&filter.price.high=299.99&sort.name=desc';

const state = queryTranslator.deserialize(url);

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

### Configuration

| option | description | default value |
|---|---|:---:|
| queryParameter | used to specify a different query parameter for 'query' | 'q' |
| urlRoot | used to redirect to other URLs | ➖ |

<br>

`queryParameter` is the paremeter used to drive searches. By default, it's `'q'`, so the UrlManager's internal `query` value will be `'foo'` if the URL matches `?q=foo`.

`urlRoot` specifies a root URL to use when URLs are created in the `serialize` method.

Consider a website with a different query parameter:

```html
<form id="search" action="/search">
	<input type="text" name="search" />
	<input type="submit" value="Search" />
</form>
```

You would want to override the default `queryParameter` and `urlRoot` options during instantiation of the `QueryStringTranslator`:

```js
import { UrlManager, QueryStringTranslator } from '@searchspring/snap-url-manager';

const urlManager = new UrlManager(new QueryStringTranslator({ queryParameter: 'search', urlRoot: '/search' }));

urlManager.set({ query: 'green shirt' }).go();

console.log(urlManager.state.query); // green shirt
console.log(urlManager.href); // /search?search=green%20shirt
```
