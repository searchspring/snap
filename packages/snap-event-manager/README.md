# Snap Event Manager

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
<a href="https://www.npmjs.com/package/@searchspring/snap-event-manager"><img alt="NPM Status" src="https://img.shields.io/npm/v/@searchspring/snap-event-manager.svg?style=flat"></a>

The Snap Event Manager allows you to hook into controller events before data is rendered.

It also allows for custom defined events to be used throughout your implementation.

---

# Dependency

Snap Event Manager is a dependancy of [@searchspring/snap-controller](../snap-controller) <a href="https://www.npmjs.com/package/@searchspring/snap-controller"><img alt="NPM Status" src="https://img.shields.io/npm/v/@searchspring/snap-controller.svg?style=flat"></a>


<details>
    <summary>Package dependencies hierarchy</summary>
    <br/>
    <img src="../../images/snap-dependencies.jpg" width="500">
</details>


# Installation

```bash
npm install --save @searchspring/snap-event-manager
```

# Events
|                                                                      | `[custom event]`   | init               | beforeSearch       | afterSearch        | afterStore         | focusChange        | 
| --:                                                                  | :-:                | :-:                | :-:                | :-:                | :-:                | :-:                |
| [SearchController](../snap-controller/#SearchController)             | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: |                    |
| [AutocompleteController](../snap-controller/#AutocompleteController) | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| [FinderController](../snap-controller/#FinderController)             | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: |                    |


## custom event
Must first be defined using `on` method before called using `fire` method

## init
The `init` event must be called after instantiating an instance of any Controller in order for changes in the urlManager to take effect by subscribing to changes.

Therefore, we reccomend using the respective Controller's `init` method instead of invoking the init event directly using `fire` method

Recommended:
```typescript
import { SearchController, AutocompleteController, FinderController } from '@searchspring/snap-controller';

const searchController = new SearchController(...);
const autocompleteController = new AutocompleteController(...);
const finderController = new FinderController(...);

searchController.init();
autocompleteController.init();
finderController.init();
```

Not Recommended:
```typescript
eventManager.fire('init')
```


## beforeSearch
- Always invoked before an API request is made 
- Sets `controller.store.loading = true`

## afterSearch
- Always invoked after an API request is made 
- Sets `controller.store.loading = false`
- When using SearchController:
    - Invokes `window.location.replace()` if API response contains merchandising redirects AND if `searchConfig.settings.redirects.merchandising = true` (default)
    - Invokes `window.location.replace()` to redirect to product detail page if API response returned a single product AND `searchConfig.settings.redirects.singleResult = true` (default)
- When using AutocompleteController:
    - Cancels search if no input or query doesn't match current urlManager state

## afterStore
- Always invoked after data has been stored in mobx store
- no operation



# Usage
## Import
### CommonJS
```typescript
const SnapClient = require('@searchspring/snap-client-javascript');
```

### ES Module
```typescript
import { EventManager } from '@searchspring/snap-event-manager';
```

## `on` method
Adds a new event to event manager

### Controller usage
Snap Event Manager is a dependancy of Snap Controller. It is recommended to use the `on` method on the controller to attach events to the EventManager provided to the Controller constructor

Recommended:
```typescript
import { SearchController } from '@searchspring/snap-controller';
import SnapClient from '@searchspring/snap-client-javascript';
import { SearchStore } from '@searchspring/snap-store-mobx';
import { UrlManager, QueryStringTranslator, reactLinker } from '@searchspring/snap-url-manager';
import { EventManager } from '@searchspring/snap-event-manager';
import { Profiler } from '@searchspring/snap-profiler';
import { Logger } from '@searchspring/snap-logger';

const searchController = new SearchController(searchConfig, {
        // client: new SnapClient(globals, clientConfig),
        // store: new SearchStore(),
        // urlManager: new UrlManager(new QueryStringTranslator(), reactLinker),
        
        eventManager: new EventManager(), // <---

        // profiler: new Profiler(),
        // logger: new Logger()
    }: ControllerServices
));

searchController.on('init', ({ controller }) => {
    console.log(controller)
})

searchController.init();
```

### Standalone usage
```typescript
const eventManager = new EventManager();

eventManager.on('init', () => {
    // code
});

eventManager.on('domReady', () => {
    // code
});
```

## `fire` method
Invokes event from event manager

### Controller usage
Snap Event Manager is a dependancy of Snap Controller. It is recommended to use the `fire` method by accessing the EventManager through the Controller

```typescript
import { SearchController } from '@searchspring/snap-controller';
import SnapClient from '@searchspring/snap-client-javascript';
import { SearchStore } from '@searchspring/snap-store-mobx';
import { UrlManager, QueryStringTranslator, reactLinker } from '@searchspring/snap-url-manager';
import { EventManager } from '@searchspring/snap-event-manager';
import { Profiler } from '@searchspring/snap-profiler';
import { Logger } from '@searchspring/snap-logger';

const searchController = new SearchController(searchConfig, {
        // client: new SnapClient(globals, clientConfig),
        // store: new SearchStore(),
        // urlManager: new UrlManager(new QueryStringTranslator(), reactLinker),
        
        eventManager: new EventManager(), // <---

        // profiler: new Profiler(),
        // logger: new Logger()
    }: ControllerServices
));

searchController.on('scrollToTop', ({ controller }) => {
    // keep the same position when a user clicks on a facet
	if (controller.store.pagination.page != 1) {
        window.scroll({ top: 0, left: 0, behavior: 'smooth' });
    }
})

searchController.eventManager.fire('scrollToTop')
```

### Standalone usage
```typescript
const eventManager = new EventManager();

eventManager.on('scrollToTop', () => {
    // keep the same position when a user clicks on a facet
	if (controller.store.pagination.page != 1) {
        window.scroll({ top: 0, left: 0, behavior: 'smooth' });
    }
});

eventManager.fire('scrollToTop')
```


