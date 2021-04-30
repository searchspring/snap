# Snap Controller

<a href="https://www.npmjs.com/package/@searchspring/snap-controller"><img alt="NPM Status" src="https://img.shields.io/npm/v/@searchspring/snap-controller.svg?style=flat"></a>

The heart of controlling Search, Autocomplete, & Finder functionality. The Controller is responsible for tying various Snap services together.

---

# Dependencies

Snap Controller is a top-level package that requires the following dependencies as services:

<a href="https://www.npmjs.com/package/@searchspring/snap-client"><img alt="NPM Status" src="https://img.shields.io/npm/v/@searchspring/snap-client.svg?style=flat"></a> [@searchspring/snap-client](../snap-client)

<a href="https://www.npmjs.com/package/@searchspring/snap-store-mobx"><img alt="NPM Status" src="https://img.shields.io/npm/v/@searchspring/snap-store-mobx.svg?style=flat"></a> [@searchspring/snap-store-mobx](../snap-store-mobx)

<a href="https://www.npmjs.com/package/@searchspring/snap-url-manager"><img alt="NPM Status" src="https://img.shields.io/npm/v/@searchspring/snap-url-manager.svg?style=flat"></a> [@searchspring/snap-url-manager](../snap-url-manager)

<a href="https://www.npmjs.com/package/@searchspring/snap-event-manager"><img alt="NPM Status" src="https://img.shields.io/npm/v/@searchspring/snap-event-manager.svg?style=flat"></a> [@searchspring/snap-event-manager](../snap-event-manager)

<a href="https://www.npmjs.com/package/@searchspring/snap-profiler"><img alt="NPM Status" src="https://img.shields.io/npm/v/@searchspring/snap-profiler.svg?style=flat"></a> [@searchspring/snap-profiler](../snap-profiler)

<a href="https://www.npmjs.com/package/@searchspring/snap-logger"><img alt="NPM Status" src="https://img.shields.io/npm/v/@searchspring/snap-logger.svg?style=flat"></a> [@searchspring/snap-logger](../snap-logger)

<details>
	<summary>Package dependencies hierarchy</summary>
	<br/>
	<img src="../../images/snap-dependencies.jpg"/>
</details>

<br>

# Installation

To install the `snap-controller` package and it's services:

```bash
npm install --save @searchspring/snap-controller @searchspring/snap-client @searchspring/snap-store-mobx @searchspring/snap-url-manager @searchspring/snap-event-manager @searchspring/snap-profiler @searchspring/snap-logger
```

# Usage

## Instantiation
Each `Controller` must be passed a configuration object as the first parameter to the constructor, and a services object (dependencies) as the second. The contents of these objects will depend on which type of `Controller` is being instantiated. For example, a `SearchController` would usually be paired with a `SearchStore` service, and would take a `SearchControllerConfig` configuration object.

The complete example below shows how a `SearchController` could be instatiated, initialized and searched:

```typescript
import { SearchController } from '@searchspring/snap-controller';
import SnapClient from '@searchspring/snap-client';
import { SearchStore } from '@searchspring/snap-store-mobx';
import { UrlManager, UrlTranslator, reactLinker } from '@searchspring/snap-url-manager';
import { EventManager } from '@searchspring/snap-event-manager';
import { Profiler } from '@searchspring/snap-profiler';
import { Logger } from '@searchspring/snap-logger';

const configuration = {
	id: 'search'
};

const services = {
	client: new SnapClient({ siteId: 'abc123' }),
	store: new SearchStore(),
	urlManager: new UrlManager(new UrlTranslator(), reactLinker),
	eventManager: new EventManager(),
	profiler: new Profiler(),
	logger: new Logger()
}

const controller = new SearchController(configuration, services);
controller.init();
controller.search();
```

## Configuration
The configuration object provided during instantiation provides a way of configuring the controller for different behavior. Each controller type (`SearchController`, `AutocompleteController`, `FinderController`, etc...) has default configurations that can be modified with the instantiation configuration object. At minimum an `id` attribute is required for identifying controllers. The `id` should be unique to each *instance* of a controller.
## Services
Along with a configuration, each controller is passed a collection of services during instantiation. These services are then used by the controller and made available via controller methods. Sometimes controllers might share a reference to a service (the `client` service for example), but in most cases a controller will have it's own instance of a service.

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

## Initialization
Invoking the `init` method is required to subscribe to changes that occur in the UrlManager. It also fires the `init` event which executes attached middleware. This should happen prior to any calls to the controller `search` method.

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

Note: Groups of middleware (plugins) can be attached using the `use` method.

The data available within a middleware (first parameter) is determined by what gets passed into the `fire` method. For existing events on the controller, the `fire` method is already being called when appropriate to the event, and the `eventData` will typically be an object containing a reference to the controller and any other details that may be of importance to the particular event. Custom events can be created as needed; but keep in mind that any middleware tied to the event should be bound (using `on` or `use`) prior to executing the `fire` method.

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

# Controller Types
Each `Controller` has a unique configuration and set of default events; it may also provide additional methods for specific functionality.

