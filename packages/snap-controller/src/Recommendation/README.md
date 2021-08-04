# RecommendationController

The `RecommendationController` is used when making queries to the API `recommend` endpoint. It can also bind events to DOM elements to handle user input of queries.

## RecommendationControllerConfig

| option | description | default value | required | 
|---|---|:---:|:---:|
| id | unique identifier for this controller | ➖ | ✔️ |
| tag | unique name of the recommendations profile | ➖ | ✔️ |
| globals | keys defined here will be passed to the API request (can overwrite global config)| ➖ |   |

<br>

```typescript
const recommendationConfig = {
	id: 'recommend',
	tag: 'trending',
};
```

## Instantiate
`RecommendationController` requires an `RecommendationControllerConfig` and `ControllerServices` object and is usually paired with an `RecommendationStore`.

```typescript
import { RecommendationController } from '@searchspring/snap-controller';
import { Client } from '@searchspring/snap-client';
import { RecommendationStore } from '@searchspring/snap-store-mobx';
import { UrlManager, UrlTranslator, reactLinker } from '@searchspring/snap-url-manager';
import { EventManager } from '@searchspring/snap-event-manager';
import { Profiler } from '@searchspring/snap-profiler';
import { Logger } from '@searchspring/snap-logger';
import { Tracker } from '@searchspring/snap-tracker';

const recommendationController = new RecommendationController(recommendationConfig, {
		client: new Client(globals, clientConfig),
		store: new RecommendationsStore(),
		urlManager: new UrlManager(new UrlTranslator(), reactLinker),
		eventManager: new EventManager(),
		profiler: new Profiler(),
		logger: new Logger(),
		tracker: new Tracker(),
	}
));
```

## Initialize
Invoking the `init` method is required to subscribe to changes that occur in the UrlManager.

```typescript
recommendationController.init();
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
- Cancels search if input doesn't match current urlManager input state

### afterStore
- Called with `eventData` = { controller, request, response }
- Always invoked after data has been stored in mobx store

### track.product.click
- Called with `eventData` = { controller, event, result, trackEvent } 
- Always invoked after `track.product.click()` method has been invoked
- Allows for adding custom product click events (ie. Google Analytics)

### track.product.impression
- Called with `eventData` = { controller, result, trackEvent } 
- Always invoked after `track.product.impression()` method has been invoked

### track.product.render
- Called with `eventData` = { controller, result, trackEvent } 
- Always invoked after `track.product.render()` method has been invoked

### track.click
- Called with `eventData` = { controller, event, trackEvent } 
- Always invoked after `track.click()` method has been invoked

### track.impression
- Called with `eventData` = { controller, trackEvent } 
- Always invoked after `track.impression()` method has been invoked

### track.render
- Called with `eventData` = { controller, trackEvent } 
- Always invoked after `track.render()` method has been invoked
