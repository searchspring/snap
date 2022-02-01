# Snap Profiler

<a href="https://www.npmjs.com/package/@searchspring/snap-profiler"><img alt="NPM Status" src="https://img.shields.io/npm/v/@searchspring/snap-profiler.svg?style=flat"></a>

A utility for recording how long something takes to complete. `Profiler` is used in finding API response, component rendering and Middleware execution times.


## Dependency

Snap Profiler is a dependency of [@searchspring/snap-controller](https://github.com/searchspring/snap/tree/main/packages/snap-controller) <a href="https://www.npmjs.com/package/@searchspring/snap-controller"><img alt="NPM Status" src="https://img.shields.io/npm/v/@searchspring/snap-controller.svg?style=flat"></a>

## Installation

```bash
npm install --save @searchspring/snap-profiler
```

## Import
```typescript
import { Profiler } from '@searchspring/snap-profiler';
```


<h2 id="Profiler">Profiler</h2>
An optional `namespace` can be passed to the Profiler constructor for profile organization.

```typescript
import { Profiler } from '@searchspring/snap-profiler';

const profiler = new Profiler('namespace');
```

### `setNamespace` method
Programatically set the namespace after construction.

```typescript
import { Profiler } from '@searchspring/snap-profiler';

const profiler = new Profiler();

profiler.setNamespace('namespace');
```

### `create` method
Create a new profile.

```typescript
import { Profiler } from '@searchspring/snap-profiler';

const profiler = new Profiler();

const searchProfile = profiler.create({ 
	type: 'event', 
	name: 'search', 
	context: params
}: ProfileDetails);
```

```typescript
type ProfileDetails<T> = { 
	type: string; 
	name: string; 
	context: T;
}
```

Returns an instance of `Profile`. 


<h2 id="Profile">Profile</h2>

`Profile` is not an exported member of the Snap Profiler package. It is only returned in the Profiler `create` method.

### `start` method

This will start the profiler timer.

```typescript
searchProfile.start();
```

### `stop` method
This will stop the profiler timer.

```typescript
searchProfile.stop();
```

### `namespace` property
Profile namespace that was set using the `Profiler` constructor or the `setNamespace` method.

```typescript
console.log(`namespace: ${searchProfile.namespace}`);
```

### `type` property
Profile type that was set in the `create` method `ProfileDetails` parameters.

```typescript
console.log(`type: ${searchProfile.type}`);
```

### `name` property
Profile name that was set in the `create` method `ProfileDetails` parameters.

```typescript
console.log(`name: ${searchProfile.name}`);
```

### `context` property
Profile context that was set in the `create` method `ProfileDetails` parameters. The context is used to provide additional details regarding the profile. A search profile would likely contain the request parameters amoung other things.

```typescript
console.log(`context: ${searchProfile.context}`);
```

### `status` property
Profile status. The default value is `pending`.

The value will change to `started` when the `start` method is invoked and to `finished` when the `stop` method is invoked.

```typescript
console.log(`context: ${searchProfile.status}`);
```

### `time` property
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
It is recommended to using the Snap Logger's `profile` method to log Snap Profiles as it provides a clean output for easy parsing.