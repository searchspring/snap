# Middleware

Middleware allows you to tie into the search lifecycle of a controller or various global events.

Controllers share many of the same events, however some may contain additional events. For a full list of available events and their payloads see Search, Autocomplete, Finder, or Recommendations sections.

There are two ways we can attach events to our controllers. Using the config, or directly on the controller. 

## Config Middleware

On the config we can specify middleware via `middleware` or `plugins` attributes.

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

## Controller Middleware

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


## Global Events

We can attach global events to the `window.searchspring` object via the event-manager created by the Snap instance. These events can be listened for or fired via the `on` and `fire` methods. 

Example: 
```typescript
	window.searchspring.on('myEvent', (data) => {
		console.log('myEvent happened!', data); 
	})

	window.searchspring.fire('myEvent', data);
```

## Provided Global Events

### controller/selectVariantOptions 
The `controller/selectVariantOptions` event takes a payload with 2 values, `options` and `controllerIds` (optional). 

This event will loop through all available controllers on the window, find matches to the passed controllerIds (will use all controllers if no ids are provided), and then call `variants.makeSelections` with the options provided for each `product` type result in that controller store. This allows you to programmatically select variant options for results completely outside your result components. 

The `controllerIds` can be an exact controller id string match or an array of matches - 

```typescript
controllerIds: `search`,
controllerIds: [`search`, `autocomplete`]
```

it can also take regex for partial matches -

```typescript
controllerIds: [/^recommend_/]
```