<h2 id="SearchController">SearchController</h2>

The `SearchController` is used when making queries to the API `search` endpoint.

### SearchControllerConfig

| option | description | default value | required | 
|---|---|---|---|
| id | unique identifier for this controller | :heavy_minus_sign: | :heavy_check_mark: |
| globals | keys defined here will be passed to the API request (can overwrite global config)| :heavy_minus_sign: |   |
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
### Instantiate
`SearchController` requires a `SearchControllerConfig` and `ControllerServices` object and is usually paired with a `SearchStore`.

```typescript
import { SearchController } from '@searchspring/snap-controller';
import SnapClient from '@searchspring/snap-client';
import { SearchStore } from '@searchspring/snap-store-mobx';
import { UrlManager, UrlTranslator, reactLinker } from '@searchspring/snap-url-manager';
import { EventManager } from '@searchspring/snap-event-manager';
import { Profiler } from '@searchspring/snap-profiler';
import { Logger } from '@searchspring/snap-logger';

const searchController = new SearchController(searchConfig, {
	client: new SnapClient({ siteId: 'abc123' }),
	store: new SearchStore(),
	urlManager: new UrlManager(new UrlTranslator(), reactLinker),
	eventManager: new EventManager(),
	profiler: new Profiler(),
	logger: new Logger()
});
```

### Initialize
Invoking the `init` method is required to subscribe to changes that occur in the UrlManager.

```typescript
searchController.init();
```

### Search
This will invoke a search request to Searchspring's search API and populate the store with the response.

```typescript
searchController.search();
```

### Events

#### init
- Called with `eventData` = { controller }
- Always invoked by a call to the `init` controller method

#### beforeSearch
- Called with `eventData` = { controller, request }
- Always invoked before an API request is made 
- Sets `controller.store.loading = true`

#### afterSearch
- Called with `eventData` = { controller, request, response }
- Always invoked after an API request is made 
- Invokes `window.location.replace()` if API response contains merchandising redirects AND if `config.settings.redirects.merchandising = true` (default)
- Invokes `window.location.replace()` to redirect to product detail page if API response returned a single product AND `config.settings.redirects.singleResult = true` (default)
- Sets `controller.store.loading = false`

#### afterStore
- Called with `eventData` = { controller, request, response }
- Always invoked after data has been stored in mobx store

<h2 id="AutocompleteController">AutocompleteController</h2>

The `AutocompleteController` is used when making queries to the API `autocomplete` endpoint. It can also bind events to DOM elements to handle user input of queries.

### AutocompleteControllerConfig

| option | description | default value | required | 
|---|---|:---:|:---:|
| id | unique identifier for this controller | :heavy_minus_sign: | :heavy_check_mark: |
| selector | css selector for input elements that DOM events should be bound to | :heavy_minus_sign: | :heavy_check_mark: |
| action | optional way to override the form action or provide one when it does not exist | :heavy_minus_sign: |   |
| globals | keys defined here will be passed to the API request (can overwrite global config)| :heavy_minus_sign: |   |
| settings.initializeFromUrl | initialize the controller with query parameter from URL (pre-fill input with current search) | true |   |
| settings.syncInputs | if the selector targets multiple inputs, the value of those inputs will be synced | false |   |
| settings.facets.trim | facets that do not change results will be removed | true |   |

<br>

```typescript
const autocompleteConfig = {
	id: 'autocomplete',
	selector: '#searchInput',
	settings: {
		syncInputs: true
	},
};
```

### Instantiate
`AutocompleteController` requires an `AutocompleteControllerConfig` and `ControllerServices` object and is usually paired with an `AutocompleteStore`.

```typescript
import { AutocompleteController } from '@searchspring/snap-controller';
import SnapClient from '@searchspring/snap-client';
import { AutocompleteStore } from '@searchspring/snap-store-mobx';
import { UrlManager, UrlTranslator, reactLinker } from '@searchspring/snap-url-manager';
import { EventManager } from '@searchspring/snap-event-manager';
import { Profiler } from '@searchspring/snap-profiler';
import { Logger } from '@searchspring/snap-logger';

const autocompleteController = new AutocompleteController(autocompleteConfig, {
		client: new SnapClient(globals, clientConfig),
		store: new AutocompleteStore(),
		urlManager: new UrlManager(new UrlTranslator(), reactLinker),
		eventManager: new EventManager(),
		profiler: new Profiler(),
		logger: new Logger()
	}
));
```

### Initialize
Invoking the `init` method is required to subscribe to changes that occur in the UrlManager.

```typescript
autocompleteController.init();
```

### Bind
<!-- TODO: set/test link to DomTargeter -->
Invoking the `bind` method is required to attach event listeners to each input specified as `selector` in the `AutocompleteControllerConfig`.

```typescript
autocompleteController.bind();
```

### Search
This will invoke a search request to Searchspring's search API and populate the store with the response. This should be automatically called by the DOM event binding that occurs when the `bind` method (see above) is invoked.

```typescript
autocompleteController.search();
```

