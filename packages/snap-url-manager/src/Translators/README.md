# Translators

This is general documentation for translators. Translator-specific documentation:

- [Query string w/ pushState](query-string/README.md)

### Introduction

UrlManager's are instantiated with a translator. Translators define the behavior of the UrlManager instance. They have a couple jobs:

1. get the current URL
2. serialize and deserialize URL's
3. provide configuration
4. define `go` function behavior

See the typescript interface:

```js
interface UrlTranslator {
	getCurrentUrl(): string;
	getConfig(): Record<string, any>;

	serialize(state: UrlState): string;
	deserialize(url: string): UrlState;

	go(url: string): void;
}
```

### Usage:

Translators are passed in to UrlManager's during construction:

```js
import {
	UrlManager,
	QueryStringTranslator,
} from '@searchspring/snap-url-manager';

const urlManager = new UrlManager(new QueryStringTranslator());
```

### Overriding default behavior

Default behavior of an existing translator can be overridden by extending the class.

Consider this mock translator:

```js
// filename: urls.test.ts

let url = '';

// Mocked for testing due to lack of `window` global
class MockTranslator extends QueryStringTranslator {
	getCurrentUrl() {
		return url;
	}

	go(_url) {
		url = _url;
	}
}

describe('my test', () => {
	let urlManager;
	beforeEach(() => (urlManager = new UrlManager(new MockTranslator())));

	// your tests
});
```

Or, this translator which uses the same format as the query translator, but uses hash fragments and avoids using the History API (for older browsers):

```js
class HashTranslator extends QueryStringTranslator {
	getCurrentUrl() {
		return window.location.hash;
	}

	go(url) {
		window.location.hash = url;
	}

	serialize(state) {
		return '#' + super.serialize(state).split('?').pop();
	}

	deserialize(url) {
		return super.deserialize(url.split('#').pop());
	}
}
```

### Consistent internal state

You may have noticed in the typescript interface, serialize takes a `UrlState` type, while deserialize returns a `UrlState` type.

This is to ensure a canonical internal state structure when performing transforms (`set`, `merge`, `remove`) on the UrlManager. The benefit of this is that implementation code knows what state format to expect, regardless of how an individual translator encodes the URLs.

Typescript type for UrlState:

```js
type UrlStateFilters = {
	[fieldName: string]: Array<string>,
};

type UrlStateSort = {
	field: string,
	direction: string,
};

type UrlState = {
	page?: number,
	query?: string,
	filter?: UrlStateFilters,
	sort?: UrlStateSort | Array<UrlStateSort>,
	[any: string]: any,
};
```

Most (or all) fields are optional, but you can rely on them being a certain type if they do exist. For example, you know that `page` is always a number, regardless of what translator you're using. You also know that your implementation code can always rely on using `query` to get the search parameter, regardless of which URL parameter your translator is configured to use for that value.
