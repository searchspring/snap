# Snap Event Manager

<a href="https://www.npmjs.com/package/@searchspring/snap-event-manager"><img alt="NPM Status" src="https://img.shields.io/npm/v/@searchspring/snap-event-manager.svg?style=flat"></a>

The Snap Event Manager is used to create events and attach middleware to them.

When used as a service of a controller it allows you to hook into controller events at critical times in the life cycle. It also allows for custom events to be used throughout your implementation.


## Dependency

Snap Event Manager is a dependency of [@searchspring/snap-controller](https://github.com/searchspring/snap/tree/main/packages/snap-controller) <a href="https://www.npmjs.com/package/@searchspring/snap-controller"><img alt="NPM Status" src="https://img.shields.io/npm/v/@searchspring/snap-controller.svg?style=flat"></a>

## Installation

```bash
npm install --save @searchspring/snap-event-manager
```

## Import
```typescript
import { EventManager } from '@searchspring/snap-event-manager';
```
## Controller usage
Snap Event Manager is a dependency of Snap Controller and it is recommended to use methods of the controller to attach events to the EventManager. Additionally, different events exist for the different controllers - see the Controller documentation for more details.

## Standalone usage
### `on` method
Used to attach middleware to an event. If the event name previously had middleware attached, it will add to the middleware stack.

```typescript
const eventManager = new EventManager();

eventManager.on('interestingEvent', async (eventData, next) => {
	// do something with the eventData

	// pass control to the next middleware attached to the event
	await next();

	// do something after other middleware has fired
});
```

If a middleware returns `false` the entire middleware flow is interrupted and any remaining middleware is not executed.

### `fire` method
Invoke custom event. Data passed into the second parameter gets handed off to the middleware attached with the `on` method.

```typescript
eventManager.fire('interestingEvent', { data: { some: 'string' } });
```

## Middleware
Middleware provide a way for mutating or modifying the data passed in during the `fire` method.

### Execution order
The first middleware attached with the `on` method is the first to execute. When calling `await next()`, control flows to the next attached middleware. This happens until the final middleware has been called after which control flows back up to the first middleware attached. The first middleware gets the first, and last opportunity to modify the data.

### Order Flow Example

```typescript
eventManager.on('interestingEvent', async (data, next) => {
	console.log('first middleware start');
	await next();
	console.log('first middleware end');
});

eventManager.on('interestingEvent', async (data, next) => {
	console.log('second middleware start');
	await next();
	console.log('second middleware end');
});

eventManager.on('interestingEvent', async (data, next) => {
	console.log('third middleware start');
	await next();
	console.log('third middleware end');
});

eventManager.fire('interestingEvent', { data: { some: 'string' } } );

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