## Snap Events

Let's look at how to tie into various Snap events by utilizing middleware and plugins. To learn more details about middleware, and execution order of it, checkout the core [@searchspring/snap-event-manager](https://github.com/searchspring/snap/tree/main/packages/snap-event-manager) package.

The Snap instance that we create will return a `controllers` object with all of the requested controllers specified in the config. 

There are two ways we can attach events to our controllers. Using the config, or directly on the controller. 


## Config Middleware

On the config we can specify middleware via `on` or `plugins` attributes.

### middleware

The `middleware` property is an object that has event name(s) as the key and and array of the middleware functions as the values.

The value can be a single function or an array of functions if attaching multiple middleware to a single event. 

```typescript
const initMiddleware = async(eventData, next) => {
	console.log("runs on init", eventData);
	await next();
}

const afterSearchMiddlewareOne = async(eventData, next) => {
	console.log("runs on afterSearch", eventData);
	await next();
}

const afterSearchMiddlewareTwo = async(eventData, next) => {
	console.log("runs on afterSearch, after afterSearchMiddlewareOne", eventData);
	await next();
}

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
					middleware: {
						init: initMiddleware,
						afterSearch: [
							afterSearchMiddlewareOne,
							afterSearchMiddlewareTwo
						]
					}
				},
			},
		],
	},
};
```


### plugins

The `plugins` property is an array of arrays of functions and optional function parameters that are used to attach functionality to controllers. Parameters can optionally be passed to the functions as shown with the `paramPlugin` below:

```typescript
const plugin = (controller) => {
	controller.on('init', async(eventData, next) => {
		console.log("runs on init", eventData);
		await next();
	});
}

const paramPlugin = (controller, ...params) => {
	controller.on('afterStore', async(eventData, next) => {
		console.log("runs on afterStore", eventData, params);
		await next();
	});
}

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
					plugins: [
						[ plugin ],
						[ paramPlugin, 'param1', 'param2' ]
					]
				},
			},
		],
	},
};
```

## Controller Events

On the controller we can attach middleware via `on` or `plugin` methods.

We can attach events to our controllers after they have been created by a Snap instance via the `getController` method. This method returns a promise that resolves to the requested controller object.

Let's use the `config` from above. Since our search controller has an `id` of `'search'`, we can reference it as follows:

```typescript
const snap = new Snap(config);
snap.getController('search').then((search) => {
	console.log("Search Controller: ", search);
});
```

We can now attach middleware events in the following methods:

### controller.on

```typescript
snap.getController('search').then((search) => {
	search.on('afterSearch', async(eventData, next) => {
		console.log("runs on afterSearch", eventData);
		await next();
	});
});
```

### controller.plugin

```typescript
snap.getController('search').then((search) => {
	search.plugin((controller) => {
		controller.on('afterStore', async(eventData, next) => {
			console.log("runs on afterStore", eventData);
			await next();
		});
	});
});

```

Next we will attach a plugin that takes additional parameters. This could be useful for sending contextual data into your plugin.

```typescript
const paramPlugin = (controller, ...params) => {
	// params = [ 'param1', 'param2' ]
	controller.on('afterStore', async(eventData, next) => {
		console.log("runs on afterStore", eventData);
		await next();
	});
}

snap.getController('search').then((search) => {
	search.plugin(paramPlugin, 'param1', 'param2');
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

###  beforeFind
- Called with `eventData` = { controller }
- Invoked after invoking the `find` method, before `window.location.href` is changed

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
