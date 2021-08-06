# UrlManager Translators

This is general documentation for translators. Translator-specific documentation:

- [UrlTranslator](https://github.com/searchspring/snap/tree/main/packages/snap-url-manager/src/Translators/Url)
- [QueryStringTranslator](https://github.com/searchspring/snap/tree/main/packages/snap-url-manager/src/Translators/QueryString)

A `UrlManager` is instantiated with a translator. The `Translator` defines the behavior of the `UrlManager` instance. They have a couple jobs:

1. get the current URL
2. serialize and deserialize URL's
3. provide configuration
4. define `go` function behavior

`Translator` typescript interface:

```typescript
interface Translator {
	getCurrentUrl(): string;
	getConfig(): Record<string, unknown>;

	serialize(state: UrlState | ImmutableObject<UrlState>): string;
	deserialize(url: string): UrlState;

	bindExternalEvents?(update: () => void): void;

	go(url: string): void;
}
```

## Instantiation

A `Translator` is passed in to a `UrlManager` during construction:

```js
import {
	UrlManager,
	UrlTranslator,
} from '@searchspring/snap-url-manager';

const urlManager = new UrlManager(new UrlTranslator());
```

## Overriding default behavior

Default behavior of an existing translator can be overridden by extending the class.

Consider this mock translator:

```js
// filename: urls.test.ts

let url = '';

class MockTranslator extends QueryStringTranslator {
	getCurrentUrl() {
		return url;
	}

	go(_url) {
		url = _url;
	}

	serialize(state) {
		return '#' + JSON.stringify(state);
	}

	deserialize(url) {
		return JSON.parse(url.replace(/^#/, '') || '{}');
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

	go(hash) {
		window.location.hash = hash;
	}

	serialize(state) {
		return '#' + super.serialize(state).split('?').pop();
	}

	deserialize(url) {
		return super.deserialize('?' + url.replace(/^\#?\/*/, ''));
	}
}
```

## Consistent internal state

You may have noticed in the typescript interface, serialize takes a `UrlState` type, while deserialize returns a `UrlState` type.

This is to ensure a canonical internal state structure when performing transforms (`set`, `merge`, `remove`) on the UrlManager. The benefit of this is that implementation code knows what state format to expect, regardless of how an individual translator encodes the URLs.

Typescript type for `UrlState`:

```typescript
enum RangeValueProperties {
	LOW = 'low',
	HIGH = 'high',
}

type UrlStateRangeValue = {
	[RangeValueProperties.LOW]: number | null;
	[RangeValueProperties.HIGH]: number | null;
};

type UrlStateFilterType = string | number | boolean | UrlStateRangeValue;

type UrlStateFilter = {
	[fieldName: string]: UrlStateFilterType | Array<UrlStateFilterType>;
};

type UrlStateSort = {
	field: string;
	direction: string;
};

type UrlState = {
	page?: number;
	query?: string;
	filter?: UrlStateFilter;
	sort?: UrlStateSort | Array<UrlStateSort>;
	[any: string]: unknown;
};
```

Most (or all) fields are optional, but you can rely on them being a certain type if they do exist. For example, you know that `page` is always a number, regardless of what translator you're using. You also know that your implementation code can always rely on using `query` to get the search parameter, regardless of which URL parameter your translator is configured to use for that value.
