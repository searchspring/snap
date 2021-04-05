# Query string w/ pushState

### Introduction

This translator uses query strings with pushState (via History API) during navigation.

### Configuration

This translator has one configuration option: `queryParameter` . This is the paremeter used to drive searches. By default, it's `'q'`, so the UrlManager's internal `query` value will be `'foo'` if the URL matches `?q=foo`

Consider a website with a different query parameter:

```html
<form id="search" action="/search">
	<input type="text" name="search" />
	<input type="submit" value="Search" />
</form>
```

You would want to override the default queryParameter option:

```js
import {
	UrlManager,
	QueryStringTranslator,
} from '@searchspring/snap-url-manager';

class MyTranslator extends QueryStringTranslator {
	getConfig() {
		/* While this translator has 1 configuration option, it's good practice to extend the
		   default configuration object instead of returning a new one.*/
		return {
			...super.getConfig(),
			queryParameter: 'search',
		};
	}
}

const urlManager = new UrlManager(new MyTranslator());

urlManager.set({ query: 'green shirt' }).go();

console.log(urlManager.state.query); // green shirt
console.log(window.location.search); // ?search=green%20shirt
```
