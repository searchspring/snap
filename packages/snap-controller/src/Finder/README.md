# FinderController

The `FinderController` should be used for building product finders. It makes queries to the API `search` endpoint.


## FinderControllerConfig

| option | description | default value | required | 
|---|---|:---:|:---:|
| id | unique identifier for this controller | ➖ | ✔️ |
| url | URL to be redirected to upon clicking finder's 'find' button | ➖ | ✔️ |
| globals | keys defined here will be passed to the API request (can overwrite global config)| ➖ |   |
| fields | an array of finder field configurations | ➖ | ✔️ |
| fields.field | required field name | ➖ | ✔️ |
| fields.label | optional finder label | ➖ |   |
| fields.levels | optional finder selection levels (hierarchy only) | ➖ |   |

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

## Instantiate
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
## Initialize
Invoking the `init` method is required to subscribe to changes that occur in the UrlManager.

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
- Always invoked by a call to the `init` controller method

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