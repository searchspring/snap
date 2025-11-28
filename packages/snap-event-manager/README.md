# Snap Event Manager


The Snap Event Manager is available on each controller via `controller.eventManager` and is used to create events and attach middleware to them. Events are recommended to be configured via [Configuration Middleware](https://github.com/searchspring/snap/tree/main/docs/REFERENCE_CONFIGURATION_MIDDLEWARE.md) to hook into controller events at critical times in the life cycle. It also allows for custom events to be used throughout your implementation.


## Controller usage
Snap Event Manager is a dependency of Snap Controller and it is recommended to use methods of the controller to attach events to the EventManager. Additionally, different events exist for the different controllers - see the Controller documentation for more details.

## Standalone usage
### `on` method
Used to attach middleware to an event. If the event name previously had middleware attached, it will add to the middleware stack.

```js
controller.eventManager.on('interestingEvent', async (eventData, next) => {
	// do something with the eventData

	// pass control to the next middleware attached to the event
	await next();

	// do something after other middleware has fired
});
```

If a middleware returns `false` the entire middleware flow is interrupted and any remaining middleware is not executed.

### `fire` method
Invoke custom event. Data passed into the second parameter gets handed off to the middleware attached with the `on` method.

```js
controller.eventManager.fire('interestingEvent', { data: { some: 'string' } });
```

## Middleware
Middleware provide a way for mutating or modifying the data passed in during the `fire` method.

### Execution order
The first middleware attached with the `on` method is the first to execute. When calling `await next()`, control flows to the next attached middleware. This happens until the final middleware has been called after which control flows back up to the first middleware attached. The first middleware gets the first, and last opportunity to modify the data.

### Order Flow Example

```js
controller.eventManager.on('interestingEvent', async (data, next) => {
	console.log('first middleware start');
	await next();
	console.log('first middleware end');
});

controller.eventManager.on('interestingEvent', async (data, next) => {
	console.log('second middleware start');
	await next();
	console.log('second middleware end');
});

controller.eventManager.on('interestingEvent', async (data, next) => {
	console.log('third middleware start');
	await next();
	console.log('third middleware end');
});

controller.eventManager.fire('interestingEvent', { data: { some: 'string' } } );

```

After firing the `interestingEvent` event, the following would be displayed in the console:
```text
first middleware start
second middleware start
third middleware start
third middleware end
second middleware end
first middleware end
```