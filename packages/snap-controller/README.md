# Snap Controller

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
<a href="https://www.npmjs.com/package/@searchspring/snap-controller"><img alt="NPM Status" src="https://img.shields.io/npm/v/@searchspring/snap-controller.svg?style=flat"></a>

The heart of controlling Search, Autocomplete, & Finder functionallity

---

# Dependencies

Snap Controller is a top level package that requires the following dependanies:

<a href="https://www.npmjs.com/package/@searchspring/snap-client-javascript"><img alt="NPM Status" src="https://img.shields.io/npm/v/@searchspring/snap-client-javascript.svg?style=flat"></a> [@searchspring/snap-client-javascript](../snap-client-javascript)

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



# Installation

```bash
npm install --save @searchspring/snap-controller @searchspring/snap-client-javascript @searchspring/snap-store-mobx @searchspring/snap-url-manager @searchspring/snap-event-manager @searchspring/snap-profiler @searchspring/snap-logger
```

# Usage
## Global Config
Object required for all controllers

`siteId` (required)

Any other keys defined here will be passed to the API request

```typescript
const globals = {
	siteId: 'scmq7n'
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
## Import
### CommonJS
```typescript
const SearchController = require('@searchspring/snap-controller');
```

### ES Module
```typescript
import { SearchController } from '@searchspring/snap-controller';
```

<h2 id="SearchController">SearchController</h2>

### Default Config
`id` - a unique identifier for this controller. Will appear in console log & warn

`globals` - keys defined here will be passed to the API request (overwrites global config)

`settings.redirects.merchandising` - merchandisings redirects

`settings.redirects.singleResult` - redirect to product detail page if search yields 1 result count

`settings.facets.trim` - facets that do not change results will be removed

```typescript
const searchConfig: SearchControllerConfig = {
	id: 'search',
	globals: {},
	settings: {
		redirects: {
			merchandising: true,
			singleResult: true,
		},
		facets: {
			trim: true,
		},
	},
};
```
### Instantiate
Search controller requires a `SearchControllerConfig` object and `ControllerServices` object

```typescript
import { SearchController } from '@searchspring/snap-controller';
import SnapClient from '@searchspring/snap-client-javascript';
import { SearchStore } from '@searchspring/snap-store-mobx';
import { UrlManager, QueryStringTranslator, reactLinker } from '@searchspring/snap-url-manager';
import { EventManager } from '@searchspring/snap-event-manager';
import { Profiler } from '@searchspring/snap-profiler';
import { Logger } from '@searchspring/snap-logger';

const searchController = new SearchController(searchConfig, {
        client: new SnapClient(globals, clientConfig),
        store: new SearchStore(),
        urlManager: new UrlManager(new QueryStringTranslator(), reactLinker),
        eventManager: new EventManager(),
        profiler: new Profiler(),
        logger: new Logger()
    }: ControllerServices
));
```
### Initialize
Invoking the `init` method is required to subscribe to changes that occur in the `url-manager` 

```typescript
searchController.init();
```

### Search
This will invoke an initial search request to Searchspring's search API and render results after the SearchStore has been populated
```typescript
searchController.search();
```

### Render
```typescript
import { h, render } from 'preact';

render(<Sidebar store={searchController.store} />, document.getElementById('searchspring-sidebar'));
render(<Content store={searchController.store} />, document.getElementById('searchspring-content'));
```

### SearchController Event lifecycle
Events are invoked in the following order:

#### init
- Must be called manually
- subscribes to changes in the urlManager

#### beforeSearch
- Always invoked before an API request is made 
- Sets `controller.store.loading = true`

#### afterSearch
- Always invoked after an API request is made 
- Invokes `window.location.replace()` if API response contains merchandising redirects AND if `searchConfig.settings.redirects.merchandising = true` (default)
- Invokes `window.location.replace()` to redirect to product detail page if API response returned a single product AND `searchConfig.settings.redirects.singleResult = true` (default)
- Sets `controller.store.loading = false`

#### afterStore
- Always invoked after data has been stored in mobx store
- no operation

<h2 id="AutocompleteController">AutocompleteController</h2>

### Default Config
`id` - a unique identifier for this controller. Will appear in console log & warn

`selector` - css selector that targets all search input(s)

`action` - If input does not contain a form, or you would like to override the form action

`globals` - keys defined here will be passed to the API request (overwrites global config)

`settings.initializeFromUrl` - initialize controller with query from url if present

`settings.syncInputs` - if selector targets multiple inputs, the value of those inputs will be synced

`settings.facets.trim` - facets that do not change results will be removed

```typescript
const autocompleteConfig: AutocompleteControllerConfig = {
	id: 'autocomplete',
	selector: '',
	action: '',
	globals: {},
	settings: {
		initializeFromUrl: true,
		syncInputs: false,
		facets: {
			trim: true,
		},
	},
};
```

### Instantiate
Autocomplete controller requires a `AutocompleteControllerConfig` object and `ControllerServices` object

```typescript
import { AutocompleteController } from '@searchspring/snap-controller';
import SnapClient from '@searchspring/snap-client-javascript';
import { AutocompleteStore } from '@searchspring/snap-store-mobx';
import { UrlManager, QueryStringTranslator, reactLinker } from '@searchspring/snap-url-manager';
import { EventManager } from '@searchspring/snap-event-manager';
import { Profiler } from '@searchspring/snap-profiler';
import { Logger } from '@searchspring/snap-logger';

