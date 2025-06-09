# RecommendationController

The `RecommendationController` is used when making queries to the API `recommend` endpoint. It can also bind events to DOM elements to handle user input of queries.

## RecommendationControllerConfig

| option | description | default value | required | 
|---|---|:---:|:---:|
| id | unique identifier for this controller | ➖ | ✔️ |
| tag | unique name of the recommendations profile | ➖ | ✔️ |
| realtime | update recommendations if cart contents change (requires [cart attribute tracking](https://github.com/searchspring/snap/blob/main/docs/INTEGRATION.md)) | ➖ |   |
| batched | batch multiple recommendations into a single network request | true |   |
| limit | maximum number of results to display, can also be set globally via globals | 20 |  |
| globals | keys defined here will be passed to the API request (can overwrite global config)| ➖ |   |
| settings.searchOnPageShow | causes a search to be conducted when returning using browser back/forward cache | true |   | 
| settings.variants.field | used to set the field in which to grab the variant data from | ➖ |   | 
| settings.variants.realtime.enabled | enable real time variant updates | ➖ |   | 
| settings.variants.realtime.filters | specify which filters to use to determine which results are updated | ➖ |   | 
| settings.variants.options | object keyed by option individual option field values for configuration of any option settings  | ➖ |   | 
<br>

```typescript
const recommendationConfig = {
	id: 'recommend',
	tag: 'trending',
};
```

## Instantiate
`RecommendationController` requires an `RecommendationControllerConfig` and `ControllerServices` object and is paired with an `RecommendationStore`. The `RecommendationStore` takes the same config, and shares the `UrlManager` service with the controller.

```typescript
import { RecommendationController } from '@searchspring/snap-controller';
import { Client } from '@searchspring/snap-client';
import { RecommendationStore } from '@searchspring/snap-store-mobx';
import { UrlManager, UrlTranslator, reactLinker } from '@searchspring/snap-url-manager';
import { EventManager } from '@searchspring/snap-event-manager';
import { Profiler } from '@searchspring/snap-profiler';
import { Logger } from '@searchspring/snap-logger';
import { Tracker } from '@searchspring/snap-tracker';

const recommendationUrlManager = new UrlManager(new UrlTranslator(), reactLinker).detach(0);
const recommendationController = new RecommendationController(recommendationConfig, {
		client: new Client(globals, clientConfig),
		store: new RecommendationsStore(recommendationConfig, { urlManager: recommendationUrlManager }),
		urlManager: recommendationUrlManager,
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
recommendationController.init();
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
- Cancels search if input doesn't match current urlManager input state

### afterStore
- Called with `eventData` = { controller, request, response }
- Always invoked after data has been stored in mobx store

### track.product.clickThrough
- Called with `eventData` = { controller, event, result, trackEvent } 
- Always invoked after `track.product.clickThrough()` or `track.product.click()` method has been invoked
- Allows for adding custom product click events (ie. Google Analytics)

### track.product.impression
- Called with `eventData` = { controller, result, trackEvent } 
- Always invoked after `track.product.impression()` method has been invoked

### track.product.render
- Called with `eventData` = { controller, result, trackEvent } 
- Always invoked after `track.product.render()` method has been invoked

### track.product.addToCart
- Called with `eventData` = { controller, product, trackEvent } 
- Always invoked after `track.product.addToCart()` method has been invoked

### addToCart
- Called with `eventData` = { controller, products } 
- Always invoked after `controller.addToCart()` method has been invoked

## Variants

### Variant Options Configuration
The `settings.variants.options` is an object keyed by individual option field name for configuration of any option settings.

| option | description | default value | required | 
|---|---|:---:|:---:|
| label | allows for changing the label of the option - (color -> colour) | ➖ |   | 
| preSelected | array of option values to preselect - ['red','blue'] | ➖ |   | 
| thumbnailBackgroundImages | boolean used for setting the option background image as the variant thumbnail image  | ➖ |   | 
| mappings | object keyed by individual optionValues for mapping value attribute overrides  | ➖ |   | 
| mappings[optionValue].label | setting to override the value label  | ➖ |   | 
| mappings[optionValue].background | setting to override the value background  | ➖ |   | 
| mappings[optionValue].backgroundImageUrl | setting to override the value backgroundImageUrl  | ➖ |   | 

```jsx
const config = {
	settings:  {
		variants: {
			field: "ss__variants",
			options: {
				color: {
					label: "Colour",
					preSelected: ['transparent'],
					mappings: {
						red: {
							label: 'Cherry',
							backroundImageUrl: '/images/cherry.png'
						},
						blue: {
							label: "Sky",
							background: "teal",
						}
					}
				}
			}
		}
	}	
}
```

### Realtime Variants

#### Variant Option Attributes:
When `realtime` is enabled the attributes `ss-variant-option` and `ss-variant-option-selected` are queried for and used to determine current variant selection and to also attach click events to know when to adjust variant selections in the selection stores. These attributes are needed in order for realtime variants to work properly. 

The attributes are to be added on each variant option in the platform product page main option buttons. The `ss-variant-option` attribute also expects a value of the option feild and option value seperated by a `:`. 

```jsx
<div>
	<a href="/products/tee--red" ss-variant-option="Color:red" ss-variant-option-selected>Red</a>
	<a href="/products/tee--blue" ss-variant-option="Color:Blue">Blue</a>
	<a href="/products/tee--green" ss-variant-option="Color:Green">Green</a>
	<a href="/products/tee--yellow" ss-variant-option="Color:Yellow">Yellow</a>
</div>
```

### Variant Option filters:
When `realtime` is enabled, by default the realtime updates will apply to all results in the store that have matching options available. However if this is not desired behaviour you may pass an array of filters to `settings.variants.realtime.filters`. 

Available filters include `first` and `unaltered`. The `first` filter will only update the first result in the store. The `unaltered` filter will update any result that has not yet been altered by the user. 

