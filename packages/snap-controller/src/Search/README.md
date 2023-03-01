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
| settings.facets.storeRange | range facets keep their initial boundary ranges from first load | true |   |
| settings.facets.trim | facets that do not change results will be removed | true |   |
| settings.facets.autoOpenActive | setting for "auto open" functionality for facets that are filtered (active), collapsed, and have no stored data | true |   |
| settings.facets.fields | object keyed by individual facet fields for configuration of any settings.facets options | ➖ |   |
| settings.history.max | how many search terms should be kept in the history store | 25 |   | 
| settings.history.url | allows for adjust the root URL for history store terms (default is relative URLs) | ➖ |   | 
| settings.infinite | enable infinite scrolling by setting to empty object | ➖ |   |
| settings.infinite.backfill | number of pages allowed for backfill | ➖ |   |
| settings.restorePosition.enabled | boolean to enable/disable restoring window scroll position when navigating back to previous page (when using infinite this is set to true) | false |   |
| settings.restorePosition.offset | number of pixels to offset when scrolling back | ➖ |   |
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
const searchController = new SearchController(searchConfig, {
	client: new Client({ siteId: 'abc123' }),
	store: new SearchStore(searchConfig, { urlManager: searchUrlManager }),
	urlManager: searchUrlManager,
	eventManager: new EventManager(),
	profiler: new Profiler(),
	logger: new Logger(),
	tracker: new Tracker(),
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

## Search History
Search queries made by the controller are stored for later usage. This is enabled by default without providing any settings, to disable set the `max` to zero. The `config.settings.history.url` setting should be set when utilizing the history store outside of the search page in order for the URLs to direct users to the correct location. Common usage of the historical terms are on the search listing page or within autocomplete.

## Infinite
When `config.settings.infinite` is defined and `store.pagination.next.url.go({ history: 'replace' })` is invoked, the next page will be fetched and its result set will be appended to the existing result set.

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
If `config.settings.infinite.backfill` is specified, any page reloads when paginated up to the specified value will fetch previous pages to backfill.

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

### Restore Position
If `config.settings.infinite.backfill` is specified, any time you navigate back to a previous page, the controller will scroll to the pages previous position. This can be disabled and left entirely up to the browser by setting `restorePosition` to `false`.

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
			backfill: 5,
			restorePosition: false,
		}
	}
};
```

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
				<Results results={controller.store.results}>		
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

### error
- Called with `eventData` = { controller, error }
- Invoked when an error has been caught within the controller

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

### restorePosition
- Called with `eventData` = { controller, position }
- Position data includes `href`, `selector`, `x` and `y`
- Invoked when position data exists during final stages of `afterStore`

### track.product.click
- Called with `eventData` = { controller, event, result, trackEvent } 
- Always invoked after `track.product.click()` method has been invoked
- Allows for adding custom product click events (ie. Google Analytics)
