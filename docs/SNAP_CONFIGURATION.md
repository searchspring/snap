# Configuration

This configuration refers to the object passed to the `new Snap()` constructor. 

## Client

Required. Config object that is passed to the core [@searchspring/snap-client](https://github.com/searchspring/snap/tree/main/packages/snap-client) package. This service handles the network requests to Searchspring APIs to retrieve data to be displayed.


| Option | Type | Description |
|---|---|---|
| client.globals | `Partial<ClientGlobals>` | Base query parameters to the API; these are parameters that will ALWAYS be included on every request. At the bare minimum, `siteId` is required and can be obtained in the [Searchspring Management Console](https://manage.searchspring.net/). See [@searchspring/snap-client](https://github.com/searchspring/snap/tree/main/packages/snap-client) for more information. |
| client.config | `ClientConfig` | Optional. See [@searchspring/snap-client](https://github.com/searchspring/snap/tree/main/packages/snap-client) for more information. |


## Mode

| Option | Type | Description |
|---|---|---|
| mode | `string` \| `AppMode` enum <br>(e.g. `'development'`, `'production'`, `AppMode.development`, `AppMode.production`) | Optional. Sets the application mode. `'development'` enables additional logging and disables network caching; Can also be set at runtime via url parameter `?dev=1` or `?dev=0`. `'production'` is for live usage and is the default mode. |

## Context

Optional Context object to be used to set the global context. If no context is provided, a default context taken from the integration script will be used, otherwise the provided config.context is merged with the script context. This context becomes the globalContext that is passed to all controllers that are created.


| Option | Type | Description |
|---|---|---|
| context | `ContextVariables` | Optional. Provides contextual variables for Snap, such as collection or user info. |

## URL

Optional. [`UrlTranslator` config](https://github.com/searchspring/snap/tree/main/packages/snap-url-manager/src/Translators/Url) object that is passed to the core [@searchspring/snap-url-manager](https://github.com/searchspring/snap/tree/main/packages/snap-url-manager) package used by all controllers. This parameter configuration will be applied to all controllers created via Snap, but can be specified per controller for specific customization.

| Option | Type | Description |
|---|---|---|
| url | `UrlTranslatorConfig` | Optional. Configures URL translation and parameter mapping. |



## Tracker

| Option | Type | Description |
|---|---|---|
| tracker | `{ globals?: TrackerGlobals; config?: TrackerConfig }` | Optional. Tracker configuration for analytics and event tracking. |

## Instantiators

| Option | Type | Description |
|---|---|---|
| instantiators | `{ recommendation?: RecommendationInstantiatorConfig }` | Optional. Custom instantiators for advanced controller/component instantiation, such as recommendations. |

## Controllers

Specifies all of the controllers that we wish to create.

| Option | Type | Description |
|---|---|---|
| controllers | `{ search?: Controller[]; autocomplete?: Controller[]; finder?: Controller[]; recommendation?: Controller[] }` | Optional. Defines the controllers to instantiate (search, autocomplete, finder, recommendation), each with their own config. | 

**Notes:**
- Each controller array (e.g. `search`, `autocomplete`, etc.) contains objects with at least a `config` property, and may include `targeters`, `services`, `url`, and `context`.
- For detailed controller configuration, see the Snap documentation or type definitions for each controller type.

## Features Flags

`config.features` is optional and defines features to enable.

| Option | Type | Description |
|---|---|---|
| features.integratedSpellCorrection.enabled | `boolean` | Optional. Enables or disables integrated spell correction. |


### Integrated Spell Correction

Integrated spell correction is disabled by default. When disabled and a query is typed into autocomplete, a request is made to the suggest API to retrieve a list of terms. The highest scoring term is then used to query the search API for results.

Enabling integrated spell correction `config.features.integratedSpellCorrection.enabled = true` will still retrieve terms from the suggest API to display, however the query that was entered will be used as the term sent to the search API. Spell correction will occur within the search API. The correction and original query is returned in the response and available to be render. Upon submitting the autocomplete form, a `fallbackQuery` parameter is also submitted. This contains a value of the highest scoring suggested term and will be searched for if the initial query yields 0 results.

Note: Enabling integrated spell correction modifies [AutocompleteController](https://github.com/searchspring/snap/tree/main/packages/snap-controller/src/Autocomplete)'s config by setting `config.settings.integratedSpellCorrection = true`


## Snap Methods

### getController

The `config` object contains all controller configurations. The most notable property here is the required `id` with a given value of `'search'`. This will be the name of the search controller that we can then interface with the return of the `new Snap()` instance via the `getController` method. 

In snap-preact controllers are created only as needed (typically when a targeter has found a target), their creation is an asynchronous process. The `getController` method will return a promise that will resolve to the controller object requested immediately after its creation.

For example:

```typescript
const snap = new Snap(config);
snap.getController('search').then((search) => {
	// do things with controller
});
```


### getControllers

If multiple controllers are needed at the same time, usage of the `getControllers` method is necessary. The `getControllers` method returns a promise that resolves to an array of controllers in the order requested by the parameters. The promise only resolves when ALL of the controllers have been created - if a controller is specified that is never created the promise will never resolve. For this reason this method should only be used when all controllers are needed simultaneously.

```typescript
const snap = new Snap(config);
snap.getControllers('search', 'autocomplete').then(([search, autocomplete]) => {
	// do things with controllers
});
```


### getInstantiator


Snap also provides a method to retrieve instantiators. Instantiatiors are used to create instances of the `RecommendationInstantiator` class, which is responsible for instantiating recommendations.

```typescript
const snap = new Snap(config);
snap.getInstantiator('recommendation').then((instantiator) => {
	// do things with instantiator
});
```


## Snap Properties

### client

The `client` property is used to configure the client side of the Snap instance.

```typescript
const snap = new Snap(config);
snap.client.globals.siteId = 'abc123';
```

### tracker

The `tracker` property is used to configure the tracker side of the Snap instance.

```typescript
const snap = new Snap(config);
snap.tracker.globals.siteId = 'abc123';
```

### context

The `context` property is used to configure the context side of the Snap instance.

```typescript
const snap = new Snap(config);
snap.context.siteId = 'abc123';
```

### controllers

The `controllers` property is used to configure the controllers side of the Snap instance.

```typescript
const snap = new Snap(config);
snap.controllers.search.globals.siteId = 'abc123';
```
