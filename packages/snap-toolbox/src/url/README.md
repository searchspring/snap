## url
This utility function parses a given url.

```typescript
import { url } from '@searchspring/snap-toolbox';
```

The function takes a single required parameter containing a url string and returns an object with the following properties:

```typescript
{
	base: string;
	params: {
		query: {
			[key: string]: string;	
		};
		hash: string;
	};
	url: () => string;
}
```

`base` - contains the base url before any query parameters

`params.query` - a map containing all querystring parameter names (as keys) and their value

`params.hash` - a string containing all the raw hash parameters

`url` - a function that returns the full url.

Typical usage may include parsing the current url to see if a certain parameter is present: 

```typescript
const currentUrl = url(window.location.href);
if(currentUrl.params.query?.dev) {
    console.log("url contains dev query parameter")
}
```

Or adding additional parameters to a url: 

```typescript
const currentUrl = url(window.location.href);
// https://localhost:3333/search

currentUrl.params.query['dev'] = '1';

const newUrl = currentUrl.url();
// https://localhost:3333/search?dev=1
```
