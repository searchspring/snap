# AutocompleteController

The `AutocompleteController` is used when making queries to the API `autocomplete` endpoint. It can also bind events to DOM elements to handle user input of queries.

## AutocompleteControllerConfig

| option | description | default value | required | 
|---|---|:---:|:---:|
| id | unique identifier for this controller | ➖ | ✔️ |
| selector | css selector for input elements that DOM events should be bound to | ➖ | ✔️ |
| action | optional way to override the form action or provide one when it does not exist | ➖ |   |
| globals | keys defined here will be passed to the API request (can overwrite global config)| ➖ |   |
| settings.integratedSpellCorrection | integrated spell correction feature flag | false |   |
| settings.initializeFromUrl | initialize the controller with query parameter from URL (pre-fill input with current search) | true |   |
| settings.disableClickOutside | prevent the autocomplete from closing on clicks to the document | false |   |
| settings.syncInputs | if the selector targets multiple inputs, the value of those inputs will be synced | true |   |
| settings.serializeForm | if no action is specified in the config and a form element is found for the input, additional elements that are found will be added to the generated URLs (eg. hidden form input) | false |   |
| settings.facets.trim | facets that do not change results will be removed | true |   |
| settings.trending.limit | when set, trending (popular) queries will be fetched and made available in the trending store | ➖ |   | 
| settings.trending.showResults | if trending limit is set and there is no input, the first term results will be displayed | false |   | 
| settings.history.limit | when set, historical (previously searched) queries will be fetched and made available in the history store | ➖ |   | 
| settings.history.showResults | if history limit is set and there is no input, the first term results will be displayed | false |   | 
| settings.redirects.merchandising | boolean to disable merchandising redirects when ac form is submitted | true |   | 
| settings.redirects.singleResult | enable redirect to product detail page if search yields 1 result count | false |   |
| settings.bind.input | boolean to disable binding of the input element (selector) | true |   | 
| settings.bind.submit | boolean to disable binding of the submit event (form submission of enter key press) | true |   |
| settings.variants.field | used to set the field in which to grab the variant data from | ➖ |   | 
| settings.variants.realtime.enabled | enable real time variant updates | ➖ |   | 
| settings.variants.realtime.filters | specify which filters to use to determine which results are updated | ➖ |   | 
| settings.variants.options | object keyed by individual option field values for configuration of any option settings  | ➖ |   | 

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

## Instantiate
`AutocompleteController` requires an `AutocompleteControllerConfig` and `ControllerServices` object and is paired with an `AutocompleteStore`. The `AutocompleteStore` takes the same config, and shares the `UrlManager` service with the controller.

```typescript
import { AutocompleteController } from '@searchspring/snap-controller';
import { Client } from '@searchspring/snap-client';
import { AutocompleteStore } from '@searchspring/snap-store-mobx';
import { UrlManager, UrlTranslator, reactLinker } from '@searchspring/snap-url-manager';
import { EventManager } from '@searchspring/snap-event-manager';
import { Profiler } from '@searchspring/snap-profiler';
import { Logger } from '@searchspring/snap-logger';
import { Tracker } from '@searchspring/snap-tracker';

const autocompleteUrlManager = new UrlManager(new UrlTranslator(), reactLinker).detach();
const autocompleteController = new AutocompleteController(autocompleteConfig, {
		client: new Client(globals, clientConfig),
		store: new AutocompleteStore(autocompleteConfig, { urlManager: autocompleteUrlManager }),
		urlManager: autocompleteUrlManager,
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
autocompleteController.init();
```

## Bind
<!-- TODO: set/test link to DomTargeter -->
Invoking the `bind` method is required to attach event listeners to each input specified as `selector` in the `AutocompleteControllerConfig`.

```typescript
autocompleteController.bind();
```

## Unbind
<!-- TODO: set/test link to DomTargeter -->
Invoking the `unbind` method will remove attached event listeners previously attached by the `bind` method.

```typescript
autocompleteController.unbind();
```

## Search
This will invoke a search request to Searchspring's search API and populate the store with the response. This should be automatically called by the DOM event binding that occurs when the `bind` method (see above) is invoked.

```typescript
autocompleteController.search();
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

### focusChange
- Called with `eventData` = { controller }
- Invoked when an input has been focused

### beforeSubmit
- Called with `eventData` = { controller, input }
- Invoked prior to submission of autocomplete search

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

