# SNAP Javascript Client

<a href="https://www.npmjs.com/package/@searchspring/snap-client-javascript"><img alt="NPM Status" src="https://img.shields.io/npm/v/@searchspring/snap-client-javascript.svg?style=flat"></a>

Simple Javascript client for communicating with the Searchspring SNAP API.

---


### Build

##### Pre-requisites

node.js v12.x.x

```shellsession
$ git clone git@github.com:searchspring/snap-client-javascript.git
$ cd snap-client-javascript
$ npm install
$ npm run build
```

### Install

##### Install
```shellsession
$ npm install @searchspring/snap-client-javascript
```

# Usage
## Import
```typescript
import SnapClient from '@searchspring/snap-client-javascript';
```

### Usage
**SnapClient(*globals*)**  
Client is constructed with `globals`.  

Globals are API parameters that will be applied to all searches requested by the client. This will typically contain just the *siteId*; but could also include global filters, background filters, sorts or merchandising segments.

SiteId is required for client instantiation.

##### Typical construction example
```javascipt
let client = new SnapClient({ siteId: 'scmq7n' });
```

##### Construction with background filter
```javascipt
let client = new SnapClient({
  siteId: 'scmq7n',
  filters: [{
    field: 'color_family',
    value: 'Blue',
    type: 'value',
    background: true
  }]
};
```

## Client Config
Object required for all controllers

`apiHost` (optional) - Specify local [Snapi](https://link.to.snapi) endpoint for development
<!-- TODO: snapi link -->

```typescript
const clientConfig = {
	apiHost: 'http://localhost:8080/api/v1'
};
```

## Controller usage
Snap Client is a dependancy of Snap Controller and it is recommended to use the Controller's `search` method to perform a search. 

See [Search Typical Usage](../../README.md#SearchTypicalUsage)


## Standalone usage
```typescript
const client = new SnapClient(globals, clientConfig);

const results = await client.search({
  search: {
    query: {
      string: 'dress'
    }
  }
});
```

#### Request Methods
**client.search(*params*)**  
This makes a request to SNAPI for search results and returns a promise.  

```javascipt
let results = await client.search({
  search: {
    query: {
      string: 'dress'
    }
  }
});
```

**client.autocomplete(*params*)**  
This makes a request to SNAPI for autocomplete results and returns a promise.  

```javascipt
let results = await client.autocomplete({
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

For full list of parameters please see the SNAPI docs:  
http://snapi.kube.searchspring.io/api/v1/

#### Client properties
**client.meta**  
The meta property contains the meta data related to the siteId that the client was instantiated with. This data is to be used together with search results. Meta data contains site configuration like facet and sorting information.

### Full Example

```javascipt
const SnapClient = require('@searchspring/snap-client-javascript');

let client = new SnapClient({ siteId: 'scmq7n' });

let results = await client.search({
  "search": {
    "query": {
      "string": "yellow dress"
    }
  },
  "filters": [
    {
      "field": "ss_category_hierarchy",
      "value": "Trending",
      "type": "value",
      "background": false
    }
  ]
});
```

### Demo

https://searchspring.github.io/snapi-explorer/ \
:octocat: https://github.com/searchspring/snapi-explorer