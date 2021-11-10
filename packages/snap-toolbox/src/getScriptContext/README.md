## Script Context
This utility function gets a script tags attributes and innerHTML declarations and returns them in an object.

```typescript
import { getScriptContext } from '@searchspring/snap-toolbox';
```

The function takes two parameters, the first being an optional array of innerHTML variable names to evaluate, and the second is an optional script tag element. If the script tag element is not provided, the currently executing script will be used.

The script element must have an ID or type that begins with `searchspring`.  
For example: `type="searchspring"`, `type="searchspring/context"`, `type="searchspring/controller"`, or `id="searchspring-context"`.

The innerHTML of the script should only contain variable assignments without `var`, `let`, or `const`.

Typical usage would be getting integration context variables from a script tag and passing them off to a controller instantiation.

```html
<script type="searchspring/recommend" profile="similar">
	product = 'C-AD-W1-1869P';
	shopper = {
		id: 'snapdev'
	};
	options = {
		siteId: 'abc123'
	}
</script>
```

```typescript
const scriptTag = document.querySelector('script[type="searchspring/recommend"');
const context = getScriptContext(['shopper', 'product', 'options'], scriptTag);
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

Note: Snap-preact does automatic shopper login tracking if the context is passed to it with a `shopper.id`.