# AbstractController

The `AbstractController` is used as the base class for all Snap controllers. As it is an abstract class, it must be extended by a subclass and cannot be instantiated.

## AbstractControllerConfig
The required configuration for all controllers is an `id`. This identifier should be unique to identify various instantiated controllers from each other.

| option | description | default value | required | 
|---|---|:---:|:---:|
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

## environment
This is both a getter and a setter. Allows for setting an environment level which is used internally to hide certain logs. Possible values: `production` or `development` (LogMode enum)

## initialized
This is a getter that will return a boolean to determine if the `init` method has been invoked.

## targeters
An object containing all of the DomTargeter objects that are linked to this controller. Targeters can be added via the `addTargeter` method, or created via the `createTargeter` method. Targets are keyed by the first target's `name` or `selector`

## retarget
This method is used to invoke the `retarget` method each of the `targeters` entries.

## addTargeter
This method will add a given target (DomTargeter instance) to the `targeters` object if it does not already exist. 

## createTargeter
This method given the same parameters as DomTargeter, will create a new target (DomTargeter instance) and also invoke `addTargeter` to add the target to the `targeters` object.

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