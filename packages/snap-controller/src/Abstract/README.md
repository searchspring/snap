# AbstractController

The `AbstractController` is used as the base class for all Snap controllers. As it is an abstract class, it must be extended by a subclass and cannot be instantiated.

## AbstractControllerConfig
The required configuration for all controllers is an `id`. This identifier should be unique to identify various instantiated controllers from each other.

| option | description | default value | required | 
|---|---|---|---|
| id | unique identifier for this controller | ➖ | ✔️ |

<br>

```typescript
const abstractConfig = {
	id: 'abstract',
};
```
## Instantiate
`AbstractController` cannot be instantiated and must be extended by a subclass.

## id
Attribute set by the controller config.

## type
Attribute set by the extending class.

## search
This is an abstract method that must be defined in the subclass.

## on
This method is used to attach event middleware. Each controller defines it's own events, this method provides a means to attach to them.

```typescript
controller.on('init', async(eventData, next) => {
	eventData.controller.log.debug('initialized!');
	await next();
});
```

## plugin
Modification or extension of functionality as well as attaching groups of event middleware can be done using the `plugin` method. Plugin functions can be passed additional parameters if needed.

```typescript
const paramPlugin = (controller, ...params) => {
	// params = [ 'param1', 'param2' ]
	controller.on('init', async({ controller }, next) => {
		controller.log.debug('initialized!');
		await next();
	});
}

controller.plugin(paramPlugin, 'param1', 'param2');
```

## use
The `use` method is a convenient way of attaching both middleware and plugins via a config.

```
const initMiddleware = async(eventData, next) => {
	eventData.controller.log.debug('initialized!');
	await next();
}

const plugin = (controller) => {
	controller.on('init', async({ controller }, next) => {
		controller.log.debug('initialized!');
		await next();
	});
}

const paramPlugin = (controller, ...params) => {
	// params = [ 'param1', 'param2' ]
	controller.on('init', async({ controller }, next) => {
		controller.log.debug('initialized!');
		await next();
	});
}

controller.use({
	middleware: {
		init: [ initMiddleware ]
	},
	plugins: [
		[ plugin ],
		[ paramPlugin, 'param1', 'param2' ]
	]
});
```

## Events

### init
- Called with `eventData` = { controller }
- Always invoked by a call to the `init` controller method