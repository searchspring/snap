# Snap Client

The `@searchspring/snap-client` package is a client for the Searchspring API. It is a wrapper around the Searchspring API that provides a simple interface for fetching data from the API.


## ClientGlobals

When constructing a new Client, the first argument is a `ClientGlobals` object. This object can be used to set client search parameters that will apply to all requests made with the client (and subsequently any controllers using the client as a service). Typically only the siteId will be set here, but could be used for setting globally utilized background filters and/or sorts as well.

You can find your Searchspring siteId in the [Searchspring Management Console](https://manage.searchspring.net)

```js
import { Client } from '@searchspring/snap-client';

const client = new Client({
	siteId: '1234567890',
	filters: [{
		field: 'stock_status',
		value: 'yes',
		type: 'value',
		background: true
	}],
});
```


## ClientConfig

The second argument is an optional `ClientConfig` object.

| Option | Type | Description |
|--------|------|-------------|
| mode | `string` \| `AppMode` enum <br>(e.g. `'development'`, `'production'`, `AppMode.development`, `AppMode.production`) | Optional. Sets the client mode. `'development'` disables network caching; |
| fetchApi | `WindowOrWorkerGlobalScope['fetch']` | Alternative fetch implementation to use for requests. Defaults to global `fetch`. |
| meta | `RequesterConfig<MetaRequestModel>` | Configuration for the `meta` endpoint (origin, headers, cache, globals). |
| search | `RequesterConfig<SearchRequestModel>` | Configuration for the `search` endpoint (origin, headers, cache, globals). |
| autocomplete | `RequesterConfig<AutocompleteRequestModel> & { requesters?: HybridRequesterConfig }` | Configuration for the `autocomplete` endpoint, including hybrid requesters. |
| finder | `RequesterConfig<SearchRequestModel>` | Configuration for the `finder` endpoint (origin, headers, cache, globals). |
| recommend | `RequesterConfig<RecommendRequestModel>` | Configuration for the `recommend` endpoint (origin, headers, cache, globals). |
| suggest | `RequesterConfig<SuggestRequestModel>` | Configuration for the `suggest` endpoint (origin, headers, cache, globals). |


Where `RequesterConfig<T>` is defined as:

```js
type RequesterConfig<T> = {
	origin?: string;
	headers?: { [key: string]: string };
	cache?: {
		enabled?: boolean; // default: true - enables caching
		ttl?: number; // default: 300000 (5 minutes) - time in milliseconds to store a response in the cache
		maxSize?: number; // default: 200 - maximum size in KB to store in sessionStorage
		purgeable?: boolean; // default: true - allows the cache to be purged from sessionStorage when maxSize is reached (with exception when used for meta)
		entries?: { [key: string]: Response }; // default: undefined - allows for pre-populating the cache with entries, primarily used for email recommendations
	};
	globals?: Partial<T>;
};
```

Example: 

```js
import { Client } from '@searchspring/snap-client';

const client = new Client({
	siteId: '1234567890',
}, {
	mode: 'development',
	fetchApi: window.fetch,
	search: {
		cache: {
			enabled: true,
			ttl: 300000,
			maxSize: 100,
			purgeable: true,
		},
	},
});
```

## Caching & Retries

If the Client is running in a browser environment, the client will cache responses for 5 minutes in sessionStorage if available. This prevents unnecessary network requests and improves performance for previously made requests.

Also, for unexpected API response status codes, the client will retry failed requests by default up to 8 times with starting with a 1 second delay with fibonacci backoff for each subsequent retry.

Both caching and retries can be disabled or configured for each endpoint in the `ClientConfig` object.


## API Types

The client uses the [@searchspring/snapi-types](https://www.npmjs.com/package/@searchspring/snapi-types) package to define the API types.


### Methods

#### meta

The `meta` endpoint is used to fetch metadata about the site and also contains common static data such as sort options that don't change between other API queries.


```js
const meta: MetaResponseModel = await client.meta();
```

#### autocomplete

The `autocomplete` endpoint is used to fetch autocomplete suggestions and results for a given search query and also requests the meta data for the site.


```js
const [meta, autocomplete]: [MetaResponseModel, AutocompleteResponseModel] = await client.autocomplete({
	suggestions: {
		count: 5
	},
	search: {
		query: {
			string: 'search query',
			spellCorrection: true
		}
	}
});
```

#### search

The `search` endpoint is used to fetch search results for a given search query and also requests the meta data for the site.


```js
const [meta, search]: [MetaResponseModel, SearchResponseModel] = await client.search({
	search: {
		query: {
			string: 'search query',
		},
	},
});
```


#### finder

The `finder` method makes a request to the Searchspring Finder API to fetch search results for a given search query.

```js
const [meta, finder]: [MetaResponseModel, SearchResponseModel] = await client.finder({
	search: {
		query: {
			string: 'search query',
		},
	},
	filters: [{
		type: 'value',
		field: 'color',
		background: false,
		value: 'red',
	}],
});
```

#### trending

The `trending` method makes a request to the Searchspring Trending API to fetch trending search queries.

```js
const results: TrendingResponseModel = await client.trending({
	limit: 5
});
```


#### recommend

The `recommend` method makes a request to the Searchspring Profile API and Recommend API to fetch recommendations for a given profile tag. This will also request the meta data.

```js
const results: RecommendCombinedResponseModel = await client.recommend({
	tag: 'similar',
	products: ['product123'],
});
```


<!-- TODO: add types for ProfileResponseModel and other types that are in the snap-client package and not in the snapi-types package -->