### Events
#### init
- Called with `eventData` = { controller }
- Always invoked by a call to the `init` controller method

#### beforeSearch
- Called with `eventData` = { controller, request }
- Always invoked before an API request is made 
- Sets `controller.store.loading = true`

#### afterSearch
- Called with `eventData` = { controller, request, response }
- Always invoked after an API request is made 
- Sets `controller.store.loading = false`
- Cancels search if input doesn't match current urlManager input state

#### afterStore
- Called with `eventData` = { controller, request, response }
- Always invoked after data has been stored in mobx store

#### focusChange
- Called with `eventData` = { controller }
- Invoked when an input has been focused


<h2 id="FinderController">FinderController</h2>

The `FinderController` should be used for building product finders. It makes queries to the API `search` endpoint.


### FinderControllerConfig

| option | description | default value | required | 
|---|---|:---:|:---:|
| id | unique identifier for this controller | :heavy_minus_sign: | :heavy_check_mark: |
| url | URL to be redirected to upon clicking finder's 'find' button | :heavy_minus_sign: | :heavy_check_mark: |
| globals | keys defined here will be passed to the API request (can overwrite global config)| :heavy_minus_sign: |   |
| fields | an array of finder field configurations | :heavy_minus_sign: | :heavy_check_mark: |
| fields.field | required field name | :heavy_minus_sign: | :heavy_check_mark: |
| fields.label | optional finder label | :heavy_minus_sign: |   |
| fields.levels | optional finder selection levels (hierarchy only) | :heavy_minus_sign: |   |

<br>

<h4 id="HierarchyConfig">Hierarchy Config</h4>
Specifying `levels` will display a dropdown for each hierarchy level. Finders that use hierarchy fields will enforce selecting dropdowns in order by disabling the following dropdowns

```typescript
const finderConfig = {
	id: 'finder',
	url: '/search',
	fields: [
		{
			field: 'ss_tire',
			label: 'Wheel Finder',
			levels: ['Year', 'Make', 'Model', 'Wheel Size']
		},
	]
};
```

Optionally if `levels` are not defined, a single dropdown will be displayed on the initial load. Each selection will dynamically append additional dropdowns until there are no more available selections

```typescript
const finderConfig = {
	id: 'finder',
	url: '/search',
	fields: [
		{
			field: 'ss_tire'
		}
	]
};
```

<h4 id="NonHierarchyConfig">Non-Hierarchy Config</h4>
If using fields that are not of hierarchy type, `levels` are not required

```typescript
const finderConfig = {
	id: 'finder',
	url: '/search',
	fields: [
		{ 
			field: 'custom_wheel_size' 
			label: 'Size'
		}, 
		{ 
			field: 'custom_wheel_width' 
			label: 'Width'
		}, 
		{ 
			field: 'custom_wheel_bolt_pattern' 
			label: 'Bolt Pattern'
		}, 
		{ 
			field: 'custom_color'
			label: 'Color'
		}
	]
};
```

### Instantiate
`FinderController` requires a `FinderControllerConfig` and `ControllerServices` object and is usually paired with a `FinderStore`.

```typescript
import { FinderController } from '@searchspring/snap-controller';
import SnapClient from '@searchspring/snap-client';
import { FinderStore } from '@searchspring/snap-store-mobx';
import { UrlManager, UrlTranslator, reactLinker } from '@searchspring/snap-url-manager';
import { EventManager } from '@searchspring/snap-event-manager';
import { Profiler } from '@searchspring/snap-profiler';
import { Logger } from '@searchspring/snap-logger';

const finderController = new FinderController(finderConfig, {
		client: new SnapClient(globals, clientConfig),
		store: new FinderStore(),
		urlManager: new UrlManager(new UrlTranslator(), reactLinker),
		eventManager: new EventManager(),
		profiler: new Profiler(),
		logger: new Logger()
	}
));
```
### Initialize
Invoking the `init` method is required to subscribe to changes that occur in the UrlManager.

```typescript
finderController.init();
```

### Search
This will invoke a search request to Searchspring's search API and populate the store with the response. This should be called initially and after finder selections have been made.

```typescript
finderController.search();
```

### Find
After selection(s) have been made, the user will click on a 'Find' button. This click event should invoke the `find` method of the `FinderController` which will redirect to the specified `url` in the config, along with its selection data.

```typescript
finderController.find();
```

### Reset
This mthod should be invoked to 'reset' or remove all finder selections. This will also clear out any persisted selection storage data.

```typescript
finderController.reset();
```

### Events
#### init
- Called with `eventData` = { controller }
- Always invoked by a call to the `init` controller method

#### beforeSearch
- Called with `eventData` = { controller, request }
- Always invoked before an API request is made 
- Sets `controller.store.loading = true`

#### afterSearch
- Called with `eventData` = { controller, request, response }
- Always invoked after an API request is made 
- Sets `controller.store.loading = false`

#### afterStore
- Called with `eventData` = { controller, request, response }
- Always invoked after data has been stored in mobx store
- no operation