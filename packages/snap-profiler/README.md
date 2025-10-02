# Snap Profiler


Snap Profiler is a utility available on each controller via `controller.profiler` for recording how long something takes to complete. `Profiler` is used in finding API response, component rendering and Middleware execution times.


## `setNamespace` method
Programatically set the namespace after construction.

```typescript
controller.profiler.setNamespace('namespace');
```

## `create` method
Create a new profile.

```typescript
const searchProfile = controller.profiler.create({ 
	type: 'event', 
	name: 'search', 
	context: params // any additional context
});
```

## `start` method

This will start the profiler timer.

```typescript
searchProfile.start();
```

## `stop` method
This will stop the profiler timer.

```typescript
searchProfile.stop();
```

## `namespace` property
Profile namespace that was set using the `Profiler` constructor or the `setNamespace` method.

```typescript
console.log(`namespace: ${searchProfile.namespace}`);
```

## `type` property
Profile type that was set in the `create` method `ProfileDetails` parameters.

```typescript
console.log(`type: ${searchProfile.type}`);
```

## `name` property
Profile name that was set in the `create` method `ProfileDetails` parameters.

```typescript
console.log(`name: ${searchProfile.name}`);
```

## `context` property
Profile context that was set in the `create` method `ProfileDetails` parameters. The context is used to provide additional details regarding the profile. A search profile would likely contain the request parameters amoung other things.

```typescript
console.log(`context: ${searchProfile.context}`);
```

## `status` property
Profile status. The default value is `pending`.

The value will change to `started` when the `start` method is invoked and to `finished` when the `stop` method is invoked.

```typescript
console.log(`context: ${searchProfile.status}`);
```

## `time` property
Profile time object is of type `ProfileTime`:

```typescript
type ProfileTime = {
	date: number;
	begin: number;
	end: number;
	run: number;
};
```

`ProfileTime.date` - set to `Date.now()` when `start` method is invoked.

`ProfileTime.begin` - set to `window.performance.now()` when `start` method is invoked.

`ProfileTime.end` - set to `window.performance.now()` when `stop` method is invoked.

`ProfileTime.run` - set to the total running time in milliseconds between when the `start` and `stop` methods have been invoked.


## Logging profiles
It is recommended to use the [Snap Logger's `profile`](https://searchspring.github.io/snap/reference-logger#profile-method) method to log Snap Profiles as it provides a clean output for easy parsing.