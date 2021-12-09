## Script Context
This utility function gets a script tags attributes and innerHTML declarations and returns them in an object.

```typescript
import { getContext } from '@searchspring/snap-toolbox';
```

The function takes two parameters, the first being an array of innerHTML variable names to evaluate, and the second optional parameter for a script tag element or CSS selector string. If the script tag element is not provided, the function will query the DOM for a Snap script (using src or #searchspring-context selector).

The script element must have an ID or type that begins with `searchspring`.  
For example: `type="searchspring"`, `type="searchspring/context"`, `type="searchspring/controller"`, or `id="searchspring-context"`.

The innerHTML of the script MUST only contain variable assignments without `var`, `let`, or `const`. Each declaration should end with a semi-colon to ensure minification does not impact the functions ability to parse the innerHTML.

Typical usage would be getting integration context variables from a script tag and passing them off to a controller instantiation.

### Example Integration Context

```html
<script type="text/javascript" src="https://snapui.searchspring.io/abc123/bundle.js">
	shopper = {
		id: 'snapdev'
	};
	category = 'categoryName';
</script>
```

```typescript
const context = getContext(['shopper', 'category']);
/*
	context = {
		type: 'text/javascript',
		src: 'https://snapui.searchspring.io/abc123/bundle.js',
		shopper: {
			id: 'snapdev'
		},
		category: 'categoryName'
	}
*/
```

### Example Providing a Script Element

```html
<script type="searchspring/recommend" profile="similar">
	product = 'C-AD-W1-1869P';
	shopper = {
		id: 'snapdev'
	};
	options = {
		siteId: 'abc123'
	};
</script>
```

```typescript
const scriptTag = document.querySelector('script[type="searchspring/recommend"');
const context = getContext(['product', 'shopper', 'options'], scriptTag);
/*
	context = {
		type: 'searchspring/recommend',
		profile: 'similar',
		product: 'C-AD-W1-1869P',
		shopper: {
			id: 'snapdev'
		},
		options: {
			siteId: 'abc123'
		}
	}
*/
```

Note: `snap-preact` does automatic shopper login tracking if the context is passed to it with a `shopper.id`.