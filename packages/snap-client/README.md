# Snap Javascript Client

Simple Javascript client for communicating with the Searchspring Snap API.

## Quick Links

[Snap API docs](https://snapi.kube.searchspring.io/api/v1/) - Search & Autocomplete API documentation

[Snapi Explorer](https://searchspring.github.io/snapi-explorer/) - a tool for making requests to Searchspring's API

## Installation

```bash
npm install --save @searchspring/snap-client
```

## Import
```typescript
import { Client } from '@searchspring/snap-client';
```

## Global Config
Client is constructed with `globals`.  

Globals are API parameters that will be applied to all searches requested by the client. This will typically contain just the *siteId*; but could also include global filters, background filters, sorts, or merchandising segments.

`siteId` (required)

```typescript
const globals = {
	siteId: 'a1b2c3'
};
```

Any other keys defined here will be passed to the API request

For a full list of parameters please see the [Snap API docs](https://snapi.kube.searchspring.io/api/v1/)

For example, with background filter:

```typescript
const globals = {
	siteId: 'a1b2c3',
  filters: [{
    field: 'stock_status',
    value: 'yes',
    type: 'value',
    background: true
  }]
};
```

## Client Config
Optional configuration for each requester. This can be used to specifiy a development origin URL or to configure cache settings per requester.

```typescript
type ClientConfig = {
	mode?: keyof typeof AppMode | AppMode;
	fetchApi?: WindowOrWorkerGlobalScope['fetch'];
	meta?: RequesterConfig<MetaRequestModel>;
	search?: RequesterConfig<SearchRequestModel>;
	autocomplete?: RequesterConfig<AutocompleteRequestModel> & { requesters?: HybridRequesterConfig };
	finder?: RequesterConfig<SearchRequestModel>;
	recommend?: RequesterConfig<RecommendRequestModel>;
	suggest?: RequesterConfig<SuggestRequestModel>;
};

type RequesterConfig<T> = {
	origin?: string;
	headers?: HTTPHeaders;
	cache?: CacheConfig;
	globals?: Partial<T>;
};

type CacheConfig = {
	enabled?: boolean;
	ttl?: number;
	maxSize?: number;
	purgeable?: boolean;
	entries?: { [key: string]: Response };
};

```

## Controller usage
Snap Client is a dependency of Snap Controller and it is recommended to use the Controller's `search` method to perform a search. 

## Cache usage
Each requester in the Snap Client has its own cache settings, which can be configured via the `ClientConfig` under `cache`. Settings include: 

  `enabled`: to opt out - Defaults to `true`, 

  `ttl`: to adjust how long the requests are stored (in ms) - Defaults to `300000`,

  `maxSize`: to adjust the maximum size of the cache allowed to be stored in localStorage (in kb - Defaults to `200`,

  `purgeable`: to allow auto purging of the requests from localstorage when maxSize is hit, based on time remaining to expiration.  - Defaults to `true` with the exception of `meta`,

  `entries`: to allow preload the cache. This is primarily used in Email Recommendations. 

```typescript
const metaResponse = {
    "facets": {
        "brand": {
            "display": "list",
            "label": "Brand",
            "collapsed": false,
            "multiple": "or"
        },
        "collection": {
            "display": "list",
            "label": "Collection",
            "collapsed": false,
            "multiple": "or"
        },
        "color_family": {
            "display": "palette",
            "label": "Color",
            "collapsed": false,
            "multiple": "or"
        }
    },
    "sortOptions": [
        {
            "type": "relevance",
            "field": "relevance",
            "direction": "desc",
            "label": "Best Match"
        },
        {
            "type": "field",
            "field": "sales_rank",
            "direction": "desc",
            "label": "Most Popular"
        }
    ]
};

const metaKey = `/api/meta/meta.json{"siteId":"8uyt2m"}`;

const clientConfig = {
  search: {
    cache: {
      entries: {
        [metaKey]: metaResponse
      }
    }
  }
}

const client = new Client(globals, clientConfig);

const response = await client.search({
  search: {
    query: {
      string: 'dress'
    }
  }
});
```

## Standalone usage
```typescript
const client = new Client(globals, clientConfig);

const { meta, results } = await client.search({
  search: {
    query: {
      string: 'dress'
    }
  }
});
```

## `search` method
Makes a request to the Searchspring Search API and returns a promise.  

```typescript
const client = new Client(globals, clientConfig);

const { meta, results } = await client.search({
  search: {
    query: {
      string: 'dress'
    }
  }
});
```

## `autocomplete` method
Makes a request to the Searchspring Autocomplete API and returns a promise.  

```typescript
const client = new Client(globals, clientConfig);

const { meta, results } = await client.autocomplete({
  suggestions: {
    count: 5
  },
  search: {
    query: {
      string: 'yellw',
      spellCorrection: true
    }
  }
});
```

## `meta` method
Makes a request to the Searchspring Search API to fetch meta properties, it returns a promise. The `search` method utilizes this method.

```typescript
const client = new Client(globals, clientConfig);
const meta = await client.meta();
```

## `trending` method
Makes a request to the Searchspring Trending API and returns a promise.

```typescript
const client = new Client(globals, clientConfig);
const trending = await client.trending({
  siteId: 'abc123',
  limit: 5
});
```

## `finder` method
Makes a request to the Searchspring finder API and returns a promise.

```typescript
const client = new Client(globals, clientConfig);
const { meta, results } = await client.finder({
  filters: [{
    type: "value",
    field: "color",
    background: false,
    value: "red",
  }]
});
```

## `recommend` method
Makes a request to the Searchspring Recommend API and returns a promise.

```typescript
const client = new Client(globals, clientConfig);
const { profile, meta, recommend } = await client.recommend({
  tag: 'similar',
  siteId: 'abc123',
  products: ['product123'],
  shopper: 'snapdev',
});
```