const autocompleteController = new AutocompleteController(autocompleteConfig, {
        client: new SnapClient(globals, clientConfig),
        store: new AutocompleteStore(),
        urlManager: new UrlManager(new QueryStringTranslator({ queryParameter: 'search_query' }), reactLinker),
        eventManager: new EventManager(),
        profiler: new Profiler(),
        logger: new Logger()
    }: ControllerServices
));
```

### Initialize
Invoking the `init` method is required to subscribe to changes that occur in the `url-manager` 

```typescript
window.addEventListener('DOMContentLoaded', () => {
	autocompleteController.init();
});
```

### Bind
<!-- TODO: set/test link to DomTargeter -->
Invoking the `bind` method is required to attach event listeners to each input. See [@searchspring/snap-toolbox DomTargeter](../snap-toolbox/README.md#DomTargeter) for recommended usage 

```typescript
autocompleteController.bind();
```

### AutocompleteController Event lifecycle
Events are invoked in the following order:

#### init
- Must be called manually
- subscribes to changes in the urlManager

#### beforeSearch
- Always invoked before an API request is made 
- Sets `controller.store.loading = true`

#### afterSearch
- Always invoked after an API request is made 
- Sets `controller.store.loading = false`
- Cancels search if no input or query doesn't match current urlManager state

#### afterStore
- Always invoked after data has been stored in mobx store
- no operation

#### focusChange
- Invoked when an input has been focused
- no operation


<h2 id="FinderController">FinderController</h2>
### Default Config
<!-- TODO: add url, selector, wrapSelector, type, className ? -->
`id` - a unique identifier for this controller. Will appear in console log & warn

`globals` - keys defined here will be passed to the API request (overwrites global config)

`fields` - array of finder field configuration

`fields.field` - required field name

`fields.label` - optional finder label

`fields.levels` - optional finder selection levels

```typescript
const finderConfig: FinderControllerConfig = {
    id: 'finder',
	globals: {},
	fields: FinderFieldConfig[],
};

type FinderFieldConfig = {
	field: string;
	label?: string;
	levels?: string[];
};
```

#### Hierarchy Config
Specifying `levels` will display a dropdown for each hierarchy level. Finders that use hierarchy fields will enforce selecting dropdowns in order by disabling following dropdowns

```typescript
const finderConfig: FinderControllerConfig = {
    id: 'finder',
	globals: {},
	fields: [
        {
            field: 'ss_tire',
            label: 'Wheel Finder',
            levels: ['Year', 'Make', 'Model', 'Wheel Size'],
        },
    ]
};
```

Optionally if `levels` is not defined, a single dropdown will be displayed on initial load. Each selection will dynamically append additional dropdowns until there are no more available selections

```typescript
const finderConfig: FinderControllerConfig = {
    id: 'finder',
	globals: {},
	fields: [
        {
            field: 'ss_tire',
        },
    ]
};
```


#### Non-Hierarchy Config
If using fields are that not of hierarchy type, `levels` is not required

```typescript
const finderConfig: FinderControllerConfig = {
    id: 'finder',
	globals: {},
	fields: [
        { 
            field: 'custom_wheel_size' 
            label: 'Size',
        }, 
        { 
            field: 'custom_wheel_width' 
            label: 'Width',
        }, 
        { 
            field: 'custom_wheel_bolt_pattern' 
            label: 'Bolt Pattern',
        }, 
        { 
            field: 'custom_color'
            label: 'Color',
        }
    ]
};
```

### Installation

### Instantiate
Search controller requires a `SearchControllerConfig` object and `ControllerServices` object

```typescript
import { FinderController } from '@searchspring/snap-controller';
import SnapClient from '@searchspring/snap-client-javascript';
import { FinderStore } from '@searchspring/snap-store-mobx';
import { UrlManager, QueryStringTranslator, reactLinker } from '@searchspring/snap-url-manager';
import { EventManager } from '@searchspring/snap-event-manager';
import { Profiler } from '@searchspring/snap-profiler';
import { Logger } from '@searchspring/snap-logger';

const finderController = new FinderController(searchConfig, {
        client: new SnapClient(globals, clientConfig),
        store: new FinderStore(),
        urlManager: new UrlManager(new QueryStringTranslator(), reactLinker),
        eventManager: new EventManager(),
        profiler: new Profiler(),
        logger: new Logger()
    }: ControllerServices
));
```
### Initialize
Invoking the `init` method is required to subscribe to changes that occur in the `url-manager` 

```typescript
finderController.init();
```

### Search
This will invoke an initial search request to Searchspring's search API and render results after the FinderStore has been populated
```typescript
finderController.search();
```

### FinderController Event lifecycle
Events are invoked in the following order:

#### init
- Must be called manually
- subscribes to changes in the urlManager

#### beforeSearch
- Always invoked before an API request is made 
- Sets `controller.store.loading = true`

#### afterSearch
- Always invoked after an API request is made 
- Sets `controller.store.loading = false`

#### afterStore
- Always invoked after data has been stored in mobx store
- no operation


## Middlewear (Search, Autocomplete, & Finder Controllers)

### `use` method
Apply multiple event middlewear using the `use` method

If `next()` is not called or `false` is returned, the middlewear chain will not continue
```typescript
const middleware = (controller) => {
    controller.on('afterStore', ({ controller }, next) => {
        // keep the same position when a user clicks on a facet
        if (controller.store.pagination.page != 1) { 
            window.scroll({ top: 0, left: 0, behavior: 'smooth' });
        }
		next();
	});
}
searchController.use(middlewear);
```

### `on` method
Alternatively, you can also use the `on` method. Invoking `next()` is not required here
```typescript
searchController.on('init', async ({ controller }) => {});
```