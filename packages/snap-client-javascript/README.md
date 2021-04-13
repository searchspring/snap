# SNAP Javascript Client

<a href="https://www.npmjs.com/package/@searchspring/snap-client-javascript"><img alt="NPM Status" src="https://img.shields.io/npm/v/@searchspring/snap-client-javascript.svg?style=flat"></a>

Simple Javascript client for communicating with the Searchspring SNAP API.

---

# Quick Links

[Snap API docs](http://snapi.kube.searchspring.io/api/v1/) - Search & Autocomplete API documentation

[Snapi Explorer](https://searchspring.github.io/snapi-explorer/) - a tool for making requests to Searchspring's API.


# Dependency

Snap Client is a dependancy of [@searchspring/snap-controller](../snap-controller) <a href="https://www.npmjs.com/package/@searchspring/snap-controller"><img alt="NPM Status" src="https://img.shields.io/npm/v/@searchspring/snap-controller.svg?style=flat"></a>

<details>
    <summary>Package dependencies hierarchy</summary>
    <br/>
    <img src="../../images/snap-dependencies.jpg"/>
</details>


# Installation

```bash
npm install --save @searchspring/snap-client-javascript
```

# Usage
## Import
```typescript
import SnapClient from '@searchspring/snap-client-javascript';
```

## Global Config
Client is constructed with `globals`.  

Globals are API parameters that will be applied to all searches requested by the client. This will typically contain just the *siteId*; but could also include global filters, background filters, sorts or merchandising segments.

`siteId` (required)

```typescript
const globals = {
	siteId: 'scmq7n'
};
```

Any other keys defined here will be passed to the API request

For full list of parameters please see the [Snap API docs](http://snapi.kube.searchspring.io/api/v1/)

For example, with background filter:

```typescript
const globals = {
	siteId: 'scmq7n',
  filters: [{
    field: 'stock_status',
    value: 'yes',
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

## `search` method
Makes a request to the Searchspring Search API and returns a promise.  

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

## `autocomplete` method
Makes a request to the Searchspring Autocomplete API and returns a promise.  

```typescript
const client = new SnapClient(globals, clientConfig);

const results = await client.autocomplete({
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

## `meta` property
The meta property contains the meta data related to the siteId that the client was instantiated with. This data is to be used together with search results. Meta data contains site configuration like facet and sorting information.

Note that the `search` method sets the `meta` property, therefore it must be called before attempting to access the `meta` property.

```typescript
const client = new SnapClient(globals, clientConfig);

const results = await client.search({
  search: {
    query: {
      string: 'dress'
    }
  }
});

const meta = client.meta;
```
