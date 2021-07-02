## Feature Flags
This utility provides a way to check for browser feature support.

```typescript
import { getFlags, featureFlags } from '@searchspring/snap-toolbox';
```

### `getFlags` method
Returns an object with the following functions:

#### `cors` function
Tests if the browser supports cross origin (>=IE10).

When using `cors`, the `getFlags` function accepts a `userAgent` to test.

```typescript
const flags = getFlags() 
if (flags.cors()) {
	// cors is supported!
}
```

#### `cookies` function
Tests if the browser supports cookies.

```typescript
const flags = getFlags() 
if (flags.cookies()) {
	// cookies are supported!
}
```

#### `storage` function
Tests if the browser supports LocalStorage and SessionStorage.

```typescript
const flags = getFlags() 
if (flags.storage()) {
	// storage is supported!
}
```

### `featureFlags` property
`featureFlags` utilizes `getFlags` to check all flags and return an object containing feature flags eligibility.

```typescript
if (featureFlags.cors) { }
if (featureFlags.cookies) { }
if (featureFlags.storage) { }
```