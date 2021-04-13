# SNAP URL Manager


The SNAP URL manager is a service that provides customizable frontend URL management and a means to subscribe to the URL for changes. It's primary purpose is to provide a standard API to manage URL across SNAP products.

## Installation

```sh
npm install --save-dev @searchspring/url-manager
```

## Import

```js
import { UrlManager, QueryStringTranslator } from '@searchspring/url-manager';
```

## Usage

### Instantiation

The UrlManager class takes one parameter. This is the translator that manages your URL scheme, as well as rules for updating the URL. For now, we'll use the included translator that uses query strings and pushState to modify the URL in the browser.

See [Translators](src/translators/README.md) for more info.

```js
const urlManager = new UrlManager(new QueryStringTranslator());
```

Depending on the translator, the instantiated url manager will automatically start tracking from the browser URL.

### Navigate to another location using transforms.

Let's add a new parameter, `page=2`, to the browser's address bar.

```js
urlManager.merge({ page: 2 }).go();
```

In this example, we first created a new url manager with internal state that reflects `page=2` . Url managers are never directly modified, but when merging or setting parameters, a new url manager is created with a new state.

We then updated the browser's address bar using `urlManager.go()` on the newly created url manager. Since the query string config translator is utilizing `location.pushState` behind the scenes,
this is the mechanism behind which the browsers address bar is updated in this example.

There are 3 functions to update one or more URL parameters: `merge`, `set`, and `remove` . These functions are called transforms.

When using `set`, other parameters will be clobbered and the URL will be set to exactly match the object passed in. `merge` and `set` both take an optional first parameter to specify a path.

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
const newManager = urlManager.set('facets.color', 'blue');
```

This will produce 1 value for `facets.color` and remove any others.

For multiple values:

```js
const newManager = urlManager
	.merge('facets.color', 'blue')
	.merge('facets.color', 'red');
```

### Href

You can access a url manager's href at any time with

```js
urlManager.href;
```

### Many copies

There may be cases where you want multiple URL states stored for various purposes. Since
`set`, `merge`, and `remove` create modified copies, you can generate these as follows:

```js
const facetValuesWithUrls = (facet, facetValues) => {
	return facetValues.map((facetValue) => {
		return {
			...facetValue,
			url: urlManager.merge(['facet', facet.name], facetValue.value),
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
					href="#"
					onClick={(ev) => {
						ev.preventDefault();

						value.url.go();
					}}
				>
					{value.value}
				</a>
			</li>
		);
	}
}
```

Using the query string translator, a macro is provided to make this cleaner to use with pushState:

```js
class FacetValue {
	render({ facet, value }) {
		return (
			<li>
				<a {...value.url.pushState}>{value.value}</a>
			</li>
		);
	}
}
```

### Subscribe to URL changes:

You can subscribe to URL changes like so:

```js
urlManager.subscribe((new, old) => {
	console.log({ new, old });
});
```

This callback is executed any time one of the url manager's `go` function is called.

The callback is passed 2 parameters: `new` and `old`.

`new` is the new parameters from the browsers URL bar, as well as any transformations done to the `urlManager` instance after it was either instantiated or copied using another urlManager's `copy` function.

`old` is the previous parameters from this urlManager instance.

### Auto-synchronize with URL change

Remember that url manager's internal state is never directly mutated, but instead, transforms return a fresh copy with a new
state. However, the internal state is always a modification on the _current_ URL.

Take the following example:

```js
const urlManager = new UrlManager(new QueryStringTranslator());

const urlManagerWithColor = urlManager.merge('filter.color', 'blue');

console.log(window.location.search); // ?foo.bar=baz&a_number=1

console.log(urlManager.href); // ?foo.bar=baz&a_number=1
console.log(urlManagerWithColor.href); // ?foo.bar=baz&a_number=1&filter.color=blue
```

You can see that the href of `urlManager` matches the page URL, while `urlManagerWithColor` has an additional parameter.

Now let's navigate to a new URL using the `go` function and check the href's again:

```js
const urlManagerWithNewParam = urlManager.merge({ newParam: 'newValue' });

urlManagerWithNewParam.go();

console.log(urlManager.href); // ?foo.bar=baz&a_number=1&newParam=newValue
console.log(urlManagerWithNewParam.href); // ?foo.bar=baz&a_number=1&newParam=newValue

console.log(urlManagerWithColor.href); // ?foo.bar=baz&a_number=1&newParam=newValue&filter.color=blue
```

As you can see, all the URL managers were updated and know about the new URL parameter `newParam`, while the internal
state of `urlManagerWithColor` remains unmodified. This holds true for removals as well:

```js
const urlManagerWithColorButWithoutFoo = urlManagerWithColor.remove('foo');

console.log(urlManager.href); // ?foo.bar=baz&a_number=1&newParam=newValue
console.log(urlManagerWithNewParam.href); // ?foo.bar=baz&a_number=1&newParam=newValue

console.log(urlManagerWithColor.href); // ?foo.bar=baz&a_number=1&newParam=newValue&filter.color=blue
console.log(urlManagerWithColorButWithoutFoo.href); // ?a_number=1&newParam=newValue&filter.color=blue
```

**Note:** UrlManagers with different instantiations will not notify each other about URL updates. For example:

```js
const originalUrlManager = new UrlManager(new QueryStringTranslator());
const secondaryUrlManager = originalUrlManager.set('foo', 'bar');

const disconnectedUrlManager = new UrlManager(new QueryStringTranslator());

originalUrlManager.set('example', '1').go();

console.log(originalUrlManager.href); // ?example=1
console.log(secondaryUrlManager.href); // ?example=1&foo=bar

console.log(disconnectedUrlManager.href); // '' (empty string)
```

For performance reasons, the url managers do not contain watchers or otherwise poll for URL changes. Instead, they rely
on the copy mechanism behind the transform functions to notify each other of changes.

For this reason, it's advised to only explicitly instantiate a URL manager via `new` once in your project, unless you have
specific reasons for doing otherwise.

Since a url manager`s internal state is immutable, you do not have to worry about unintended side effects. The only side effect is changes to the URL itself, which is intended!
