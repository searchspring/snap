# FinderController

The `FinderController` should be used for building product finders. It makes queries to the API `search` endpoint.


## FinderControllerConfig

| option | description | default value | required | 
|---|---|:---:|:---:|
| id | unique identifier for this controller | ➖ | ✔️ |
| url | URL to be redirected to upon clicking finder's 'find' button | ➖ | ✔️ |
| globals | keys defined here will be passed to the [API request](https://snapi.kube.searchspring.io/api/v1/) (can overwrite global config)| ```{ pagination: { pageSize: 0 } }``` |   |
| fields | an array of finder field configurations | ➖ | ✔️ |
| fields.field | required field name | ➖ | ✔️ |
| fields.label | optional finder label | ➖ |   |
| fields.levels | optional finder selection levels (hierarchy only) | ➖ |   |
| persist | optional object to configure persisting finder selections across navigation | ```{ enabled: false, lockSelections: true, expiration: 0 }``` |   |
| persist.enabled | boolean to enable persisting | false | ✔️ |
| persist.lockSelections | boolean to lock selections upon loading persisted selections | true |   |
| persist.expiration | number of milliseconds before persisted selections are expired | 0 (don't expire) |   |

<br>

<h3 id="HierarchyConfig">Hierarchy Config</h3>
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

<h3 id="NonHierarchyConfig">Non-Hierarchy Config</h3>
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

### Persisting Selections
Persisting selections allow for finder selections to be persisted across page navigation. If enabled, selections are saved to the browser's local storage upon invoking the controller's `find` method. Selections are then populated automatically upon the next instantiation. (Default: `false`)

```typescript
const finderConfig = {
	id: 'finder',
	url: '/search',
	persist: {
		enabled: true,
	},
	fields: [...]
};
```

#### expiration
Persisted selections will reset automatically if the `persist.expiration` duration has elapsed (milliseconds), or the `config` itself has changed over time. (Default: `0`, never expires)

```typescript
const finderConfig = {
	id: 'finder',
	url: '/search',
	persist: {
		enabled: true,
		expiration: 0,
	},
	fields: [...]
};
```

#### lockSelections
The `config.persist.lockSelections` option will disable selections from being changed after they have been persisted. This forces the user to reset the selections by invoking the controller's `reset` method and making new selections. (Default: `true`)

```typescript
const finderConfig = {
	id: 'finder',
	url: '/search',
	persist: {
		enabled: true,
		lockSelections: true,
	},
	fields: [...]
};
```


## Instantiate
`FinderController` requires a `FinderControllerConfig` and `ControllerServices` object and is paired with a `FinderStore`. The `FinderStore` takes the same config, and shares the `UrlManager` service with the controller.

```typescript
import { FinderController } from '@searchspring/snap-controller';
import { Client } from '@searchspring/snap-client';
import { FinderStore } from '@searchspring/snap-store-mobx';
import { UrlManager, UrlTranslator, reactLinker } from '@searchspring/snap-url-manager';
import { EventManager } from '@searchspring/snap-event-manager';
import { Profiler } from '@searchspring/snap-profiler';
import { Logger } from '@searchspring/snap-logger';
import { Tracker } from '@searchspring/snap-tracker';

const finderUrlManager = new UrlManager(new UrlTranslator(), reactLinker).detach(0);
const finderController = new FinderController(finderConfig, {
		client: new Client(globals, clientConfig),
		store: new FinderStore(finderConfig, { urlManager: finderUrlManager }),
		urlManager: finderUrlManager,
		eventManager: new EventManager(),
		profiler: new Profiler(),
		logger: new Logger(),
		tracker: new Tracker(),
	}
));
```
## Initialize
Invoking the `init` method is required to subscribe to changes that occur in the UrlManager. This is typically done automatically prior to calling the first `search`.

```typescript
finderController.init();
```

## Search
This will invoke a search request to Searchspring's search API and populate the store with the response. This should be called initially and after finder selections have been made.

```typescript
finderController.search();
```

## Find
After selection(s) have been made, the user will click on a 'Find' button. This click event should invoke the `find` method of the `FinderController` which will redirect to the specified `url` in the config, along with its selection data.

```typescript
finderController.find();
```

## Reset
This mthod should be invoked to 'reset' or remove all finder selections. This will also clear out any persisted selection storage data.

```typescript
finderController.reset();
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
- Sets `controller.store.loading = false`

### afterStore
- Called with `eventData` = { controller, request, response }
- Always invoked after data has been stored in mobx store
- no operation

###  beforeFind
- Called with `eventData` = { controller }
- Invoked after invoking the `find` method, before `window.location.href` is changed
