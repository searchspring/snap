## Snap Events

Lets look at how to integrate into various Snap events utilizing the internal core [@searchspring/snap-event-manager](https://github.com/searchspring/snap/tree/main/packages/snap-event-manager) package. 

The Snap instance that we create will return a `controllers` object with all of the requested controllers specified in the config. 

There are two ways we can attach events to our controllers. Using the config, or directly on the controller. 


## Config Middleware

On the config we can specify middleware via `plugin` or `on`.

### on

The `on` property is an object that has event name(s) as the key and the middleware function as the value.

The value can also be an array of functions if attaching multiple middleware to a single event. 

```typescript
const config = {
	client: {
		globals: {
			siteId: 'xxxxxx',
		},
	},
	controllers: {
		search: [
			{
				config: {
					id: 'search',
					on: {
						init: async(eventData, next) => {
							console.log("runs on init", eventData);
							await next();
						}
					}
				},
				targets: [
					{
						name: 'content',
						selector: '#searchspring-content',
						component: Content,
						hideTarget: true,
					},
					{
						name: 'sidebar',
						selector: '#searchspring-sidebar',
						component: Sidebar,
						hideTarget: true,
					},
				],
			},
		],
	},
};
```


### plugin

The `plugin` property is a function (or array of functions) that returns the controller to then access or attach middleware events.

```typescript
const config = {
	client: {
		globals: {
			siteId: 'xxxxxx',
		},
	},
	controllers: {
		search: [
			{
				config: {
					id: 'search',
					plugin: (controller) => {
						controller.on('init', async(eventData, next) => {
							console.log("runs on init", eventData);
							await next();
						});
					}
				},
				targets: [
					{
						selector: '#searchspring-content',
						component: Content,
						hideTarget: true,
					},
					{
						selector: '#searchspring-sidebar',
						component: Sidebar,
						hideTarget: true,
					},
				],
			},
		],
	},
};
```

## Controller Events

Alternatively we can also attach events to our controllers after they have been returned from creating a Snap instance via the `controllers` property that contains an object of all the controllers that have been specified in the config.

Lets use the `config` from above. Since our search controller has an `id` of `'search'`, we can reference it as follows:

```typescript
const snap = new Snap(config);
const { search } = snap.controllers;

console.log("Search Controller: ", search);
```

We can now attach middleware events in the following methods:

### controller.on

```typescript
search.on('afterSearch', async(eventData, next) => {
	console.log("runs on afterSearch", eventData);
	await next();
});
```

### controller.plugin

```typescript
search.plugin((controller) => {
	controller.on('afterStore', async(eventData, next) => {
		console.log("runs on afterStore", eventData);
		await next();
	});
});
```
Note: It is possible that the init event has already fired by this time (should a target be found immediately by a search controller). For this reason it is recommended to just use a plugin to access the controller directly after creation.

```typescript
search.plugin((controller) => {
	controller.store.custom.variables = {
		currency: {
			symbol: '$'
		}
	}
});
```

## Available Events

## Search Events

### init
- Called with `eventData` = { controller }
- Called automatically with first `search()` of the controller or invoked by a call to the `init` controller method

### beforeSearch
- Called with `eventData` = { controller, request }
- Always invoked before an API request is made 
- Sets `controller.store.loading = true`

### afterSearch
- Called with `eventData` = { controller, request, response }
- Always invoked after an API request is made 
- Invokes `window.location.replace()` if API response contains merchandising redirects AND if `config.settings.redirects.merchandising = true` (default)
- Invokes `window.location.replace()` to redirect to product detail page if API response returned a single product AND `config.settings.redirects.singleResult = true` (default)
- Sets `controller.store.loading = false`

### afterStore
- Called with `eventData` = { controller, request, response }
- Always invoked after data has been stored in Mobx store

### track.product.click
- Called with `eventData` = { controller, event, result, trackEvent } 
- Always invoked after `track.product.click()` method has been invoked
- Allows for adding custom product click events (ie. Google Analytics)


## Autocomplete Events

### init
- Called with `eventData` = { controller }
- Called automatically with first `search()` of the controller or invoked by a call to the `init` controller method

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
- Always invoked after data has been stored in Mobx store

### focusChange
- Called with `eventData` = { controller }
- Invoked when a new input element has been focused


## Finder Events

### init
- Called with `eventData` = { controller }
- Called automatically with first `search()` of the controller or invoked by a call to the `init` controller method

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
- Always invoked after data has been stored in Mobx store
- no operation

## Recommendation Events

### init
- Called with `eventData` = { controller }
- Called automatically with first `search()` of the controller or invoked by a call to the `init` controller method

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
- Always invoked after data has been stored in Mobx store

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
