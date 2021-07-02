# SearchController

The `SearchController` is used when making queries to the API `search` endpoint.

## SearchControllerConfig

| option | description | default value | required | 
|---|---|---|---|
| id | unique identifier for this controller | ➖ | ✔️ |
| globals | keys defined here will be passed to the API request (can overwrite global config)| ➖ |   |
| settings.redirects.merchandising | enable merchandising redirects | true |   |
| settings.redirects.singleResult | enable redirect to product detail page if search yields 1 result count | true |   |
| settings.facets.trim | facets that do not change results will be removed | true |   |

<br>

```typescript
const searchConfig = {
	id: 'search',
	globals: {
		pagination: {
			pageSize: 12
		}
	}
};
```
## Instantiate
`SearchController` requires a `SearchControllerConfig` and `ControllerServices` object and is usually paired with a `SearchStore`.

```typescript
import { SearchController } from '@searchspring/snap-controller';
import { Client } from '@searchspring/snap-client';
import { SearchStore } from '@searchspring/snap-store-mobx';
import { UrlManager, UrlTranslator, reactLinker } from '@searchspring/snap-url-manager';
import { EventManager } from '@searchspring/snap-event-manager';
import { Profiler } from '@searchspring/snap-profiler';
import { Logger } from '@searchspring/snap-logger';
import { Tracker } from '@searchspring/snap-tracker';

const searchController = new SearchController(searchConfig, {
	client: new Client({ siteId: 'abc123' }),
	store: new SearchStore(),
	urlManager: new UrlManager(new UrlTranslator(), reactLinker),
	eventManager: new EventManager(),
	profiler: new Profiler(),
	logger: new Logger(),
	tracker: new Tracker(),
});
```

## Initialize
Invoking the `init` method is required to subscribe to changes that occur in the UrlManager.

```typescript
searchController.init();
```

## Search
This will invoke a search request to Searchspring's search API and populate the store with the response.

```typescript
searchController.search();
```

## Events

### init
- Called with `eventData` = { controller }
- Always invoked by a call to the `init` controller method

### beforeSearch
- Called with `eventData` = { controller, request }
- Always invoked before an API request is made 
- Sets `controller.store.loading = true`

### afterSearch
- Called with `eventData` = { controller, request, response }
- Always invoked after an API request is made 
- Invokes `window.location.replace()` if API response contains merchandising redirects AND if `config.settings.redirects.merchandising = true` (default)
- Invokes `window.location.replace()` to redirect to product detail page if API response returned a single product AND `config.settings.redirects.singleResult = true` (default)
- Sets `controller.store.loading = false`

### afterStore
- Called with `eventData` = { controller, request, response }
- Always invoked after data has been stored in mobx store