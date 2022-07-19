# Snap URL Manager


The Snap URL manager is a service that provides customizable frontend URL management and a means to subscribe to the URL for changes. It's primary purpose is to provide a standard API to manage URL across Snap products.

## Installation

```sh
npm install --save-dev @searchspring/url-manager
```

## Import

```js
import { UrlManager, UrlTranslator } from '@searchspring/url-manager';
```

## Instantiation

The UrlManager class takes one parameter. This is the translator that manages your URL scheme, as well as rules for updating the URL. For now, we'll use the included translator that uses query strings and hash fragments and utilizes pushState to modify the URL in the browser.

See [Translators](https://github.com/searchspring/snap/tree/main/packages/snap-url-manager/src/Translators) for more info.

```js
const urlManager = new UrlManager(new UrlTranslator());
```

Depending on the translator, the instantiated url manager will automatically start tracking from the browser URL.

## Navigate to another location using transforms.

Let's add a new parameter, `page=2`, to the browser's address bar.

```js
urlManager.merge({ page: 2 }).go();
```

In this example, we first created a new url manager with internal state that reflects `page=2` . Url managers are never directly modified, but when merging or setting parameters, a new url manager is created with a new state.

We then updated the browser's address bar using `urlManager.go()` on the newly created url manager. Since the query string config translator is utilizing `location.pushState` behind the scenes,
this is the mechanism behind which the browsers address bar is updated in this example.

There are three functions to update one or more URL parameters: `set`, `merge` and `remove` . These functions are called transforms.

When using `set`, other parameters will be clobbered and the URL will be set to exactly match the object passed in. All transforms can specify a path as the first parameter.

Paths can be expressed in either of these formats:
`'some.longer.path'` or `['some', 'longer', 'path']`

Therefore, you can also accomplish this same transformation with the following:

```js
const newManager = urlManager.set('page', 2);
```

The page parameter can be removed with the following:

```js
const newManager = urlManager.remove('page');
```

Setting a value in a longer, nested path would look like this:

```js
const newManager = urlManager.set('filter.color', 'blue');
```

This will produce 1 value for `filter.color` and remove any others.

For multiple values:

```js
const newManager = urlManager
	.merge('filter.color', 'blue')
	.merge('filter.color', 'red');
```

## `href` property

You can access a url manager's href property at any time with

```js
urlManager.href;
```

## Many copies

There may be cases where you want multiple URL states stored for various purposes. Since
`set`, `merge`, and `remove` create modified copies, instances can be created and utilized from multiple sources. Snap `stores` already handle the process of attaching `UrlManager' instances where needed, for example for pagination, facets, sorting, etc... Here is an example of how creating them for a facet's individual values might look:

```js
const facetValuesWithUrls = (facet, facetValues) => {
	return facetValues.map((facetValue) => {
		return {
			...facetValue,
			url: urlManager.merge(['filter', facet.field], facetValue.value),
		};
	});
};
```

Now, you can pass these as props to a Preact component:

```js
class FacetValue {
	render({ facet, value }) {
		return (
			<li>
				<a
					href={ value.url.href }
					onClick={(ev) => {
						ev.preventDefault();

						value.url.go();
					}}
				>
					{value.label}
				</a>
			</li>
		);
	}
}
```

Since the `UrlTranslator` is utilizing `pushState` it is important to prevent the default behavior as shown in the `onClick` above. Each translator can be instantiated with a `Linker` to make this even easier:

```js
import { UrlManager, UrlTranslator, reactLinker } from '@searchspring/snap-url-manager';
const urlManager = new UrlManager(new UrlTranslator(), reactLinker);
```

```js
class FacetValue {
	render({ facet, value }) {
		return (
			<li>
				<a {...value.url.link}>{value.label}</a>
			</li>
		);
	}
}
```

See [Linkers](https://github.com/searchspring/snap/tree/main/packages/snap-url-manager/src/linkers) for more info.

## Subscribe to URL changes

You can subscribe to URL changes like so:

```js
urlManager.subscribe((prev, next) => {
	console.log(prev, next);
});
```

This callback is executed any time one of the url manager's `go` function is called.

The callback is passed two parameters: `prev` and `next`.

`next` is the new state formed by a combination of the browsers URL, as well as any transformations done to the `urlManager` instance after it was either instantiated or copied using another urlManager's `copy` function.

`prev` is the previous state from this urlManager instance.

## Auto-synchronize with URL change

Remember that url manager's internal state is never directly mutated, but instead, transforms return a fresh copy with a new
state. However, the internal state is always a modification on the _current_ URL.

Take the following example:

```js
const urlManager = new UrlManager(new UrlTranslator());

const urlManagerWithColor = urlManager.merge('filter.color_family', 'blue');

console.log(window.location.href); // https://try.searchspring.com?q=dress

console.log(urlManager.href); // ?q=dress
console.log(urlManagerWithColor.href); // ?q=dress#/filter:color_family:Blue
```

You can see that the href of `urlManager` matches the parameters of the page URL, while `urlManagerWithColor` has an additional parameter.

Now let's navigate to a new URL using the `go` function and check the href's again:

```js
const urlManagerWithNewParam = urlManager.merge({ newParam: 'newValue' });

urlManagerWithNewParam.go();
console.log(window.location.href); // https://try.searchspring.com?q=dress#/newParam:newValue
console.log(urlManager.href); // ?q=dress#/newParam:newValue
console.log(urlManagerWithNewParam.href); // ?q=dress#/newParam:newValue

console.log(urlManagerWithColor.href); // ?q=dress#/filter:color_family:Blue/newParam:newValue
```

As you can see, when calling `go()` all the URL managers were updated and know about the new URL parameter `newParam` while the internal
state of `urlManagerWithColor` remains unmodified. This holds true for removals as well:

```js
const urlManagerWithColorButWithoutNewParam = urlManagerWithColor.remove('newParam');

console.log(urlManager.href); // ?q=dress#/newParam:newValue
console.log(urlManagerWithNewParam.href); // ?q=dress#/newParam:newValue

console.log(urlManagerWithColor.href); // ?q=dress#/filter:color_family:Blue/newParam:newValuecolor=blue
console.log(urlManagerWithColorButWithoutNewParam.href); // ?q=dress#/filter:color_family:Blue
```

**Note:** UrlManagers with different instantiations will not notify each other about URL updates. For example:

```js
const originalUrlManager = new UrlManager(new QueryStringTranslator());
const secondaryUrlManager = originalUrlManager.set('foo', 'bar');

const disconnectedUrlManager = new UrlManager(new QueryStringTranslator());

originalUrlManager.set('example', '1').go();

console.log(originalUrlManager.href); // ?example=1
console.log(secondaryUrlManager.href); // ?example=1&foo=bar

console.log(disconnectedUrlManager.href); // / (empty)
```

For performance reasons, the url managers do not contain watchers or otherwise poll for URL changes. Instead, they rely upon the copy mechanism behind the transform functions to notify each other of changes.

Since a `UrlManager` internal state is immutable, you do not have to worry about unintended side effects. The only side effect is changes to the URL itself, which is intended!
