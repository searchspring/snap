# Snap Toolbox

<a href="https://www.npmjs.com/package/@searchspring/snap-toolbox"><img alt="NPM Status" src="https://img.shields.io/npm/v/@searchspring/snap-toolbox.svg?style=flat"></a>

A collection of utility tools such as DOM targetting, currency formatting & browser feature flags

---

# Dependency

Snap Toolbox is a dependency of:
- [@searchspring/snap-store-mobx](../snap-store-mobx) <a href="https://www.npmjs.com/package/@searchspring/snap-store-mobx"><img alt="NPM Status" src="https://img.shields.io/npm/v/@searchspring/snap-store-mobx.svg?style=flat"></a>
- [@searchspring/snap-preact-components](../snap-preact-components) <a href="https://www.npmjs.com/package/@searchspring/snap-preact-components"><img alt="NPM Status" src="https://img.shields.io/npm/v/@searchspring/snap-controller.svg?style=flat"></a>

<details>
    <summary>Package dependencies hierarchy</summary>
    <br/>
    <img src="../../images/snap-dependencies.jpg" />
</details>


# Installation

```bash
npm install --save @searchspring/snap-toolbox
```


# Usage
## Import
```typescript
import { filters, DomTargeter, getFlags, featureFlags, cookies } from '@searchspring/snap-toolbox';
```


# filters
Contains a collection of methods:

## `formatNumber` method
Returns a string that has been formatted with the following format number options: 

`symbol` - currency symbol, default is `''`

`decimalPlaces` - number of decimal places, default is `3`

`thousandsSeparator` - thousands separator, default is `''`

`decimalSeparator` - decimal separator, default is `'.'`

`padDecimalPlaces` - pad decimal places, default is `true`

`symbolAfter` - place currency symbol after value, default is `false`

```typescript
const value = 12999.99;
const formattedPrice = filters.formatNumber(value);
console.log(formattedPrice); // '12999.990'
```

```typescript
const value = 12999.99;
const formattedPrice = filters.formatNumber(value, {
    symbol: ' kr',
    decimalPlaces: 2,
    padDecimalPlaces: true,
    thousandsSeparator: ',',
    decimalSeparator: ',',
    symbolAfter: true,
});
// '12,999,99 kr'
```

## `currency` method
The `currency` method is a wrapper for the `formatNumber` method with the following options:

```typescript
{
    symbol: '$',
    thousandsSeparator: ',',
    decimalPlaces: 2,
}
```

```typescript
const value = 12999.99;
const formattedPrice = filters.currency(value);
// '$12,999.99'
```

```typescript
const value = 12999.99;
const formattedPrice = filters.currency(value, {
    symbol: '£ '
}); 
// '£ 12,999.99'
```


## `handleize` method
Given a string, returns a string that has been converted to lower case, without any symbols and special characters, and spaces replaced with with `'-'`

Typical usage would be for generating URL-safe parameters

```typescript
const value = "Hello World!!";
const handled = filters.handleize(value);
// 'hello-world'
```

## `stripHTML` method
Given a string containing HTML, returns a string that does not contain any HTML tags

```typescript
const value = "<p class='text'>Hello World!!</p>";
const handled = filters.stripHTML(value);
// 'Hello World!!'
```

## `truncate` method
Truncate a string to a specific length

```typescript
const value = "Searchspring";
const limit = 7;
const append = '...';
const truncated = filters.truncate(value, limit, append);
// 'Search...'
```




# DomTargeter
`DomTargeter` is a utility for rending components in specified DOM targets. 

The constructor accepts an array of targets, an onTarget callback function, and optionally the Document

```typescript
const searchPageTarget = new DomTargeter(
    [
        {
            selector: '.searchspring-container',
            component: <SearchPage />,
        },
    ],
    (target, elem) => {
        render(target.component, elem);
    }
);
```

Typical usage would be used with [snap-controller](../snap-controller) to render content and sidebar components in a two-column layout

```typescript
search.on('init', async ({ controller }, next) => {
	const contentTarget = new DomTargeter(
		[
			{
				selector: '#searchspring-content',
				component: <Content store={controller.store} />,
			},
		],
		(target, elem) => {
			// run search after finding target
			controller.search();

			// empty element
			while (elem.firstChild) elem.removeChild(elem.firstChild);
			render(target.component, elem);
		}
	);

	const sidebarTarget = new DomTargeter(
		[
			{
				selector: '#searchspring-sidebar',
				component: <Sidebar store={controller.store} />,
			},
		],
		(target, elem) => {
			// empty element
			while (elem.firstChild) elem.removeChild(elem.firstChild);
			render(target.component, elem);
		}
	);

    window.addEventListener('DOMContentLoaded', () => {
		contentTarget.retarget();
		sidebarTarget.retarget();
	});

	await next();
})
```

### `retarget` method
If the DOM is loaded asynchronously and the target element is not present at the time of when an instance of DomTargeter is created. It is recommended to retarget when the DOMContentLoaded event has been invoked

```typescript
window.addEventListener('DOMContentLoaded', () => {
    searchPageTarget.retarget();
});
```


# featureFlags
Browser features support

## `getFlags` method
Returns an object with the following functions:

### `cors` function
Tests if the browser supports cross origin (>=IE10)

When using `cors`, the `getFlags` function accepts a `userAgent` to test.

```typescript
const flags = getFlags() 
if (flags.cors()) {
    // cors is supported!
}
```

### `cookies` function
Tests if the browser supports cookies

```typescript
const flags = getFlags() 
if (flags.cookies()) {
    // cookies are supported!
}
```

### `storage` function
Tests if the browser supports LocalStorage and SessionStorage

```typescript
const flags = getFlags() 
if (flags.storage()) {
    // storage is supported!
}
```

## `featureFlags` property
`featureFlags` utilizes `getFlags` to check all flags and return an object containing feature flags eligibility

```typescript
if (featureFlags.cors) { }
if (featureFlags.cookies) { }
if (featureFlags.storage) { }
```

# cookies
An interface for settings and getting cookies

## `set` function
Set a cookie

```typescript
const name = 'myCookie';
const value = 'Hello World!!';
const sameSite = 'Lax';
const expires = 31536000000; // 1 year

cookies.set(name, value, sameSite, expires)
```

## `get` function
Get a cookie

```typescript
const name = 'myCookie';

cookies.get(name)
```

## `unset` function
Removes a cookie

```typescript
const name = 'myCookie';

cookies.unset(name)
```
