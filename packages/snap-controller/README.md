# Snap Controller

<a href="https://www.npmjs.com/package/@searchspring/snap-controller"><img alt="NPM Status" src="https://img.shields.io/npm/v/@searchspring/snap-controller.svg?style=flat"></a>

The heart of controlling Search, Autocomplete, & Finder functionality. The Controller is responsible for tying various Snap services together.


## Dependencies

Snap Controller is a top-level package that requires the following dependencies as services:

<a href="https://www.npmjs.com/package/@searchspring/snap-client"><img alt="NPM Status" src="https://img.shields.io/npm/v/@searchspring/snap-client.svg?style=flat"></a> [@searchspring/snap-client](https://github.com/searchspring/snap/tree/main/packages/snap-client)

<a href="https://www.npmjs.com/package/@searchspring/snap-store-mobx"><img alt="NPM Status" src="https://img.shields.io/npm/v/@searchspring/snap-store-mobx.svg?style=flat"></a> [@searchspring/snap-store-mobx](https://github.com/searchspring/snap/tree/main/packages/snap-store-mobx)

<a href="https://www.npmjs.com/package/@searchspring/snap-url-manager"><img alt="NPM Status" src="https://img.shields.io/npm/v/@searchspring/snap-url-manager.svg?style=flat"></a> [@searchspring/snap-url-manager](https://github.com/searchspring/snap/tree/main/packages/snap-url-manager)

<a href="https://www.npmjs.com/package/@searchspring/snap-event-manager"><img alt="NPM Status" src="https://img.shields.io/npm/v/@searchspring/snap-event-manager.svg?style=flat"></a> [@searchspring/snap-event-manager](https://github.com/searchspring/snap/tree/main/packages/snap-event-manager)

<a href="https://www.npmjs.com/package/@searchspring/snap-profiler"><img alt="NPM Status" src="https://img.shields.io/npm/v/@searchspring/snap-profiler.svg?style=flat"></a> [@searchspring/snap-profiler](https://github.com/searchspring/snap/tree/main/packages/snap-profiler)

<a href="https://www.npmjs.com/package/@searchspring/snap-logger"><img alt="NPM Status" src="https://img.shields.io/npm/v/@searchspring/snap-logger.svg?style=flat"></a> [@searchspring/snap-logger](https://github.com/searchspring/snap/tree/main/packages/snap-logger)

## Installation

To install the `snap-controller` package and it's services:

```bash
npm install --save @searchspring/snap-controller @searchspring/snap-client @searchspring/snap-store-mobx @searchspring/snap-url-manager @searchspring/snap-event-manager @searchspring/snap-profiler @searchspring/snap-logger
```


## Instantiation
Each `Controller` must be passed a configuration object as the first parameter to the constructor, and a services object (dependencies) as the second. The contents of these objects will depend on which type of `Controller` is being instantiated. For example, a `SearchController` would usually be paired with a `SearchStore` service, and would take a `SearchControllerConfig` configuration object.

The complete example below shows how a `SearchController` could be instatiated, initialized and searched:

```typescript
import { Client } from '@searchspring/snap-client';
import { SearchStore } from '@searchspring/snap-store-mobx';
import { UrlManager, UrlTranslator } from '@searchspring/snap-url-manager';
import { EventManager } from '@searchspring/snap-event-manager';
import { Profiler } from '@searchspring/snap-profiler';
import { Logger } from '@searchspring/snap-logger';
import { Tracker } from '@searchspring/snap-tracker';
import { SearchController } from '@searchspring/snap-controller';

const configuration = {
	id: 'search'
};

const urlManager = new UrlManager(new UrlTranslator());
const services = {
	client: new Client({ siteId: 'abc123' }),
	store: new SearchStore(configuration, { urlManager }),
	urlManager,
	eventManager: new EventManager(),
	profiler: new Profiler(),
	logger: new Logger(),
	tracker: new Tracker(),
}

const controller = new SearchController(configuration, services);
controller.init();
controller.search();
```

## Configuration
The configuration object provided during instantiation provides a way of configuring the controller for different behavior. Each controller type (`SearchController`, `AutocompleteController`, `FinderController`, etc...) has default configurations that can be modified with the instantiation configuration object. At minimum an `id` attribute is required for identifying controllers. The `id` should be unique to each *instance* of a controller.
## Services
Along with a configuration, each controller is passed a collection of services during instantiation. These services are then used by the controller and made available via controller methods. Sometimes controllers might share a reference to a service (the `client` service for example), but in most cases a controller will have it's own instance of a service. Some services (like the `SearchStore`) share services with the controller (in the example above, the `UrlManager` is shared).

```typescript
{ client, store, urlManager, eventManager, profiler, logger }
```
### client
The `client` service makes the requests to the API when the controller `search` method is called. The response is passed onto the `store` service. This service is exposed as `controller.client`.

### store
This service mutates the API responses and adds convenience functions for common functionality. The `store` data is then used by the UI components for display. This service is exposed as `controller.store`.
### urlManager
`urlManager` is responsible for updating the page URL when interacting with UI components. The type of translator passed into the `UrlManager` constructor will determine the types of URLs generated. This service is exposed as `controller.urlManager`.
### eventManager
Middleware provide an opportunity to hook into these events they occur. Middleware are attached to events, and these events are managed by the `eventManager`. This service is exposed as `controller.eventManager`.

### profiler
Controllers may need to know how long a certain event took, the `profiler` service provides the means to track this information. This service is exposed as `controller.profiler`.

### logger
The `logger` service provides logging functionality to a controller. Each controller logs when errors in middleware and when controller events occur. The logger is responsible for sending this information to the developer console. In addition the logger may provide additional emoji or colors to use. This service is exposed as `controller.log`.


## Context
Each Controller can optionally take a 3rd parameter for `Context`. This is to allow each individual controller to have its own individual context if so desired.

The context is exposed as `controller.context`
```typescript
controller.context;
```


## Initialization
Invoking the `init` method is required to subscribe to changes that occur in the UrlManager. It also fires the `init` event which executes attached middleware. This can be fired manually as needed; if it was not manually fired it will happen automatically on the first call to the controller `search` method.

```typescript
controller.init();
```

## Searching
The `search` method of a controller will run the search that is expected by leveraging the `client` service to make the request; the subsequent response will be passed to the `store` service.

Most controllers will provide a means of manipulating the request and response using `beforeSearch` and `afterSearch` events respectively. Read on for details about events.

```typescript
controller.search();
```

## Stores
Different controller types will utilize different Snap Stores (typically of the same name). Each `store` will provide different properties and methods for its unique purposes. See the documentation for more details.

## Events
Each controller will fire various events. Some of the event names are shared between controllers for consistency (ex: `beforeSearch`, `afterSearch`, `afterStore`); however the attaching of middleware and execution of it must remain separate. This is why a new `EventManager` instance is created for each controller. Middleware are attached to events via the `on` method and the functions should almost always end with `await next()` unless purposefully preventing the next attached middleware from executing.

```typescript
controller.on('init', async (eventData, next) => {
	const { controller } = eventData;

	controller.log.debug('init event has occurred');

	await next();
});
```

Note: Groups of middleware (plugins) can be attached using the `plugin` method.

The data available within a middleware (first parameter) is determined by what gets passed into the `fire` method. For existing events on the controller, the `fire` method is already being called when appropriate to the event, and the `eventData` will typically be an object containing a reference to the controller and any other details that may be of importance to the particular event. Custom events can be created as needed; but keep in mind that any middleware tied to the event should be bound (using `on` or `plugin`) prior to the execution of the `fire` method.

```typescript
controller.eventManager.fire('customEventName', { thing1: 'one', thing2: 2 });
```

See the EventManager documentation for more details.

## Environment
A controller's environment is initialized at build time, and is used to control certain runtime behavior. For example, a `production` build will supress most logs while a `development` build will show them all.
## Logging
The logger provides a clear way of outputting details like profile data or errors to the developer console. A `production` build will supress most logs while a `development` build will show them all. The environment is automatically determined, but can be toggled during runtime by setting it to either `development` or `production`.

```typescript
controller.environment = 'development';
```

The use of `console.log()` is discouraged. Logging should be done via controller instance to help debug and navigate the sea of console logs. Each controller will output the `id` for easily deciphering which controller made the log.

```typescript
controller.log.warn('THIS IS A WARNING!');
```

Many logs are supressed depending on a development `environment` of the controller instance. The Logger documentation provides more details about the various methods, colors and emoji available.

## Controller Types
Each `Controller` has a unique configuration and set of default events; it may also provide additional methods for specific functionality.

### Abstract
The base class for all controllers.

### Autocomplete
Used for autocomplete searches.

### Finder
A specialized controller used for building custom product finders.

### Recommendation
The standard controller used for recommendation profiles.

### Search
The standard controller used on search pages and PLPs.