# SearchController

The `SearchController` is used when making queries to the API `search` endpoint.

## SearchControllerConfig

| option | description | default value | required | 
|---|---|:---:|:---:|
| id | unique identifier for this controller | ➖ | ✔️ |
| globals | keys defined here will be passed to the [API request](https://snapi.kube.searchspring.io/api/v1/) (can overwrite global config)| ➖ |   |
| settings.redirects.merchandising | enable merchandising redirects | true |   |
| settings.redirects.singleResult | enable redirect to product detail page if search yields 1 result count | true |   |
| settings.facets.pinFiltered | selected facet options move to the top of the options array | true |   |
| settings.facets.trim | facets that do not change results will be removed | true |   |
| settings.infinite | enable infinite scrolling by setting to empty object | ➖ |   |
| settings.infinite.backfill | number of pages allowed for backfill | ➖ |   |

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
`SearchController` requires a `SearchControllerConfig` and `ControllerServices` object and is paired with a `SearchStore`. The `SearchStore` takes the same config, and shares the `UrlManager` service with the controller.

```typescript
import { SearchController } from '@searchspring/snap-controller';
import { Client } from '@searchspring/snap-client';
import { SearchStore } from '@searchspring/snap-store-mobx';
import { UrlManager, UrlTranslator, reactLinker } from '@searchspring/snap-url-manager';
import { EventManager } from '@searchspring/snap-event-manager';
import { Profiler } from '@searchspring/snap-profiler';
import { Logger } from '@searchspring/snap-logger';
import { Tracker } from '@searchspring/snap-tracker';

const searchUrlManager = new UrlManager(new UrlTranslator(), reactLinker);
const globals = { siteId: 'abc123' };
const client = new Client(globals);
const searchController = new SearchController(searchConfig, {
	client,
	store: new SearchStore(searchConfig, { urlManager: searchUrlManager }),
	urlManager: searchUrlManager,
	eventManager: new EventManager(),
	profiler: new Profiler(),
	logger: new Logger(),
	tracker: new Tracker(globals, { client }),
});
```

## Initialize
Invoking the `init` method is required to subscribe to changes that occur in the UrlManager. This is typically done automatically prior to calling the first `search`.

```typescript
searchController.init();
```

## Search
This will invoke a search request to Searchspring's search API and populate the store with the response.

```typescript
searchController.search();
```

## Infinite
When `config.settings.infinite` is defined and `store.pagination.next()` is invoked, the next page will be fetched and its result set will be appended to the existing result set. 

If the page has been reloaded, the results will be reset to page 1.

```typescript
const searchConfig = {
	id: 'search',
	globals: {
		pagination: {
			pageSize: 12
		}
	},
	settings: {
		infinite: {}
	}
};
```

### Backfill
If `config.settings.infinite.backfill` is specified, any page reloads when paginated up to the specified value will fetch previous pages to backfill. Note that each page that is backfilled will invoke a request to the search API and your billing quota will reflect this. It is not recommended to set this value above `5`

```typescript
const searchConfig = {
	id: 'search',
	globals: {
		pagination: {
			pageSize: 12
		}
	},
	settings: {
		infinite: {
			backfill: 5
		}
	}
};
```

For example, if `config.settings.infinite.backfill` contains a value of `5` and the user has paginated to page `4` and reloads the page, `4` pages of results will be shown. However, if the user has paginated to page `6` or above and reloads the page, only page `1` results will be shown. 


### Infinite Scrolling
By default when using the infinite configuration, additional pages are appended when `store.pagination.next()` is invoked. To automatically request the next page when the user has scrolled to the bottom, an `useIntersection` hook along with a `useRef` attached to an element below the results can be used to invoke `pagination.next.url.go({ history: 'replace' })` when the element comes into the viewport. 

```jsx
import { h, Fragment, Component } from 'preact';
import { useRef } from 'preact/hooks';
import { observer } from 'mobx-react';
import { ControllerProvider, useIntersection, Results } from '@searchspring/snap-preact-components';

@observer
export class Content extends Component {
	render() {
		const controller = this.props.controller;
		const {
			store: { pagination, merchandising, loading },
		} = controller;

		const infinite = useRef(null);
		const atBottom = pagination.totalResults > 0 ? useIntersection(infinite, '50px') : false;
		if (atBottom && pagination.next && !loading) {
			setTimeout(() => {
				pagination.next.url.go({ history: 'replace' });
			})
		}
		return (
			<ControllerProvider controller={controller}>
				<Results results={store.controller.results}>		
				<div style={{ display: loading ? 'none' : 'block' }} ref={infinite}></div>
			</ControllerProvider>
		);
	}
}

```

## Events

### init
- Called with `eventData` = { controller }
- Done once automatically before the first search - or manually invoked by calling `init`

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

### track.product.click
- Called with `eventData` = { controller, event, result, trackEvent } 
- Always invoked after `track.product.click()` method has been invoked
- Allows for adding custom product click events (ie. Google Analytics)
