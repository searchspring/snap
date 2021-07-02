## Script Context
This utility function gets a script tags attributes and innerHTML declarations and returns them in an object.

```typescript
import { getScriptContext } from '@searchspring/snap-toolbox';
```

The function takes two parameters, the first being the script tag element, and the second is an optional array of innerHTML variable names to evaluate.

The script element must have a type that begins with `searchspring`.  
For example: `type="searchspring"`, `type="searchspring/context"`, `type="searchspring/controller"`.

The innerHTML of the script should only contain variable assignments without `var`, `let`, or `const`.

Typical usage would be getting integration context variables from a script tag and passing them off to a controller instantiation.

```html
<script type="searchspring/recommend" profile="similar">
	product = 'C-AD-W1-1869P';
	shopper = 'snapdev';
	options = {
		siteId: 'abc123'
	}
</script>
```

```typescript
const scriptTag = document.querySelector('script[type="searchspring/recommend"');
const context = getScriptContext(scriptTag, ['shopper', 'product', 'options']);
/*
	context = {
		type: 'searchspring/recommend',
		profile: 'similar',
		product: 'C-AD-W1-1869P',
		shopper: 'snapdev',
		options: {
			siteId: 'abc123'
		}
	}
*/
```